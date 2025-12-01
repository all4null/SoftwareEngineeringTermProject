package com.hellofood.backend.service;

import com.hellofood.backend.domain.order.Order;
import com.hellofood.backend.domain.order.Order.OrderStatus;
import com.hellofood.backend.dto.order.OrderResponseDto;
import com.hellofood.backend.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class StaffOrderService {
    
    private final OrderRepository orderRepository;


    // Status 기반 주문 조회
    public List<OrderResponseDto> getOrders(OrderStatus status) {
        List<Order> orders;

        // 1. 파라미터로 넘어온 status가 있으면 그걸로 검색, 없으면 전체 검색
        if (status == null) {
            orders = orderRepository.findAll(); // 전체 조회
        } else {
            orders = orderRepository.findByStatus(status); // 상태별 조회
        }

        // 2. 조회된 주문 엔티티(Order)들을 응답용 DTO(OrderResponseDto)로 변환
        return orders.stream()
                .map(OrderResponseDto::new) // DTO 생성자가 있다고 가정 (아래 설명 참고)
                .collect(Collectors.toList());
    }
    
    //  주문 상태 업데이트
    public void updateStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문 없음"));

        // 유효성 검사 (옵션): 이미 배달 완료된걸 다시 요리중으로 못 바꾸게 막기 등
        // if (order.getStatus() == OrderStatus.COMPLETED) throw ...

        order.setStatus(newStatus);
        
        // (확장 기능) 만약 상태가 '배달중'으로 바뀌면 고객에게 알림(SMS/Push) 보내기 로직 추가
    }
}