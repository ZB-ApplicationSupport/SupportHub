package com.caseapp.controller;

import com.caseapp.dto.SignupRequestDTO;
import com.caseapp.service.SignupRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/debug-signup")
@RequiredArgsConstructor
public class SignupRequestController {

    private final SignupRequestService signupRequestService;

    @PostMapping
    public ResponseEntity<?> requestSignup(@Valid @RequestBody SignupRequestDTO requestDTO) {
        System.out.println(">>> requestSignup called with email=" + requestDTO.getEmail());
        try {
            signupRequestService.createRequest(requestDTO);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body("Signup request created");
        } catch (RuntimeException ex) {
            System.out.println(">>> requestSignup failed: " + ex.getMessage());
            // Surface a clear message when the request cannot be saved
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Signup request failed: " + ex.getMessage());
        }
    }
}
