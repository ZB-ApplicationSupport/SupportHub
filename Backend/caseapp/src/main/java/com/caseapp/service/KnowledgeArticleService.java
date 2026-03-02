package com.caseapp.service;

import com.caseapp.entity.KnowledgeArticle;
import com.caseapp.repository.KnowledgeArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class KnowledgeArticleService {

    private final KnowledgeArticleRepository repository;

    public List<KnowledgeArticle> findAll() {
        return repository.findAll();
    }

//    public List<KnowledgeArticle> findPublished() {
//        return repository.findByIsPublishedTrue();
//    }

    public KnowledgeArticle findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));
    }

    public KnowledgeArticle save(KnowledgeArticle article) {
        article.setUpdatedAt(LocalDateTime.now());
        return repository.save(article);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
