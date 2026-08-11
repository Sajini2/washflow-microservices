package lk.ac.horizoncampus.washflow.laundry.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceResponse {

    private String id;
    private String name;
    private String description;
    private Double price;
    private Integer estimatedMinutes;
    private Instant createdAt;
}
