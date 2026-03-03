package com.caseapp.controller;

import com.caseapp.entity.SupportSystem;
import com.caseapp.service.SupportSystemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/systems")
@RequiredArgsConstructor
public class SupportSystemController {

    private final SupportSystemService service;

    @GetMapping
    public ResponseEntity<List<SupportSystem>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupportSystem> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<SupportSystem> create(@RequestBody SupportSystem system) {
        return ResponseEntity.ok(service.save(system));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupportSystem> update(@PathVariable Long id, @RequestBody SupportSystem system) {
        SupportSystem existing = service.findById(id);
        existing.setName(system.getName());
        existing.setCategory(system.getCategory());
        existing.setOwner(system.getOwner());
        existing.setStatus(system.getStatus());
        return ResponseEntity.ok(service.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
