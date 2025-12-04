// 사용자 --> 서버(spring-boot)로 채팅 요청 DTO
package com.hellofood.backend.dto.chat;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ChatRequestDto {
    private String sessionId; // 대화 유지용 대화ID
    private Long userId; // 사용자 ID
    private String sender;  // 사용자 유형
    private String message; // "불고기 버거 하나 줘"
}