package com.caseapp.controller;

import com.caseapp.dto.SignupRequestResponseDTO;
import com.caseapp.dto.UserDTO;
import com.caseapp.entity.User;
import com.caseapp.entity.enums.Role;
import com.caseapp.service.EmailService;
import com.caseapp.service.SignupRequestService;
import com.caseapp.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final SignupRequestService signupRequestService;
    private final EmailService emailService;

    @PostMapping("add/users")
    public ResponseEntity<?> addUser(@Valid @RequestBody UserDTO userDTO) {

        Role role = userDTO.getRole() != null
                ? userDTO.getRole()
                : Role.USER;

        User newUser = userService.addUser(
                userDTO.getEmail(),
                userDTO.getTemporaryPassword(),
                role
        );

        String loginLink = "http://frontend-url/login";

        String message =
                "Your account was successfully created. " +
                        "Use this link to login: " +
                        loginLink;

        emailService.sendEmail(
                newUser.getEmail(),
                "Account Created",
                message
        );

        return ResponseEntity.ok(
                "User created and email sent"
        );
    }

    @GetMapping("get/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {

        List<User> users =
                userService.getAllUsers();

        List<UserDTO> userDTOs =
                users.stream()
                        .map(user -> new UserDTO(
                                user.getId(),
                                user.getUsername(),
                                user.getEmail(),
                                "",
                                user.getRole(),
                                user.isEnabled()
                        ))
                        .toList();

        return ResponseEntity.ok(userDTOs);
    }

    @GetMapping("/signup-requests")
    public ResponseEntity<List<SignupRequestResponseDTO>>
    getSignupRequests() {

        return ResponseEntity.ok(
                signupRequestService.getPendingRequests()
        );
    }

    @PutMapping("/signup-requests/{id}/approve")
    public ResponseEntity<SignupRequestResponseDTO>
    approveSignupRequest(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                signupRequestService.approveRequest(id)
        );
    }

    @PutMapping("/signup-requests/{id}/reject")
    public ResponseEntity<SignupRequestResponseDTO>
    rejectSignupRequest(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                signupRequestService.rejectRequest(id)
        );
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserDTO>
    toggleUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body
    ) {

        User user =
                userService.getUserById(id);

        user.setEnabled(
                body.get("enabled")
        );

        User updated =
                userService.save(user);

        UserDTO dto = new UserDTO(
                user.getId(),
                updated.getUsername(),
                updated.getEmail(),
                null,
                updated.getRole(),
                updated.isEnabled()
        );

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/get/assignees")
    public ResponseEntity<List<UserDTO>> getAssignees() {

        List<User> users = userService.getEnabledUsers();

        List<UserDTO> userDTOs = users.stream()
                .map(user -> new UserDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        null,
                        user.getRole(),
                        user.isEnabled()
                ))
                .toList();

        return ResponseEntity.ok(userDTOs);
    }
}