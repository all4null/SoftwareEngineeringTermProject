package com.hellofood.backend.controller;

import com.hellofood.backend.dto.order.OrderRequestDto;
import com.hellofood.backend.dto.order.OrderResponseDto;
import com.hellofood.backend.dto.order.OrderListResponseDto;
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

    //Order 생성
    @PostMapping
    public ResponseEntity<Long> confirmOrder(@RequestBody OrderRequestDto request) {
        Long orderId = orderService.createOrder(request);
        return ResponseEntity.ok(orderId);
    }

    //Cutomser 개인 주문 목록 조회
    @GetMapping
    public ResponseEntity<List<OrderListResponseDto>> getOrders(@RequestParam Long customerId) {
        List<OrderListResponseDto> orders = orderService.getOrders(customerId);
        return ResponseEntity.ok(orders);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        // 204 No Content 반환 (성공적으로 지웠고, 돌려줄 데이터는 없다는 뜻)
        return ResponseEntity.noContent().build();
    }


    //주문 상세 조회
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDto> getOrderDetails(@PathVariable Long orderId) {
        OrderResponseDto order = orderService.getOrderDetails(orderId);
        return ResponseEntity.ok(order);
    }

}
