package com.caseapp.service;

import com.caseapp.dto.AssigneeDTO;
import com.caseapp.entity.User;
import com.caseapp.entity.enums.Role;
import com.caseapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User addUser(String email, String tempPassword, Role role) {

        // Generate username from email
        String username = email.substring(0, email.indexOf("@"));

        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();

        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setRole(role);
        user.setEnabled(false);

        return userRepository.save(user);
    }

    public User enableUser(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(true);

        return userRepository.save(user);
    }

    public User getUserByUsername(String username) {

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /*
     * =========================================================
     * ENABLED USERS
     * =========================================================
     *
     * Used by the assignee dropdown.
     *
     * Only enabled users should be available for case assignment.
     */
    public List<User> getEnabledUsers() {
        return userRepository.findByEnabledTrue();
    }

    /*
     * =========================================================
     * ASSIGNEES
     * =========================================================
     *
     * Return only the information the frontend needs.
     *
     * We deliberately do NOT expose:
     * - password
     * - temporaryPassword
     * - enabled
     * - role
     */
    public List<AssigneeDTO> getAssignees() {

        return getEnabledUsers()
                .stream()
                .map(user -> new AssigneeDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail()
                ))
                .toList();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}