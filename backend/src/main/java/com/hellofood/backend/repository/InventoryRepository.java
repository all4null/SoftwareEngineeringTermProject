package com.hellofood.backend.repository;

import com.hellofood.backend.domain.inventory.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    // 필요한 경우 이름으로 검색하는 기능 추가
    // Optional<Inventory> findByItemName(String itemName);
}