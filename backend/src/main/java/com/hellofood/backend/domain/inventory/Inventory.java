package com.hellofood.backend.domain.inventory;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "inventories")
@Getter
@Setter
public class Inventory {
    
    @Id // ★ 이 어노테이션이 누락되어서 에러가 발생했습니다.
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stockID;


    private String itemName; // ->name
    private int quantityAvailable; // -> quantity
    private String unit; // -> unit
    private int minQuantity; // -> min
    private String status ; // -> status Good Low Critical

    public Inventory() {} //JPA 기본 생성자

    public Inventory(String itemName, int quantityAvailable, int minQuantity, String unit, String status) {
        this.itemName = itemName;
        this.quantityAvailable = quantityAvailable;
        this.minQuantity = minQuantity;
        this.unit = unit;
        this.status = status;
    }
    
}
