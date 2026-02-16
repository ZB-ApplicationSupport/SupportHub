package com.caseapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequestResponseDTO {
    private Long id;
    private String email;
    private String status;
    private LocalDateTime createdAt;
}
