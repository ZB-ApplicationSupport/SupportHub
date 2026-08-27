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
import com.caseapp.dto.UserDTO;

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

    @GetMapping("/assignees")
    public ResponseEntity<List<UserDTO>> getAssignees() {

        List<UserDTO> users =
                userService.getEnabledUsers()
                        .stream()
                        .map(user -> new UserDTO(
                                user.getId(),
                                user.getUsername(),
                                user.getEmail(),
                                "",
                                user.getRole(),
                                user.isEnabled()
                        ))
                        .toList();

        return ResponseEntity.ok(users);
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
    public ResponseEntity<CaseDTO> updateCase(
            @PathVariable Long id,
            @Valid @RequestBody CaseDTO dto) {

        System.out.println("=== UPDATE CASE ===");
        System.out.println("ID: " + id);
        System.out.println("Status: " + dto.getStatus());
        System.out.println("Priority: " + dto.getPriority());
        System.out.println("Assigned To: " + dto.getAssignedTo());

        Case existing = caseService.getCaseById(id);

        System.out.println("BEFORE UPDATE:");
        System.out.println("Status: " + existing.getStatus());
        System.out.println("Priority: " + existing.getPriority());
        System.out.println("Assigned To: " + existing.getAssignedTo());

        CaseMapper.updateEntityFromDto(existing, dto);

        System.out.println("AFTER MAPPER:");
        System.out.println("Status: " + existing.getStatus());
        System.out.println("Priority: " + existing.getPriority());
        System.out.println("Assigned To: " + existing.getAssignedTo());

        existing.setLastUpdatedAt(java.time.LocalDateTime.now());

        Case saved = caseService.updateCase(existing);

        System.out.println("AFTER SAVE:");
        System.out.println("Status: " + saved.getStatus());
        System.out.println("Priority: " + saved.getPriority());
        System.out.println("Assigned To: " + saved.getAssignedTo());

        return ResponseEntity.ok(CaseMapper.toDTO(saved));
    }
}
