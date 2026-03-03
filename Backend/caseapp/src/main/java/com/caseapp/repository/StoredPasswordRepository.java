package com.caseapp.repository;

import com.caseapp.entity.StoredPassword;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoredPasswordRepository extends JpaRepository<StoredPassword, Long> {
}
