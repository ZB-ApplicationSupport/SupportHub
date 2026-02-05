package com.caseapp.dto;

import com.caseapp.entity.enums.CaseStatus;
import lombok.Data;

@Data
public class CaseDTO {
    private String title;
    private String description;
    private CaseStatus status;
}

