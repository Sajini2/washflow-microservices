package lk.ac.horizoncampus.washflow.orderpickup.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "orders")
public class Order {

    @Id
    private String id;
    private String serviceId;
    private String serviceName;
    private Double weightKg;
    private LocalDate pickupDate;
    private String address;
    @Builder.Default
    private String status = "ORDER_PLACED";
    private String userId;
    private Instant createdAt;
}
