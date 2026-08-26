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
        String username = authentication.getName();
        User user = userService.getUserByUsername(username);
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

        System.out.println("=== GET CASES START ===");

        try {
            String username = authentication.getName();

            System.out.println("Username: " + username);

            User user = userService.getUserByUsername(username);

            System.out.println("User found: " + user.getUsername());
            System.out.println("Role: " + user.getRole());

            List<Case> cases;

            if (user.getRole() == com.caseapp.entity.enums.Role.ADMIN) {
                System.out.println("Loading ALL cases");
                cases = caseService.getAllCases();
            } else {
                System.out.println("Loading USER cases");
                cases = caseService.getCasesByUser(user);
            }

            System.out.println("Cases found: " + cases.size());

            List<CaseDTO> dtos = cases.stream()
                    .map(caseEntity -> {
                        System.out.println("Mapping case ID: " + caseEntity.getId());

                        CaseDTO dto = CaseMapper.toDTO(caseEntity);

                        System.out.println(
                                "Mapped case ID: " + dto.getId()
                                        + ", status: " + dto.getStatus()
                                        + ", createdByEmail: " + dto.getCreatedByEmail()
                        );

                        return dto;
                    })
                    .collect(Collectors.toList());

            System.out.println("DTOs created: " + dtos.size());
            System.out.println("=== GET CASES END ===");

            return ResponseEntity.ok(dtos);

        } catch (Exception e) {

            System.out.println("=== GET CASES ERROR ===");
            System.out.println("Exception: " + e.getClass().getName());
            System.out.println("Message: " + e.getMessage());

            e.printStackTrace();

            throw e;
        }
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
