package com.caseapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "knowledge_articles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KnowledgeArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String summary;

    private String systemName;

    @Column(columnDefinition = "TEXT")
    private String tags; // comma-separated

    private LocalDateTime updatedAt;

    private String caseRef;

    @Column(columnDefinition = "TEXT")
    private String jiraRefs;

    @Column(columnDefinition = "TEXT")
    private String vendorRefs;

    @Column(columnDefinition = "TEXT")
    private String keywords;
}