package com.caseapp.controller;

import com.caseapp.entity.StoredPassword;
import com.caseapp.service.StoredPasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passwords")
@RequiredArgsConstructor
public class StoredPasswordController {

    private final StoredPasswordService service;

    @GetMapping
    public ResponseEntity<List<StoredPassword>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoredPassword> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<StoredPassword> create(@RequestBody StoredPassword pwd) {
        return ResponseEntity.ok(service.save(pwd));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoredPassword> update(@PathVariable Long id, @RequestBody StoredPassword pwd) {
        StoredPassword existing = service.findById(id);
        existing.setServer(pwd.getServer());
        existing.setUsername(pwd.getUsername());
        existing.setPassword(pwd.getPassword());
        existing.setHostname(pwd.getHostname());
        existing.setUpdatedBy(pwd.getUpdatedBy());
        return ResponseEntity.ok(service.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
