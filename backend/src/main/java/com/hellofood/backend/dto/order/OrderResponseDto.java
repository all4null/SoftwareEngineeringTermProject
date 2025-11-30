package com.hellofood.backend.dto.order;

import com.hellofood.backend.domain.order.Order;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderResponseDto {
    private Long id;
    private String dinnerName;
    private BigDecimal totalPrice;
    private String status;
    private String orderTime;
    private String deliveryAddress;

    // Order 엔티티를 받아서 DTO로 변환하는 생성자
    public OrderResponseDto(Order order) {
        this.id = order.getOrderId();
        this.dinnerName = order.getDinnerType();
        this.totalPrice = order.getTotalPrice();
        this.status = order.getStatus().toString();
        this.orderTime = order.getOrderDate();
        this.deliveryAddress = order.getDeliveryAddress();
    }
}