package com.caseapp.dto;

import com.caseapp.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String temporaryPassword; // can be left blank when sending data to frontend
    private Role role;
    private boolean enabled;
}
