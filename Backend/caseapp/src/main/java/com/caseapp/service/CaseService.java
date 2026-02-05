package com.caseapp.service;

import com.caseapp.entity.Case;
import com.caseapp.entity.User;
import com.caseapp.repository.CaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CaseService {

    private final CaseRepository caseRepository;

    public Case createCase(Case caseEntity) {
        caseEntity.setCreatedAt(LocalDateTime.now());
        caseEntity.setLastUpdatedAt(LocalDateTime.now());
        return caseRepository.save(caseEntity);
    }

    public List<Case> getCasesByUser(User user) {
        return caseRepository.findByCreatedBy(user);
    }

    public List<Case> getAllCases() {
        return caseRepository.findAll();
    }

    public Case updateCase(Case caseEntity) {
        caseEntity.setLastUpdatedAt(LocalDateTime.now());
        return caseRepository.save(caseEntity);
    }

    public Case getCaseById(Long id) {
        return caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found"));
    }
}
