package lk.ac.horizoncampus.washflow.laundry.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "laundry_services")
public class LaundryService {

    @Id
    private String id;

    private String name;

    private String description;

    private Double price;

    private Integer estimatedMinutes;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
