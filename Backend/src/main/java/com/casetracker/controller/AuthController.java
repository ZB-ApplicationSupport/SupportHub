package com.casetracker.Case.Tracker.controller;

import com.supporthub.dto.AuthRequest;
import com.supporthub.dto.AuthResponse;
import com.supporthub.dto.RegisterRequest;
import com.supporthub.entity.User;
import com.supporthub.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // allow your frontend
public class AuthController {

    @Autowired
    private AuthService authService;

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            String token = authService.login(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // REGISTER (optional, you can skip if admin creates users)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        User user = authService.register(request.getUsername(), request.getPassword(), request.getRole());
        return ResponseEntity.ok(user);
    }
}
