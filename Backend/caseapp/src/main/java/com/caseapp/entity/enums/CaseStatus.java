package com.caseapp.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CaseStatus {
    OPEN,
    PENDING,
    ESCALATED,
    CLOSED,
    WAITING_FOR_VENDOR,
    WAITING_FOR_BANK,
    IN_PROGRESS;

    @JsonCreator
    public static CaseStatus fromString(String value) {
        if (value == null || value.isBlank()) return null;
        String upper = value.toUpperCase().replace(" ", "_");
        for (CaseStatus s : values()) {
            if (s.name().equals(upper)) return s;
        }
        return null;
    }

    @JsonValue
    public String toValue() {
        return name();
    }
}

