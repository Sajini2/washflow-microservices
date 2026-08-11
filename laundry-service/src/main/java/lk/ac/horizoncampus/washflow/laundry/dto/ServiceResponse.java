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
@Schema(description = "Response payload representing a laundry service")
public class ServiceResponse {

    @Schema(description = "Unique identifier of the laundry service", example = "65c3b1a2f4e89c0012345678")
    private String id;

    @Schema(description = "Name of the laundry service", example = "Wash & Fold")
    private String name;

    @Schema(description = "Detailed description of the service", example = "Standard wash, dry, and fold service")
    private String description;

    @Schema(description = "Price for the service in USD", example = "5.00")
    private Double price;

    @Schema(description = "Estimated processing time in minutes", example = "45")
    private Integer estimatedMinutes;

    @Schema(description = "Timestamp when the service record was created", example = "2026-08-11T14:00:00Z")
    private Instant createdAt;
}
