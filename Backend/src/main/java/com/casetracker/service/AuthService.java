package com.casetracker.Case.Tracker.service;

import com.casetracker.entity.User;
import com.casetracker.repository.UserRepository;
import com.casetracker.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String login(String username, String password) throws Exception {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new Exception("User not found"));

        if (!user.isActive()) {
            throw new Exception("User is inactive");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new Exception("Invalid password");
        }

        return jwtUtil.generateToken(user.getUsername(), user.getRole().name());
    }

    public User register(String username, String password, String role) {
        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .role(User.Role.valueOf(role))
                .active(true)
                .build();
        return userRepository.save(user);
    }
}
