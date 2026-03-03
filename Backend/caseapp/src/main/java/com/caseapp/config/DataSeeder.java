package com.caseapp.config;

import com.caseapp.entity.SupportSystem;
import com.caseapp.entity.User;
import com.caseapp.entity.enums.Role;
import com.caseapp.repository.SupportSystemRepository;
import com.caseapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner run(UserRepository userRepository, SupportSystemRepository supportSystemRepository) {
        return args -> {
            if (userRepository.findByEmail("admin@zb.com").isEmpty()) {
                User admin = User.builder()
                        .email("admin@zb.com")
                        .password(passwordEncoder.encode("Admin123"))
                        .role(Role.ADMIN)
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

            if (supportSystemRepository.count() == 0) {
                LocalDateTime now = LocalDateTime.now();
                List<SupportSystem> systems = List.of(
                        SupportSystem.builder().name("Core Banking").category("Core Platforms").owner("Case Operations").status("Active").updatedAt(now).build(),
                        SupportSystem.builder().name("Payments Hub").category("Payments").owner("Payments Team").status("Active").updatedAt(now).build(),
                        SupportSystem.builder().name("Digital Channels").category("Channels").owner("Digital Ops").status("Active").updatedAt(now).build(),
                        SupportSystem.builder().name("Treasury").category("Treasury").owner("Treasury Ops").status("Active").updatedAt(now).build(),
                        SupportSystem.builder().name("ATM Switch").category("Infrastructure").owner("Switching").status("Inactive").updatedAt(now).build()
                );
                supportSystemRepository.saveAll(systems);
                System.out.println("Seeded " + systems.size() + " support systems");
            }
        };
    }
}
