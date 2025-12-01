package com.hellofood.backend.controller;

import com.hellofood.backend.domain.user.Customer;
import com.hellofood.backend.dto.user.CustomerResponseDto;
import com.hellofood.backend.repository.CustomerRepository;
import com.hellofood.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;

    // 내 정보 조회 API (등급 포함)
    // GET /api/customers/{customerId}
    @GetMapping("/{customerId}")
    public ResponseEntity<CustomerResponseDto> getCustomerInfo(@PathVariable Long customerId) {
        // 1. 고객 찾기
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid ID"));

        // 2. 주문 횟수 세기 (DB에서 계산해옴)
        // (OrderRepository에 countByCustomer 메서드가 필요합니다)
        int orderCount = orderRepository.countByCustomer(customer);

        // 3. DTO 만들어서 반환 (여기서 등급 계산됨)
        return ResponseEntity.ok(new CustomerResponseDto(customer, orderCount));
    }
}