// FASTAPI(파이썬) --> 사용자  DTO
package com.hellofood.backend.dto.chat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class ChatResponseDto {
    private String sender;  // "System" or "AI"
    private String message; // 응답 메시지
}