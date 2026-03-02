package com.caseapp.dto;

import com.caseapp.entity.enums.CaseStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CaseDTO {
    private Long id;
    private String title;
    private String description;
    private String summary;
    private String systemName;
    private String priority;
    private String assignedTo;
    private CaseStatus status;
    private LocalDateTime openedAt;
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdatedAt;
    private String createdByEmail;
    private List<String> jiraRefs;
    private List<String> vendorRefs;
}
