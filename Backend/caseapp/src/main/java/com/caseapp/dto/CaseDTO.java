package com.caseapp.dto;

import com.caseapp.entity.enums.CaseStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CaseDTO {

    private Long id;

    private String summary;

    private String description;

    private Long supportSystemId;

    private String supportSystemName;

    private String priority;

    private Long assignedToId;

    private String assignedTo;

    private CaseStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime lastUpdatedAt;

    private Long createdById;

    private String createdByEmail;
}