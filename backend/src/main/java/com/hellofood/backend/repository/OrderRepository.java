package com.hellofood.backend.repository;

import com.hellofood.backend.domain.order.Order;
import com.hellofood.backend.domain.user.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

//Order 엔티티에 대한 데이터 접근을 담당하는 리포지토리 인터페이스
//Spring Data JPA가 자동으로 구현체를 생성
public interface OrderRepository extends JpaRepository<Order, Long> { //인터페이스
    
    //고객을 통해 주문 조회
    Optional<Order> findByCustomer(Customer customer);
    
    //고객 ID로 모든 주문 조회
    List<Order> findAllByCustomerId(Long customerId);

    //삭제
    void deleteById(Long orderId);

    //특정 고객의 주문 수 세기
    int countByCustomer(Customer customer);
}
