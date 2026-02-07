package com.ecommerce.service;

import com.ecommerce.dto.OrderDTO;
import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.model.Product;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Optional<OrderDTO> getOrderDTOById(Long id) {
        return orderRepository.findById(id).map(this::convertToDTO);
    }

    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByCustomerEmailOrderByOrderDateDesc(email);
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatusOrderByOrderDateDesc(status);
    }

    public List<Order> getOrdersByEmailAndStatus(String email, String status) {
        return orderRepository.findByCustomerEmailAndStatus(email, status);
    }

    public List<Order> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findByOrderDateBetween(startDate, endDate);
    }

    public List<Order> searchOrders(String query) {
        return orderRepository.searchOrders(query);
    }

    public Map<String, Long> getOrderStatistics() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", orderRepository.count());
        stats.put("pending", orderRepository.countByStatus("PENDING"));
        stats.put("confirmed", orderRepository.countByStatus("CONFIRMED"));
        stats.put("shipped", orderRepository.countByStatus("SHIPPED"));
        stats.put("delivered", orderRepository.countByStatus("DELIVERED"));
        stats.put("cancelled", orderRepository.countByStatus("CANCELLED"));
        return stats;
    }

    @Transactional
    public Order createOrder(Order order) {
        // Calculate total amount
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItem item : order.getOrderItems()) {
            item.setOrder(order);
            // Set price from product at time of order
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProduct().getId()));
            item.setPrice(product.getPrice());

            BigDecimal itemTotal = product.getPrice().multiply(new BigDecimal(item.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        order.setTotalAmount(totalAmount);
        order.setOrderDate(LocalDateTime.now());
        order.setLastUpdated(LocalDateTime.now());
        order.setStatus("PENDING");

        if (order.getPaymentStatus() == null) {
            order.setPaymentStatus("PENDING");
        }
        if (order.getPaymentMethod() == null) {
            order.setPaymentMethod("COD");
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));

        // Validate status transition
        validateStatusTransition(order.getStatus(), status);

        order.setStatus(status);

        // Auto-update delivery date when status changes to DELIVERED
        if ("DELIVERED".equals(status) && order.getDeliveredDate() == null) {
            order.setDeliveredDate(LocalDateTime.now());
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order updatePaymentStatus(Long id, String paymentStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));

        order.setPaymentStatus(paymentStatus);
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateTracking(Long id, String trackingNumber, LocalDateTime estimatedDeliveryDate) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));

        order.setTrackingNumber(trackingNumber);
        if (estimatedDeliveryDate != null) {
            order.setEstimatedDeliveryDate(estimatedDeliveryDate);
        }

        return orderRepository.save(order);
    }

    private void validateStatusTransition(String currentStatus, String newStatus) {
        // Define valid status transitions
        Map<String, List<String>> validTransitions = Map.of(
                "PENDING", List.of("CONFIRMED", "CANCELLED"),
                "CONFIRMED", List.of("SHIPPED", "CANCELLED"),
                "SHIPPED", List.of("DELIVERED", "CANCELLED"),
                "DELIVERED", List.of(), // No transitions from delivered
                "CANCELLED", List.of() // No transitions from cancelled
        );

        List<String> allowedTransitions = validTransitions.getOrDefault(currentStatus, List.of());
        if (!allowedTransitions.contains(newStatus)) {
            throw new RuntimeException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setCustomerName(order.getCustomerName());
        dto.setCustomerEmail(order.getCustomerEmail());
        dto.setCustomerPhone(order.getCustomerPhone());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setTrackingNumber(order.getTrackingNumber());
        dto.setEstimatedDeliveryDate(order.getEstimatedDeliveryDate());
        dto.setDeliveredDate(order.getDeliveredDate());
        dto.setNotes(order.getNotes());
        dto.setOrderDate(order.getOrderDate());
        dto.setLastUpdated(order.getLastUpdated());

        // Convert order items
        List<OrderDTO.OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(this::convertItemToDTO)
                .collect(Collectors.toList());
        dto.setOrderItems(itemDTOs);

        return dto;
    }

    private OrderDTO.OrderItemDTO convertItemToDTO(OrderItem item) {
        OrderDTO.OrderItemDTO dto = new OrderDTO.OrderItemDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductImageUrl(item.getProduct().getImageUrl());
        dto.setQuantity(item.getQuantity());
        dto.setPrice(item.getPrice());
        dto.setSubtotal(item.getPrice().multiply(new BigDecimal(item.getQuantity())));
        return dto;
    }
}
