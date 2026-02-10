package com.caseapp.controller;

import com.caseapp.dto.UserDTO;
import com.caseapp.entity.SignupRequest;
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

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final SignupRequestService signupRequestService;
    private final EmailService emailService;

    @PostMapping("/users")
    public ResponseEntity<?> addUser(@Valid @RequestBody UserDTO userDTO) {
        User newUser = userService.addUser(userDTO.getEmail(), userDTO.getTemporaryPassword(), Role.USER);
        // Send invitation email with reset password link (generate token etc.)
        String resetLink = "http://frontend-url/reset-password?email=" + newUser.getEmail();
        String message = "You have been added. Please reset your password here: " + resetLink;
        emailService.sendEmail(newUser.getEmail(), "Account Created", message);

        return ResponseEntity.ok("User created and email sent");
    }

    @GetMapping("/signup-requests")
    public ResponseEntity<List<SignupRequest>> getSignupRequests() {
        return ResponseEntity.ok(signupRequestService.getAllRequests());
    }

    @PutMapping("/signup-requests/{id}/approve")
    public ResponseEntity<?> approveSignupRequest(@PathVariable Long id) {
        SignupRequest request = signupRequestService.approveRequest(id);
        // Create user with temp password and send email
        String tempPassword = "Temp1234"; // generate securely in production
        User user = userService.addUser(request.getEmail(), tempPassword, Role.USER);
        String resetLink = "http://frontend-url/reset-password?email=" + user.getEmail();
        String message = "Your signup request was approved. Please reset your password here: " + resetLink;
        emailService.sendEmail(user.getEmail(), "Signup Approved", message);
        return ResponseEntity.ok("Signup request approved and user created");
    }

    @PutMapping("/signup-requests/{id}/reject")
    public ResponseEntity<?> rejectSignupRequest(@PathVariable Long id) {
        signupRequestService.rejectRequest(id);
        return ResponseEntity.ok("Signup request rejected");
    }
}
