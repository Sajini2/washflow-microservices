package lk.ac.horizoncampus.washflow.gateway.controller;

import lk.ac.horizoncampus.washflow.gateway.dto.AuthResponse;import lk.ac.horizoncampus.washflow.gateway.dto.TokenRequest;
import lk.ac.horizoncampus.washflow.gateway.dto.TokenResponse;
import lk.ac.horizoncampus.washflow.gateway.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/oauth")
public class AuthController {

    private final WebClient webClient;
    private final JwtUtil jwtUtil;
    private final String apiKey;

    public AuthController(
            WebClient.Builder webClientBuilder,
            JwtUtil jwtUtil,
            @Value("${internal.user-auth-service-url:http://localhost:8081}") String userAuthServiceUrl,
            @Value("${internal.user-auth-service-api-key:washflow-user-auth-dev-key-2026}") String apiKey) {
        this.webClient = webClientBuilder.baseUrl(userAuthServiceUrl).build();
        this.jwtUtil = jwtUtil;
        this.apiKey = apiKey;
    }

    @PostMapping("/token")
    public Mono<ResponseEntity<Object>> token(@RequestBody TokenRequest request) {
        return webClient.post()
                .uri("/auth/login")
                .header("X-API-KEY", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AuthResponse.class)
                .map(authResponse -> {
                    String jwt = jwtUtil.generateToken(authResponse.getId(), authResponse.getEmail());
                    TokenResponse tokenResponse = new TokenResponse(jwt, "Bearer", 3600);
                    return ResponseEntity.ok((Object) tokenResponse);
                })
                .onErrorResume(WebClientResponseException.class, ex -> {
                    if (ex.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                        Map<String, Object> error = Map.of(
                                "status", 401,
                                "message", "Invalid credentials",
                                "timestamp", Instant.now().toString()
                        );
                        return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error));
                    }
                    Map<String, Object> error = Map.of(
                            "status", ex.getStatusCode().value(),
                            "message", ex.getMessage(),
                            "timestamp", Instant.now().toString()
                    );
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(error));
                })
                .onErrorResume(ex -> {
                    Map<String, Object> error = Map.of(
                            "status", 503,
                            "message", "User & Authentication Service is currently unavailable",
                            "timestamp", Instant.now().toString()
                    );
                    return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error));
                });
    }
}
