package lk.ac.horizoncampus.washflow.orderpickup.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lk.ac.horizoncampus.washflow.orderpickup.dto.CreateOrderRequest;
import lk.ac.horizoncampus.washflow.orderpickup.dto.OrderResponse;
import lk.ac.horizoncampus.washflow.orderpickup.dto.UpdateOrderStatusRequest;
import lk.ac.horizoncampus.washflow.orderpickup.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Create and manage laundry orders, pickup scheduling, and delivery status")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Create a new order", description = "Places a new laundry order. Status automatically defaults to ORDER_PLACED.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Order created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request payload or validation failure"),
            @ApiResponse(responseCode = "401", description = "Missing or invalid API key")
    })
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        OrderResponse created = orderService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    @Operation(summary = "Get all orders", description = "Retrieves all laundry orders. Optionally filter by customer userId using query parameter.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Orders retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Missing or invalid API key")
    })
    public ResponseEntity<List<OrderResponse>> getOrders(
            @Parameter(description = "Optional customer user ID to filter orders") @RequestParam(required = false) String userId) {
        if (userId != null && !userId.isBlank()) {
            return ResponseEntity.ok(orderService.getByUserId(userId));
        }
        return ResponseEntity.ok(orderService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", description = "Retrieves full order details for a specific order ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order details retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Missing or invalid API key"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<OrderResponse> getOrderById(
            @Parameter(description = "Unique ID of the order to retrieve") @PathVariable String id) {
        return ResponseEntity.ok(orderService.getById(id));
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Update order status",
            description = "Updates the lifecycle status of an order. The status field must be one of the 7 valid lifecycle values: ORDER_PLACED, PICKUP_SCHEDULED, PICKED_UP, WASHING, READY_FOR_DELIVERY, OUT_FOR_DELIVERY, DELIVERED."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order status updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid status value provided"),
            @ApiResponse(responseCode = "401", description = "Missing or invalid API key"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @Parameter(description = "Unique ID of the order to update") @PathVariable String id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete order", description = "Deletes a laundry order by its unique ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Order deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Missing or invalid API key"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<Void> deleteOrder(
            @Parameter(description = "Unique ID of the order to delete") @PathVariable String id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
