package lk.ac.horizoncampus.washflow.userauth.config;

import lk.ac.horizoncampus.washflow.userauth.model.User;
import lk.ac.horizoncampus.washflow.userauth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public static final String DEMO_USER_ID = "6a78577eb2193109129c047b";

    @Override
    public void run(String... args) {
        try {
            userRepository.deleteAll();
            User user = User.builder()
                    .id(DEMO_USER_ID)
                    .name("Jane Doe")
                    .email("jane.doe@washflow.com")
                    .password(passwordEncoder.encode("password123"))
                    .createdAt(Instant.now())
                    .build();
            userRepository.save(user);
            log.info("Seeded initial user: jane.doe@washflow.com with ID {}", DEMO_USER_ID);
        } catch (Exception e) {
            log.error("Failed to seed initial user data: {}", e.getMessage(), e);
        }
    }
}
