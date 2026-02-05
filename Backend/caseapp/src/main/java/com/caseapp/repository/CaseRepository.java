package com.caseapp.repository;

import com.caseapp.entity.Case;
import com.caseapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CaseRepository extends JpaRepository<Case, Long> {
    List<Case> findByCreatedBy(User user);
}
