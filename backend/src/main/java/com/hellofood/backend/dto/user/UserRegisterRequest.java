package com.hellofood.backend.dto.user;

import java.util.Date;

import lombok.Getter;

/*
예를들어, 아래와 같은 JSON 형태의 데이터를 받았다고 치자.
{
    "name": "홍길동",
    "email": "test@example.com",
    "password": "securepassword123",
    "address": "서울시 강남구",
    "phoneNumber": "010-1234-5678"
}

그럼 RegisterRequest 클래스는 이 JSON 데이터를 매핑하기 위한 DTO(Data Transfer Object) 역할을 한다.
스프링은 자동으로 JSON 필드를 RegisterRequest 클래스의 필드에 매핑해준다.
그래서 컨트롤러 메서드에서 RegisterRequest 객체를 사용하면,
해당 필드들에 쉽게 접근할 수 있다.

쉽게 생각하면 JSON을 클래스의 필드에 바로 매핑시켜주는 도구라고 보면됨

*/
@Getter //이 어노테이션을 쓰면 필요한 메서드(getName, getEmail..)를 자동으로 만들어준
//DTO로 회원가입 데이터 받음
public class UserRegisterRequest {
    private String name;
    private String email;
    private String password;
    private String address;
    private String phoneNumber;
    private String registeredAt;
    private Integer totalOrders;
    private Integer totalSpent;
    private Integer discountRate;
}
