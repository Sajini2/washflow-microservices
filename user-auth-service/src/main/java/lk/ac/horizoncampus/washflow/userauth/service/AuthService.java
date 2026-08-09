package lk.ac.horizoncampus.washflow.userauth.service;

import lk.ac.horizoncampus.washflow.userauth.dto.AuthResponse;
import lk.ac.horizoncampus.washflow.userauth.dto.LoginRequest;
import lk.ac.horizoncampus.washflow.userauth.dto.RegisterRequest;
import lk.ac.horizoncampus.washflow.userauth.exception.EmailAlreadyExistsException;
import lk.ac.horizoncampus.washflow.userauth.exception.InvalidCredentialsException;
import lk.ac.horizoncampus.washflow.userauth.model.User;
import lk.ac.horizoncampus.washflow.userauth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .createdAt(Instant.now())
                .build();

        User savedUser = userRepository.save(user);

        return AuthResponse.builder()
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .token(UUID.randomUUID().toString())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .token(UUID.randomUUID().toString())
                .build();
    }
}
