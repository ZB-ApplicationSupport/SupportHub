package com.caseapp.repository;

import com.caseapp.entity.SignupRequest;
import com.caseapp.entity.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SignupRequestRepository extends JpaRepository<SignupRequest, Long> {
    Optional<SignupRequest> findByEmail(String email);
    Optional<SignupRequest> findByEmailAndStatus(String email, RequestStatus status);
    List<SignupRequest> findAllByStatus(RequestStatus status);
}

