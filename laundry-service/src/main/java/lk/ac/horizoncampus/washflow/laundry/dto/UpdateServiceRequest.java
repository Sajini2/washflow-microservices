package lk.ac.horizoncampus.washflow.laundry.dto;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateServiceRequest {

    private String name;

    private String description;

    @Positive(message = "Price must be positive")
    private Double price;

    @Positive(message = "Estimated minutes must be positive")
    private Integer estimatedMinutes;
}
