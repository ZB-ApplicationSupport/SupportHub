package com.caseapp.config;

import com.caseapp.entity.User;
import com.caseapp.entity.enums.Role;
import com.caseapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner run(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByEmail("admin@zb.com").isEmpty()) {
                User admin = User.builder()
                        .email("admin@zb.com")
                        .password(passwordEncoder.encode("Admin123"))
                        .role(Role.ADMIN)
                // user.setRole(role);
                        .build();
                userRepository.save(admin);
                System.out.println("Admin user created: admin@zb.com / Admin123");
            }

            if (userRepository.findByEmail("user@zb.com").isEmpty()) {
                User user = User.builder()
                        .email("user@zb.com")
                        .password(passwordEncoder.encode("User123"))
                        .role(Role.USER)
                        .build();
                userRepository.save(user);
                System.out.println("User created: user@zb.com / User123");
            }
        };
    }
}
