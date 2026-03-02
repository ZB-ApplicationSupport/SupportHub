package com.caseapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "stored_passwords")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoredPassword {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String server;
    private String username;
    private String password;
    private String hostname;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
}
