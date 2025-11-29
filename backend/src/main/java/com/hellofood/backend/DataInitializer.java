package com.hellofood.backend.config; // 설정 파일 패키지 (예시)

import com.hellofood.backend.domain.user.Customer;
import com.hellofood.backend.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal; // BigDecimal import 확인
import java.time.LocalDateTime;

@Component // 💡 Spring Bean으로 등록
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // 서버 시작 시 실행될 로직

        // 1. 이미 데모 계정이 존재하는지 확인 (반복 생성 방지)
        if (customerRepository.findByEmail("demo@example.com").isEmpty()) {
            
            // 2. 비밀번호 암호화
            String rawPassword = "1234";
            String encodedPassword = passwordEncoder.encode(rawPassword);

            // 3. Customer 엔티티 생성 (Join Table 구조 반영)
            // User 엔티티의 생성자 또는 Setter를 사용합니다.
            Customer demoCustomer = new Customer();
            
            // User 필드 설정 (부모 클래스 필드)
            demoCustomer.setName("Demo User");
            demoCustomer.setEmail("demo@example.com");
            demoCustomer.setPassword(encodedPassword); // 암호화된 비밀번호
            demoCustomer.setPhoneNumber("010-1234-5678");
            demoCustomer.setUserType("Customer"); // Joined Table 전략의 구분자 (DTYPE)
            
            // Customer 고유 필드 및 NOT NULL 필드 설정 (필요한 경우)
            demoCustomer.setAddress("서울시 테스트구");
            demoCustomer.setRegisteredAt(LocalDateTime.now().toString()); // @CreationTimestamp가 없다면 수동 설정
            demoCustomer.setDiscountRate(0); 
            demoCustomer.setTotalOrders(0);
            demoCustomer.setTotalSpent(0);

            // 4. 데이터베이스에 저장
            customerRepository.save(demoCustomer);
            
            System.out.println("✅ Demo Customer Account created: demo@example.com / 1234");
        }
    }
}