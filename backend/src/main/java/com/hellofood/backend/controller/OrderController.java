package com.hellofood.backend.controller;

import com.hellofood.backend.dto.order.OrderRequestDto;
import com.hellofood.backend.dto.order.OrderResponseDto;
import com.hellofood.backend.service.OrderService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Long> confirmOrder(@RequestBody OrderRequestDto request) {
        Long orderId = orderService.createOrder(request);
        return ResponseEntity.ok(orderId);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getOrders(@RequestParam Long customerId) {
        List<OrderResponseDto> orders = orderService.getOrders(customerId);
        return ResponseEntity.ok(orders);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        // 204 No Content 반환 (성공적으로 지웠고, 돌려줄 데이터는 없다는 뜻)
        return ResponseEntity.noContent().build();
    }

}
