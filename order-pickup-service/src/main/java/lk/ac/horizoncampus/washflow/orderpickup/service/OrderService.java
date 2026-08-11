package lk.ac.horizoncampus.washflow.orderpickup.service;

import lk.ac.horizoncampus.washflow.orderpickup.dto.CreateOrderRequest;
import lk.ac.horizoncampus.washflow.orderpickup.dto.OrderResponse;
import lk.ac.horizoncampus.washflow.orderpickup.dto.UpdateOrderStatusRequest;
import lk.ac.horizoncampus.washflow.orderpickup.exception.OrderNotFoundException;
import lk.ac.horizoncampus.washflow.orderpickup.model.Order;
import lk.ac.horizoncampus.washflow.orderpickup.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final Set<String> ALLOWED_STATUSES = Set.of(
            "ORDER_PLACED",
            "PICKUP_SCHEDULED",
            "PICKED_UP",
            "WASHING",
            "READY_FOR_DELIVERY",
            "OUT_FOR_DELIVERY",
            "DELIVERED"
    );

    private final OrderRepository orderRepository;

    public OrderResponse create(CreateOrderRequest request) {
        Order order = Order.builder()
                .serviceId(request.getServiceId())
                .serviceName(request.getServiceName())
                .weightKg(request.getWeightKg())
                .pickupDate(request.getPickupDate())
                .address(request.getAddress())
                .status("ORDER_PLACED")
                .userId(request.getUserId())
                .createdAt(Instant.now())
                .build();

        Order savedOrder = orderRepository.save(order);
        return mapToResponse(savedOrder);
    }

    public List<OrderResponse> getAll() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getByUserId(String userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getById(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
        return mapToResponse(order);
    }

    public OrderResponse updateStatus(String id, UpdateOrderStatusRequest request) {
        if (request.getStatus() == null || !ALLOWED_STATUSES.contains(request.getStatus())) {
            throw new IllegalArgumentException("Invalid order status: " + request.getStatus()
                    + ". Allowed values are: " + ALLOWED_STATUSES);
        }

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));

        order.setStatus(request.getStatus());
        Order updatedOrder = orderRepository.save(order);
        return mapToResponse(updatedOrder);
    }

    public void delete(String id) {
        if (!orderRepository.existsById(id)) {
            throw new OrderNotFoundException(id);
        }
        orderRepository.deleteById(id);
    }

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .serviceId(order.getServiceId())
                .serviceName(order.getServiceName())
                .weightKg(order.getWeightKg())
                .pickupDate(order.getPickupDate())
                .address(order.getAddress())
                .status(order.getStatus())
                .userId(order.getUserId())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
