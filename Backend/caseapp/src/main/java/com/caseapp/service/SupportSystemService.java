package com.caseapp.service;

import com.caseapp.entity.SupportSystem;
import com.caseapp.repository.SupportSystemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SupportSystemService {

    private final SupportSystemRepository repository;

    public List<SupportSystem> findAll() {
        return repository.findAll();
    }

    public SupportSystem findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("System not found"));
    }

    public SupportSystem save(SupportSystem system) {
        system.setUpdatedAt(LocalDateTime.now());
        return repository.save(system);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
