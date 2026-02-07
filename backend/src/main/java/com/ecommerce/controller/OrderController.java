package com.ecommerce.controller;

import com.ecommerce.dto.OrderDTO;
import com.ecommerce.model.Order;
import com.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Get all orders with optional filtering
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo) {

        if (email != null && status != null) {
            return ResponseEntity.ok(orderService.getOrdersByEmailAndStatus(email, status));
        } else if (email != null) {
            return ResponseEntity.ok(orderService.getOrdersByEmail(email));
        } else if (status != null) {
            return ResponseEntity.ok(orderService.getOrdersByStatus(status));
        } else if (dateFrom != null && dateTo != null) {
            return ResponseEntity.ok(orderService.getOrdersByDateRange(dateFrom, dateTo));
        }

        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Search orders
    @GetMapping("/search")
    public ResponseEntity<List<Order>> searchOrders(@RequestParam String query) {
        return ResponseEntity.ok(orderService.searchOrders(query));
    }

    // Get order statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getOrderStatistics() {
        return ResponseEntity.ok(orderService.getOrderStatistics());
    }

    // Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        return orderService.getOrderDTOById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new order
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        try {
            Order created = orderService.createOrder(order);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Update order status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            String status = statusUpdate.get("status");
            Order updated = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Update payment status
    @PatchMapping("/{id}/payment-status")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> paymentUpdate) {
        try {
            String paymentStatus = paymentUpdate.get("paymentStatus");
            Order updated = orderService.updatePaymentStatus(id, paymentStatus);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Update tracking information
    @PatchMapping("/{id}/tracking")
    public ResponseEntity<?> updateTracking(
            @PathVariable Long id,
            @RequestBody Map<String, String> trackingUpdate) {
        try {
            String trackingNumber = trackingUpdate.get("trackingNumber");
            String estimatedDeliveryStr = trackingUpdate.get("estimatedDeliveryDate");

            LocalDateTime estimatedDelivery = null;
            if (estimatedDeliveryStr != null && !estimatedDeliveryStr.isEmpty()) {
                estimatedDelivery = LocalDateTime.parse(estimatedDeliveryStr);
            }

            Order updated = orderService.updateTracking(id, trackingNumber, estimatedDelivery);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
