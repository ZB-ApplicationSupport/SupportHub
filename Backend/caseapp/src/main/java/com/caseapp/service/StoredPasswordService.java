package com.caseapp.service;

import com.caseapp.entity.StoredPassword;
import com.caseapp.repository.StoredPasswordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class StoredPasswordService {

    private final StoredPasswordRepository repository;

    public List<StoredPassword> findAll() {
        return repository.findAll();
    }

    public StoredPassword findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Password record not found"));
    }

    public StoredPassword save(StoredPassword pwd) {
        LocalDateTime now = LocalDateTime.now();
        if (pwd.getCreatedAt() == null) pwd.setCreatedAt(now);
        pwd.setUpdatedAt(now);
        return repository.save(pwd);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
