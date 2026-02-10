package com.caseapp.controller;

import com.caseapp.entity.Case;
import com.caseapp.entity.User;
import com.caseapp.service.CaseService;
import com.caseapp.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class CaseController {

    private final CaseService caseService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createCase(@Valid @RequestBody Case caseRequest, Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        caseRequest.setCreatedBy(user);
        caseRequest.setCreatedAt(java.time.LocalDateTime.now());
        caseRequest.setLastUpdatedAt(java.time.LocalDateTime.now());
        Case createdCase = caseService.createCase(caseRequest);
        return ResponseEntity.ok(createdCase);
    }

    @GetMapping
    public ResponseEntity<List<Case>> getUserCases(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        List<Case> cases;
        if (user.getRole().name().equals("ADMIN")) {
            cases = caseService.getAllCases();
        } else {
            cases = caseService.getCasesByUser(user);
        }
        return ResponseEntity.ok(cases);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Case> getCaseById(@PathVariable Long id) {
        Case caseEntity = caseService.getCaseById(id);
        return ResponseEntity.ok(caseEntity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Case> updateCase(@PathVariable Long id, @Valid @RequestBody Case updatedCase) {
        Case existingCase = caseService.getCaseById(id);
        existingCase.setTitle(updatedCase.getTitle());
        existingCase.setDescription(updatedCase.getDescription());
        existingCase.setStatus(updatedCase.getStatus());
        existingCase.setLastUpdatedAt(java.time.LocalDateTime.now());
        Case savedCase = caseService.updateCase(existingCase);
        return ResponseEntity.ok(savedCase);
    }

}
