package lk.ac.horizoncampus.washflow.orderpickup.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request body for updating an order status")
public class UpdateOrderStatusRequest {

    @NotBlank(message = "Status is required")
    @Schema(
            description = "New order status. Must be one of: ORDER_PLACED, PICKUP_SCHEDULED, PICKED_UP, WASHING, READY_FOR_DELIVERY, OUT_FOR_DELIVERY, DELIVERED",
            example = "PICKUP_SCHEDULED"
    )
    private String status;
}
