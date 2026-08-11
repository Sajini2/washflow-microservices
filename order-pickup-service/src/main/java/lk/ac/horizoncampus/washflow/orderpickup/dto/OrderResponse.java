package lk.ac.horizoncampus.washflow.orderpickup.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Response payload containing complete order details")
public class OrderResponse {

    @Schema(description = "Unique identifier of the order", example = "650000000000000000000001")
    private String id;

    @Schema(description = "ID of the selected laundry service", example = "srv-001")
    private String serviceId;

    @Schema(description = "Name of the laundry service", example = "Wash & Fold")
    private String serviceName;

    @Schema(description = "Weight in kilograms", example = "3.5")
    private Double weightKg;

    @Schema(description = "Scheduled pickup date", example = "2026-08-20")
    private LocalDate pickupDate;

    @Schema(description = "Pickup and delivery address", example = "123 Galle Road, Colombo")
    private String address;

    @Schema(description = "Current lifecycle status of the order", example = "ORDER_PLACED")
    private String status;

    @Schema(description = "ID of the customer who placed the order", example = "usr-1001")
    private String userId;

    @Schema(description = "Timestamp when the order was created", example = "2026-08-11T15:00:00Z")
    private Instant createdAt;
}
