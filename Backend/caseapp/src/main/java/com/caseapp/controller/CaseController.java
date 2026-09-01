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
    public ResponseEntity<CaseDTO> createCase(
            @Valid @RequestBody CaseDTO dto,
            Authentication authentication
    ) {

        Case created =
                caseService.createCase(
                        dto,
                        authentication.getName()
                );

        return ResponseEntity.ok(
                CaseMapper.toDTO(created)
        );
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

        CaseDTO dto = CaseMapper.toDTO(caseEntity);

        System.out.println("=== GET CASE BY ID ===");
        System.out.println("ID: " + dto.getId());
        System.out.println("Summary: " + dto.getSummary());
        System.out.println("Description: " + dto.getDescription());
        System.out.println("Support System ID: " + dto.getSupportSystemId());
        System.out.println("Support System Name: " + dto.getSupportSystemName());
        System.out.println("Assigned To ID: " + dto.getAssignedToId());
        System.out.println("Assigned To: " + dto.getAssignedTo());
        System.out.println("Status: " + dto.getStatus());

        return ResponseEntity.ok(dto);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CaseDTO> updateCase(
            @PathVariable Long id,
            @Valid @RequestBody CaseDTO dto
    ) {

        System.out.println("========================================");
        System.out.println("          UPDATE CASE REQUEST");
        System.out.println("========================================");

        System.out.println("ID: " + id);
        System.out.println("Summary: " + dto.getSummary());
        System.out.println("Description: " + dto.getDescription());
        System.out.println("Support System ID: " + dto.getSupportSystemId());
        System.out.println("Assigned To ID: " + dto.getAssignedToId());
        System.out.println("Priority: " + dto.getPriority());
        System.out.println("Status: " + dto.getStatus());

        System.out.println("========================================");


        Case updated =
                caseService.updateCase(
                        id,
                        dto
                );


        CaseDTO response =
                CaseMapper.toDTO(updated);


        System.out.println("========================================");
        System.out.println("          UPDATE CASE RESPONSE");
        System.out.println("========================================");

        System.out.println("ID: " + response.getId());
        System.out.println("Summary: " + response.getSummary());
        System.out.println("Description: " + response.getDescription());
        System.out.println("Support System ID: " + response.getSupportSystemId());
        System.out.println("Support System Name: " + response.getSupportSystemName());
        System.out.println("Assigned To ID: " + response.getAssignedToId());
        System.out.println("Assigned To: " + response.getAssignedTo());
        System.out.println("Priority: " + response.getPriority());
        System.out.println("Status: " + response.getStatus());

        System.out.println("========================================");


        return ResponseEntity.ok(response);
    }
}
