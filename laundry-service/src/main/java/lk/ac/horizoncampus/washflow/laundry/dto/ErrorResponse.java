package lk.ac.horizoncampus.washflow.laundry.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Standard JSON error response payload")
public class ErrorResponse {

    @Schema(description = "HTTP status code", example = "401")
    private int status;

    @Schema(description = "Detailed error message", example = "Missing or invalid API key")
    private String message;

    @Schema(description = "Timestamp when the error occurred", example = "2026-08-11T14:00:00Z")
    private Instant timestamp;
}
