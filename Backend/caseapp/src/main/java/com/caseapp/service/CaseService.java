package com.caseapp.service;

import com.caseapp.dto.CaseDTO;
import com.caseapp.entity.Case;
import com.caseapp.entity.SupportSystem;
import com.caseapp.entity.User;
import com.caseapp.repository.CaseRepository;
import com.caseapp.repository.SupportSystemRepository;
import com.caseapp.repository.UserRepository;
import com.caseapp.util.CaseMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CaseService {

    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    private final SupportSystemRepository supportSystemRepository;


    // =========================================================
    // CREATE CASE
    // =========================================================

    public Case createCase(
            CaseDTO dto,
            String username
    ) {

        User createdBy =
                userRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Authenticated user not found"
                                )
                        );


        SupportSystem supportSystem =
                null;

        if (dto.getSupportSystemId() != null) {

            supportSystem =
                    supportSystemRepository
                            .findById(dto.getSupportSystemId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Support system not found"
                                    )
                            );
        }


        User assignedTo =
                null;

        if (dto.getAssignedToId() != null) {

            assignedTo =
                    userRepository
                            .findById(dto.getAssignedToId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Assigned user not found"
                                    )
                            );
        }


        Case entity =
                CaseMapper.toEntity(
                        dto,
                        createdBy,
                        supportSystem,
                        assignedTo
                );


        LocalDateTime now =
                LocalDateTime.now();

        entity.setCreatedAt(now);
        entity.setLastUpdatedAt(now);

        return caseRepository.save(entity);
    }


    // =========================================================
    // GET CASES FOR USER
    // =========================================================

    public List<Case> getCasesByUser(User user) {

        return caseRepository
                .findByCreatedByOrAssignedTo(
                        user,
                        user
                );
    }


    // =========================================================
    // GET ALL CASES
    // =========================================================

    public List<Case> getAllCases() {

        return caseRepository.findAll();
    }


    // =========================================================
    // GET CASE BY ID
    // =========================================================

    public Case getCaseById(Long id) {

        return caseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Case not found"
                        )
                );
    }


    // =========================================================
    // UPDATE CASE
    // =========================================================

    // =========================================================
// UPDATE CASE
// =========================================================

    public Case updateCase(
            Long id,
            CaseDTO dto
    ) {

        System.out.println("========== UPDATE CASE ==========");
        System.out.println("CASE ID: " + id);
        System.out.println("ASSIGNEE ID: " + dto.getAssignedToId());
        System.out.println("PRIORITY: " + dto.getPriority());
        System.out.println("STATUS: " + dto.getStatus());
        System.out.println("=================================");

        Case existing = getCaseById(id);

        System.out.println("BEFORE UPDATE:");
        System.out.println(
                "ASSIGNEE: " +
                        (existing.getAssignedTo() != null
                                ? existing.getAssignedTo().getUsername()
                                : "Unassigned")
        );
        System.out.println(
                "PRIORITY: " +
                        existing.getPriority()
        );
        System.out.println(
                "STATUS: " +
                        existing.getStatus()
        );


        // =========================================================
        // PRIORITY
        // =========================================================

        if (dto.getPriority() != null) {

            existing.setPriority(
                    dto.getPriority()
            );
        }


        // =========================================================
        // STATUS
        // =========================================================

        if (dto.getStatus() != null) {

            existing.setStatus(
                    dto.getStatus()
            );
        }


        // =========================================================
        // ASSIGNEE
        // =========================================================

        User assignedTo =
                existing.getAssignedTo();

        if (dto.getAssignedToId() != null) {

            assignedTo =
                    userRepository
                            .findById(dto.getAssignedToId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Assigned user not found"
                                    )
                            );


        } else {

            // Explicitly allow unassigning
            existing.setAssignedTo(null);
        }


        // =========================================================
        // UPDATED TIMESTAMP
        // =========================================================

        existing.setLastUpdatedAt(
                LocalDateTime.now()
        );


        // =========================================================
        // SAVE
        // =========================================================

        Case saved =
                caseRepository.save(existing);


        System.out.println("AFTER UPDATE:");
        System.out.println(
                "ASSIGNEE: " +
                        (saved.getAssignedTo() != null
                                ? saved.getAssignedTo().getUsername()
                                : "Unassigned")
        );
        System.out.println(
                "PRIORITY: " +
                        saved.getPriority()
        );
        System.out.println(
                "STATUS: " +
                        saved.getStatus()
        );

        System.out.println("=================================");

        return saved;
    }
}