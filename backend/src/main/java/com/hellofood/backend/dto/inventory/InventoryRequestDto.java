package com.hellofood.backend.dto.inventory;

import lombok.Data;

@Data
public class InventoryRequestDto {
    private String itemName;
    private int quantityAvailable;
    private int minQuantity;
    private String unit;
}