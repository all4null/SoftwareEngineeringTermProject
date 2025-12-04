package com.hellofood.backend.controller;

import com.hellofood.backend.dto.chat.ChatRequestDto;
import com.hellofood.backend.dto.chat.ChatResponseDto;
import com.hellofood.backend.service.ChatOrchestratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // @Controller -> @RestController 변경
@RequestMapping("/api/chat") // API 주소 그룹화
@RequiredArgsConstructor
public class ChatController {

    private final ChatOrchestratorService chatService;

    // 클라이언트가 "/talk" 로 보내면 여기로 옴
    @PostMapping("/talk")
    public ChatResponseDto handleMessage(ChatRequestDto request) {
        
        // 서비스 로직 실행 (AI 분석 -> 주문 처리 -> 결과 반환)
        return chatService.processUserMessage(request);
    }
}