package com.caseapp.controller;

import com.caseapp.dto.SignupRequestDTO;
import com.caseapp.service.SignupRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/signup-request")
@RequiredArgsConstructor
public class SignupRequestController {

    private final SignupRequestService signupRequestService;

    @PostMapping
    public ResponseEntity<?> requestSignup(@Valid @RequestBody SignupRequestDTO requestDTO) {
        signupRequestService.createRequest(requestDTO.getEmail());
        return ResponseEntity.ok("Signup request submitted");
    }
}
