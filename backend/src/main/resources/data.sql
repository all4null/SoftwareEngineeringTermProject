-- data.sql 파일 내용 예시

-- 1. 기존 데이터가 있다면 삭제 (선택 사항)
-- DELETE FROM customers WHERE email = 'demo@example.com';

-- 2. 테스트 사용자 데이터 삽입 (비밀번호는 반드시 해시되어야 합니다.)


INSERT INTO users (id, phone_number, user_type, email, name, password, registered_at, total_orders, total_spent, discount_rate)
VALUES (1, '010-1234-1234', 'customer', 'demo@example.com', 'Demo User', '2a$10$LLqqtTPJI8iX33ZRk7z4HOz6yVkXYZENkLiYuUgED4vSuglXo0R32', '2024-01-01 00:00:00', 0, 0, 0);

INSERT INTO customers (address, customer_id) 
VALUES ('시립대', 1);
