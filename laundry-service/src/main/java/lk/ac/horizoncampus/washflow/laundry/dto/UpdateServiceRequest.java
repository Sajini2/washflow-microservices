package lk.ac.horizoncampus.washflow.laundry.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request payload for updating an existing laundry service (partial update)")
public class UpdateServiceRequest {

    @Schema(description = "Updated name of the laundry service", example = "Wash & Fold")
    private String name;

    @Schema(description = "Updated description of the service", example = "Standard wash, dry, and fold service")
    private String description;

    @Positive(message = "Price must be positive")
    @Schema(description = "Updated price for the service in USD", example = "5.00")
    private Double price;

    @Positive(message = "Estimated minutes must be positive")
    @Schema(description = "Updated estimated processing time in minutes", example = "45")
    private Integer estimatedMinutes;
}
