package com.casetracker.Case.Tracker.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String role;
}
