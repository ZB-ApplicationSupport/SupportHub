package com.caseapp.controller;

import com.caseapp.dto.SignupRequestDTO;
import com.caseapp.dto.SignupRequestResponseDTO;
import com.caseapp.service.SignupRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/signup-request")
@RequiredArgsConstructor
public class SignupRequestController {

    private final SignupRequestService signupRequestService;

    @PostMapping
    public ResponseEntity<SignupRequestResponseDTO> requestSignup(
            @Valid @RequestBody SignupRequestDTO requestDTO
    ) {
        log.info("signup-request received for email={}", requestDTO.getEmail());
        SignupRequestResponseDTO created = signupRequestService.createRequest(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
