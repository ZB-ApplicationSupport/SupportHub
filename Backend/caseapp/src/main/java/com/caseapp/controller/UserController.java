package com.caseapp.controller;

import com.caseapp.dto.AssigneeDTO;
import com.caseapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Get enabled users who can be assigned to cases.
     *
     * This endpoint requires authentication because
     * SecurityConfig has:
     *
     * .anyRequest().authenticated()
     */
    @GetMapping("/assignees")
    public ResponseEntity<List<AssigneeDTO>> getAssignees() {

        return ResponseEntity.ok(
                userService.getAssignees()
        );
    }
}