package com.caseapp.service;

import com.caseapp.dto.SignupRequestDTO;
import com.caseapp.dto.SignupRequestResponseDTO;
import com.caseapp.entity.SignupRequest;
import com.caseapp.entity.User;
import com.caseapp.entity.enums.RequestStatus;
import com.caseapp.entity.enums.Role;
import com.caseapp.repository.SignupRequestRepository;
import com.caseapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SignupRequestService {

    private final SignupRequestRepository signupRequestRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public SignupRequestResponseDTO createRequest(SignupRequestDTO dto) {
        String email = dto.getEmail() == null ? "" : dto.getEmail().trim();
        String password = dto.getPassword() == null ? "" : dto.getPassword();
        if (email.isEmpty() || !email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Email must be valid");
        }
        if (password.isEmpty() || password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }

        // Do not allow signup requests for emails that are already registered as users
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered as a user");
        }

        // Do not allow duplicate pending signup requests for the same email
        if (signupRequestRepository.findByEmailAndStatus(email, RequestStatus.PENDING).isPresent()) {
            throw new IllegalArgumentException("Signup request already exists for this email");
        }

        SignupRequest request = new SignupRequest();
        request.setEmail(email);
        request.setPassword(passwordEncoder.encode(password));
        request.setStatus(RequestStatus.PENDING);
        request.setCreatedAt(LocalDateTime.now());
        SignupRequest saved = signupRequestRepository.save(request);
        return toResponse(saved);
    }

    public List<SignupRequestResponseDTO> getPendingRequests() {
        return signupRequestRepository.findAllByStatus(RequestStatus.PENDING).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public SignupRequestResponseDTO approveRequest(Long requestId) {
        SignupRequest request = signupRequestRepository.findById(requestId)
                .orElseThrow(() -> new NoSuchElementException("Signup request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalArgumentException("Signup request has already been processed");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("User already exists for this email");
        }

        // Create user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // already encoded
        user.setRole(Role.USER);
        user.setEnabled(true);
        userRepository.save(user);

        // Optional: send email notification
        String loginLink = "http://localhost:3000";
        emailService.sendEmail(user.getEmail(), "Signup Approved",
                "Your signup request was approved. Proceed to log in with your credentials" + loginLink);

        // Update signup request status
        request.setStatus(RequestStatus.APPROVED);
        SignupRequest saved = signupRequestRepository.save(request);

        return toResponse(saved);
    }


    public SignupRequestResponseDTO rejectRequest(Long requestId) {
        SignupRequest request = signupRequestRepository.findById(requestId)
                .orElseThrow(() -> new NoSuchElementException("Signup request not found"));
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalArgumentException("Signup request has already been processed");
        }
        request.setStatus(RequestStatus.REJECTED);
        SignupRequest saved = signupRequestRepository.save(request);
        return toResponse(saved);
    }

    private SignupRequestResponseDTO toResponse(SignupRequest request) {
        return new SignupRequestResponseDTO(
                request.getId(),
                request.getEmail(),
                request.getStatus() == null ? null : request.getStatus().name(),
                request.getCreatedAt()
        );
    }
}

