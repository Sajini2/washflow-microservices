package lk.ac.horizoncampus.washflow.userauth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@Tag(name = "Health", description = "Service health check")
public class HealthController {

    @GetMapping("/health")
    @Operation(summary = "Check service health", description = "Public health endpoint to verify service availability (exempt from API key check)")
    @ApiResponse(responseCode = "200", description = "Service is healthy")
    @SecurityRequirements
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "service", "user-auth-service"
        ));
    }
}
