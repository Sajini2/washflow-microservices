package lk.ac.horizoncampus.washflow.orderpickup.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request body for creating a new laundry order")
public class CreateOrderRequest {

    @NotBlank(message = "Service ID is required")
    @Schema(description = "ID of the selected laundry service", example = "srv-001")
    private String serviceId;

    @NotBlank(message = "Service name is required")
    @Schema(description = "Denormalized name of the laundry service", example = "Wash & Fold")
    private String serviceName;

    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be positive")
    @Schema(description = "Estimated or actual weight of the laundry in kilograms", example = "3.5")
    private Double weightKg;

    @NotNull(message = "Pickup date is required")
    @FutureOrPresent(message = "Pickup date must be today or in the future")
    @Schema(description = "Scheduled pickup date (ISO format YYYY-MM-DD)", example = "2026-08-20")
    private LocalDate pickupDate;

    @NotBlank(message = "Address is required")
    @Schema(description = "Pickup and delivery address", example = "123 Galle Road, Colombo")
    private String address;

    @NotBlank(message = "User ID is required")
    @Schema(description = "ID of the customer placing the order", example = "usr-1001")
    private String userId;
}
