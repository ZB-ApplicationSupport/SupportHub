package com.caseapp.entity;

import com.caseapp.entity.enums.CaseStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Case {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String summary;

    private String systemName;

    private String priority;

    private String assignedTo;

    @Column(columnDefinition = "TEXT")
    private String jiraRefs; // JSON array as string

    @Column(columnDefinition = "TEXT")
    private String vendorRefs; // JSON array as string

    @ManyToOne
    private User createdBy;

    @Enumerated(EnumType.STRING)
    private CaseStatus status;

    private LocalDateTime openedAt;

    private LocalDateTime createdAt;

    private LocalDateTime lastUpdatedAt;
}
