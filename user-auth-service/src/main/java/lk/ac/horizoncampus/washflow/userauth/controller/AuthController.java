package lk.ac.horizoncampus.washflow.userauth.controller;

import jakarta.validation.Valid;
import lk.ac.horizoncampus.washflow.userauth.dto.AuthResponse;
import lk.ac.horizoncampus.washflow.userauth.dto.LoginRequest;
import lk.ac.horizoncampus.washflow.userauth.dto.RegisterRequest;
import lk.ac.horizoncampus.washflow.userauth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
