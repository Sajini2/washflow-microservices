package lk.ac.horizoncampus.washflow.orderpickup.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@Tag(name = "Health Check", description = "Service health inspection")
public class HealthController {

    @GetMapping("/health")
    @SecurityRequirements // Exclude from global API key security requirement
    @Operation(summary = "Check service health", description = "Returns service health status. Accessible publicly without an API key.")
    @ApiResponse(responseCode = "200", description = "Service is healthy")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "service", "order-pickup-service"
        ));
    }
}
