package com.caseapp.util;

import com.caseapp.dto.CaseDTO;
import com.caseapp.entity.Case;
import com.caseapp.entity.SupportSystem;
import com.caseapp.entity.User;

import java.time.LocalDateTime;

public final class CaseMapper {

    private CaseMapper() {
    }

    public static Case toEntity(
            CaseDTO dto,
            User createdBy,
            SupportSystem supportSystem,
            User assignedTo
    ) {

        if (dto == null) {
            return null;
        }

        Case entity = new Case();

        entity.setSummary(dto.getSummary());
        entity.setDescription(dto.getDescription());
        entity.setSupportSystem(supportSystem);
        entity.setPriority(dto.getPriority());
        entity.setAssignedTo(assignedTo);
        entity.setCreatedBy(createdBy);
        entity.setStatus(dto.getStatus());

        return entity;
    }


    public static void updateEntityFromDto(
            Case entity,
            CaseDTO dto,
            SupportSystem supportSystem,
            User assignedTo
    ) {

        if (entity == null || dto == null) {
            return;
        }


        // =====================================================
// SUMMARY
// =====================================================

        if (dto.getSummary() != null && !dto.getSummary().isBlank()) {
            entity.setSummary(dto.getSummary());
        }


// =====================================================
// DESCRIPTION
// =====================================================

        if (dto.getDescription() != null && !dto.getDescription().isBlank()) {
            entity.setDescription(dto.getDescription());
        }


        // =====================================================
        // SUPPORT SYSTEM
        // =====================================================

        if (supportSystem != null) {

            entity.setSupportSystem(
                    supportSystem
            );
        }


        // =====================================================
        // PRIORITY
        // =====================================================

        if (dto.getPriority() != null) {

            entity.setPriority(
                    dto.getPriority()
            );
        }


        // =====================================================
        // ASSIGNEE
        // =====================================================

        if (assignedTo != null) {

            entity.setAssignedTo(
                    assignedTo
            );
        }


        // =====================================================
        // STATUS
        // =====================================================

        if (dto.getStatus() != null) {

            entity.setStatus(
                    dto.getStatus()
            );
        }


        // =====================================================
        // UPDATED TIMESTAMP
        // =====================================================

        entity.setLastUpdatedAt(
                LocalDateTime.now()
        );
    }


    public static CaseDTO toDTO(Case entity) {

        if (entity == null) {
            return null;
        }

        CaseDTO dto = new CaseDTO();

        dto.setId(entity.getId());

        dto.setSummary(entity.getSummary());

        dto.setDescription(entity.getDescription());

        dto.setPriority(entity.getPriority());

        dto.setStatus(entity.getStatus());

        dto.setCreatedAt(entity.getCreatedAt());

        dto.setLastUpdatedAt(entity.getLastUpdatedAt());


        // Support system

        if (entity.getSupportSystem() != null) {

            dto.setSupportSystemId(
                    entity.getSupportSystem().getId()
            );

            dto.setSupportSystemName(
                    entity.getSupportSystem().getName()
            );
        }


        // Assignee

        if (entity.getAssignedTo() != null) {

            dto.setAssignedToId(
                    entity.getAssignedTo().getId()
            );

            dto.setAssignedTo(
                    entity.getAssignedTo().getUsername()
            );
        }


        // Creator

        if (entity.getCreatedBy() != null) {

            dto.setCreatedById(
                    entity.getCreatedBy().getId()
            );

            dto.setCreatedByEmail(
                    entity.getCreatedBy().getEmail()
            );
        }

        return dto;
    }
}