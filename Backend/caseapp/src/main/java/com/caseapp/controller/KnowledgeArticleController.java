package com.caseapp.controller;

import com.caseapp.entity.KnowledgeArticle;
import com.caseapp.service.KnowledgeArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/knowledge")
@RequiredArgsConstructor
public class KnowledgeArticleController {

    private final KnowledgeArticleService service;

//    @GetMapping
//    public ResponseEntity<List<KnowledgeArticle>> getAll(
//            @RequestParam(required = false) Boolean publishedOnly) {
//        if (Boolean.TRUE.equals(publishedOnly)) {
//            return ResponseEntity.ok(service.findPublished());
//        }
//        return ResponseEntity.ok(service.findAll());
//    }

    @GetMapping("/{id}")
    public ResponseEntity<KnowledgeArticle> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<KnowledgeArticle> create(@RequestBody KnowledgeArticle article) {
        return ResponseEntity.ok(service.save(article));
    }

    @PutMapping("/{id}")
    public ResponseEntity<KnowledgeArticle> update(@PathVariable Long id, @RequestBody KnowledgeArticle article) {
        KnowledgeArticle existing = service.findById(id);
        existing.setTitle(article.getTitle());
        existing.setSummary(article.getSummary());
        //existing.setSystem(article.getSystem());
        existing.setTags(article.getTags());
        existing.setCaseRef(article.getCaseRef());
        existing.setJiraRefs(article.getJiraRefs());
        existing.setVendorRefs(article.getVendorRefs());
        existing.setKeywords(article.getKeywords());
        return ResponseEntity.ok(service.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
