package com.ecommerce.repository;

import com.ecommerce.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerEmail(String email);

    List<Order> findByCustomerEmailOrderByOrderDateDesc(String email);

    List<Order> findByStatus(String status);

    List<Order> findByStatusOrderByOrderDateDesc(String status);

    List<Order> findByCustomerEmailAndStatus(String email, String status);

    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<Order> findAllByOrderByOrderDateDesc();

    Long countByStatus(String status);

    @Query("SELECT o FROM Order o WHERE " +
            "LOWER(o.customerName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(o.customerEmail) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "CAST(o.id AS string) LIKE CONCAT('%', :query, '%')")
    List<Order> searchOrders(@Param("query") String query);
}
