package com.caseapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "case_comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CaseComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Case aCase;

    @Column(columnDefinition = "TEXT")
    private String commentText;

    @ManyToOne
    private User createdBy;

    private LocalDateTime createdAt;
}
