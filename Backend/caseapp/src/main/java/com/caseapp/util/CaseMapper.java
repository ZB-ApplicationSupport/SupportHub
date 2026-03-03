package com.caseapp.util;

import com.caseapp.dto.CaseDTO;
import com.caseapp.entity.Case;
import com.caseapp.entity.User;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public final class CaseMapper {

    private static final String REF_SEP = ",";

    public static Case toEntity(CaseDTO dto, User createdBy) {
        if (dto == null) return null;
        Case entity = new Case();
        entity.setTitle(dto.getTitle() != null ? dto.getTitle() : dto.getSummary());
        entity.setDescription(dto.getDescription());
        entity.setSummary(dto.getSummary());
        entity.setSystemName(dto.getSystemName());
        entity.setPriority(dto.getPriority());
        entity.setAssignedTo(dto.getAssignedTo());
        entity.setStatus(dto.getStatus());
        entity.setOpenedAt(dto.getOpenedAt() != null ? dto.getOpenedAt() : java.time.LocalDateTime.now());
        entity.setCreatedBy(createdBy);
        entity.setJiraRefs(listToRefString(dto.getJiraRefs()));
        entity.setVendorRefs(listToRefString(dto.getVendorRefs()));
        return entity;
    }

    public static void updateEntityFromDto(Case entity, CaseDTO dto) {
        if (dto.getTitle() != null) entity.setTitle(dto.getTitle());
        if (dto.getSummary() != null) entity.setSummary(dto.getSummary());
        if (dto.getDescription() != null) entity.setDescription(dto.getDescription());
        if (dto.getSystemName() != null) entity.setSystemName(dto.getSystemName());
        if (dto.getPriority() != null) entity.setPriority(dto.getPriority());
        if (dto.getAssignedTo() != null) entity.setAssignedTo(dto.getAssignedTo());
        if (dto.getStatus() != null) entity.setStatus(dto.getStatus());
        if (dto.getJiraRefs() != null) entity.setJiraRefs(listToRefString(dto.getJiraRefs()));
        if (dto.getVendorRefs() != null) entity.setVendorRefs(listToRefString(dto.getVendorRefs()));
    }

    public static CaseDTO toDTO(Case entity) {
        if (entity == null) return null;
        CaseDTO dto = new CaseDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setSummary(entity.getSummary());
        dto.setSystemName(entity.getSystemName());
        dto.setPriority(entity.getPriority());
        dto.setAssignedTo(entity.getAssignedTo());
        dto.setStatus(entity.getStatus());
        dto.setOpenedAt(entity.getOpenedAt());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setLastUpdatedAt(entity.getLastUpdatedAt());
        dto.setCreatedByEmail(entity.getCreatedBy() != null ? entity.getCreatedBy().getEmail() : null);
        dto.setJiraRefs(refStringToList(entity.getJiraRefs()));
        dto.setVendorRefs(refStringToList(entity.getVendorRefs()));
        return dto;
    }

    private static String listToRefString(List<String> list) {
        if (list == null || list.isEmpty()) return null;
        return String.join(REF_SEP, list);
    }

    private static List<String> refStringToList(String s) {
        if (s == null || s.isBlank()) return Collections.emptyList();
        return Arrays.stream(s.split(REF_SEP))
                .map(String::trim)
                .filter(x -> !x.isEmpty())
                .collect(Collectors.toList());
    }
}
