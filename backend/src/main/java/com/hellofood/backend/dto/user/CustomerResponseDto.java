package com.hellofood.backend.dto.user;

import com.hellofood.backend.domain.user.Customer;
import com.hellofood.backend.domain.user.CustomerTier;
import lombok.Data;

@Data
public class CustomerResponseDto {
    private Long id;
    private String name;
    private String address;
    private String phoneNumber;
    
    // 프론트엔드가 필요한 추가 정보
    private int totalOrders;
    private String tierName;      // "GOLD"
    private int discountRate;     // 15
    private String tierIcon;      // "🥇"

    // 생성자: 고객 정보와 주문 횟수를 받아서 -> 등급까지 계산해서 넣음
    public CustomerResponseDto(Customer customer, int orderCount) {
        this.id = customer.getId();
        this.name = customer.getName();
        this.address = customer.getAddress();
        this.phoneNumber = customer.getPhoneNumber();
        this.totalOrders = orderCount;

        // ★ 여기서 1단계에서 만든 계산기 사용!
        CustomerTier tier = CustomerTier.calculateTier(orderCount);
        
        this.tierName = tier.name();
        this.discountRate = tier.getDiscountRate();
        this.tierIcon = tier.getIcon();
    }
}