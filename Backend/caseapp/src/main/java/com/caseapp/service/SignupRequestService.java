package com.caseapp.service;

import com.caseapp.dto.SignupRequestDTO;
import com.caseapp.entity.SignupRequest;
import com.caseapp.entity.enums.RequestStatus;
import com.caseapp.repository.SignupRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SignupRequestService {

    private final SignupRequestRepository signupRequestRepository;

    private final PasswordEncoder passwordEncoder;

    public SignupRequest createRequest(SignupRequestDTO dto) {
        if (signupRequestRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Signup request already exists for this email");
        }
        SignupRequest request = new SignupRequest();
        request.setEmail(dto.getEmail());
        request.setPassword(passwordEncoder.encode(dto.getPassword()));
        request.setStatus(RequestStatus.PENDING);
        request.setCreatedAt(LocalDateTime.now());
        return signupRequestRepository.save(request);
    }

    public List<SignupRequest> getAllRequests() {
        return signupRequestRepository.findAll();
    }

    public SignupRequest approveRequest(Long requestId) {
        SignupRequest request = signupRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(RequestStatus.APPROVED);
        return signupRequestRepository.save(request);
    }

    public SignupRequest rejectRequest(Long requestId) {
        SignupRequest request = signupRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(RequestStatus.REJECTED);
        return signupRequestRepository.save(request);
    }
}

