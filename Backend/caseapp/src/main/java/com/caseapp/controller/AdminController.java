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
import java.util.Map;

import java.util.List;

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
        Role role = userDTO.getRole() != null ? userDTO.getRole() : Role.USER;
        User newUser = userService.addUser(userDTO.getEmail(), userDTO.getTemporaryPassword(), role);

        //Send email with account confirmation and login link
        String loginLink = "http://frontend-url/login";
        String message = "Your account was successfully created. Use this link to login: " + loginLink;
        emailService.sendEmail(newUser.getEmail(), "Account Created", message);

        // Send invitation email with reset password link (generate token etc.)
        // String resetLink = "http://frontend-url/reset-password?email=" + newUser.getEmail();
        // String message = "You have been added. Please reset your password here: " + resetLink;
        // emailService.sendEmail(newUser.getEmail(), "Account Created", message);

        return ResponseEntity.ok("User created and email sent");
    }

    @GetMapping("get/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();

        // Convert User to UserDTO
        List<UserDTO> userDTOs = users.stream()
                .map(user -> new UserDTO(
                        user.getId(),
                        user.getEmail(),
                        "", // password not exposed
                        user.getRole(),
                        user.isEnabled()
                ))
                .toList();

        return ResponseEntity.ok(userDTOs);
    }


    @GetMapping("/signup-requests")
    public ResponseEntity<List<SignupRequestResponseDTO>> getSignupRequests() {
        return ResponseEntity.ok(signupRequestService.getPendingRequests());
    }

    @PutMapping("/signup-requests/{id}/approve")
    public ResponseEntity<SignupRequestResponseDTO> approveSignupRequest(@PathVariable Long id) {
        return ResponseEntity.ok(signupRequestService.approveRequest(id));
    }

    @PutMapping("/signup-requests/{id}/reject")
    public ResponseEntity<SignupRequestResponseDTO> rejectSignupRequest(@PathVariable Long id) {
        return ResponseEntity.ok(signupRequestService.rejectRequest(id));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserDTO> toggleUserStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        User user = userService.getUserById(id);
        user.setEnabled(body.get("enabled")); // toggle status
        User updated = userService.save(user);

        // return full DTO for frontend
        UserDTO dto = new UserDTO(
                user.getId(),
                updated.getEmail(),
                null,               // temporaryPassword is never sent to frontend
                updated.getRole(),
                updated.isEnabled()
        );

        return ResponseEntity.ok(dto);
    }


}
