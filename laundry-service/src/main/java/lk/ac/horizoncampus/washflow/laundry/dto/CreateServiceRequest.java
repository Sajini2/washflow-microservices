package lk.ac.horizoncampus.washflow.laundry.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request payload for creating a new laundry service")
public class CreateServiceRequest {

    @NotBlank(message = "Name is required")
    @Schema(description = "Name of the laundry service", example = "Wash & Fold")
    private String name;

    @Schema(description = "Detailed description of the service", example = "Standard wash, dry, and fold service")
    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    @Schema(description = "Price for the service in USD", example = "5.00")
    private Double price;

    @NotNull(message = "Estimated minutes is required")
    @Positive(message = "Estimated minutes must be positive")
    @Schema(description = "Estimated processing time in minutes", example = "45")
    private Integer estimatedMinutes;
}
