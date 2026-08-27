package com.caseapp.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CaseStatus {
    IN_PROGRESS,
    AWAITING_VENDOR,
    IN_UAT,
    RESOLVED;

    @JsonCreator
    public static CaseStatus fromString(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String upper = value.toUpperCase().replace(" ", "_");

        for (CaseStatus status : values()) {
            if (status.name().equals(upper)) {
                return status;
            }
        }

        return null;
    }

    @JsonValue
    public String toValue() {
        return name();
    }
}