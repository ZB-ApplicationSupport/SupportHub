package com.caseapp.repository;

import com.caseapp.entity.KnowledgeArticle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KnowledgeArticleRepository extends JpaRepository<KnowledgeArticle, Long> {
//    List<KnowledgeArticle> findByIsPublishedTrue();
}
