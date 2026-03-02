package com.caseapp.controller;

import com.caseapp.dto.CaseDTO;
import com.caseapp.entity.Case;
import com.caseapp.entity.User;
import com.caseapp.service.CaseService;
import com.caseapp.service.UserService;
import com.caseapp.util.CaseMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class CaseController {

    private final CaseService caseService;
    private final UserService userService;

    @PostMapping("/add")
    public ResponseEntity<CaseDTO> createCase(@Valid @RequestBody CaseDTO dto, Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        Case entity = CaseMapper.toEntity(dto, user);
        entity.setCreatedAt(java.time.LocalDateTime.now());
        entity.setLastUpdatedAt(java.time.LocalDateTime.now());
        if (entity.getOpenedAt() == null) {
            entity.setOpenedAt(java.time.LocalDateTime.now());
        }
        Case created = caseService.createCase(entity);
        return ResponseEntity.ok(CaseMapper.toDTO(created));
    }

    @GetMapping("/get")
    public ResponseEntity<List<CaseDTO>> getUserCases(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        List<Case> cases;
        if (user.getRole().name().equals("ADMIN")) {
            cases = caseService.getAllCases();
        } else {
            cases = caseService.getCasesByUser(user);
        }
        List<CaseDTO> dtos = cases.stream().map(CaseMapper::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<CaseDTO> getCaseById(@PathVariable Long id) {
        Case caseEntity = caseService.getCaseById(id);
        return ResponseEntity.ok(CaseMapper.toDTO(caseEntity));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CaseDTO> updateCase(@PathVariable Long id, @Valid @RequestBody CaseDTO dto) {
        Case existing = caseService.getCaseById(id);
        CaseMapper.updateEntityFromDto(existing, dto);
        existing.setLastUpdatedAt(java.time.LocalDateTime.now());
        Case saved = caseService.updateCase(existing);
        return ResponseEntity.ok(CaseMapper.toDTO(saved));
    }
}
