package com.hellofood.backend.domain.user;

import lombok.Getter;

@Getter
public enum CustomerTier {
    // 기준(최소 주문 횟수), 할인율(%), 아이콘
    PLATINUM(20, 20, "💎"),
    GOLD(15, 15, "🥇"),
    SILVER(10, 10, "🥈"),
    BRONZE(5, 5, "🥉"),
    REGULAR(0, 0, "👤");

    private final int minOrders;
    private final int discountRate;
    private final String icon;

    CustomerTier(int minOrders, int discountRate, String icon) {
        this.minOrders = minOrders;
        this.discountRate = discountRate;
        this.icon = icon;
    }

    // 주문 횟수를 주면 -> 등급(Tier)을 뱉어내는 계산기 함수
    public static CustomerTier calculateTier(int orderCount) {
        if (orderCount >= PLATINUM.minOrders) return PLATINUM;
        if (orderCount >= GOLD.minOrders) return GOLD;
        if (orderCount >= SILVER.minOrders) return SILVER;
        if (orderCount >= BRONZE.minOrders) return BRONZE;
        return REGULAR;
    }
}
