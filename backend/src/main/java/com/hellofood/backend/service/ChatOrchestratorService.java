package com.hellofood.backend.service;

import com.hellofood.backend.dto.chat.AiAnalysisResultDto;
import com.hellofood.backend.dto.chat.ChatRequestDto;
import com.hellofood.backend.dto.chat.ChatResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Slf4j // log.info() 등 로그 기능 사용 가능
@Service
@RequiredArgsConstructor
public class ChatOrchestratorService {

    private final OrderService orderService; // [기존 서비스] 이미 만드신 주문 서비스
    private final RestTemplate restTemplate = new RestTemplate(); // 외부 API 호출 도구

    // 파이썬 FastAPI 주소
    private static final String AI_SERVER_URL = "http://localhost:8000/analyze";

    public ChatResponseDto processUserMessage(ChatRequestDto request) {
        String userMessage = request.getMessage();
        log.info("사용자 메시지 수신: {}", userMessage);

        try {
            // 1. FastAPI로 텍스트 분석 요청
            // ChatRequqestDto를 안쓰는 이유는 해당Dto springboot 백엔드와 리액트프론트에 사용되므로 서로간에 결합도 낮추기위함
            // (따라서 Map으로 간단히 만듦)
            Map<String, String> aiRequest = new HashMap<>();
            aiRequest.put("text", userMessage); //text 전달
            aiRequest.put("user_id", request.getSender()); //userId 전달
            aiRequest.put("session_id", request.getSessionId()); // ★ 핵심: 세션 ID 전달

            ResponseEntity<AiAnalysisResultDto> response = restTemplate.postForEntity(
                    AI_SERVER_URL,
                    aiRequest,
                    AiAnalysisResultDto.class
            );

            AiAnalysisResultDto aiResult = response.getBody();

            if (aiResult == null) {
                return new ChatResponseDto("System", "AI 서버 응답이 없습니다.");
            }

            // 2. 의도(Intent) 확인 및 분기 처리
            if ("ORDER".equals(aiResult.getIntent())) {
                return handleOrderIntent(request.getUserId(), aiResult);
            } else {
                // 잡담(TALK)인 경우 AI의 답변 그대로 전달
                return new ChatResponseDto("AI", aiResult.getReplyMessage());
            }

        } catch (Exception e) {
            log.error("AI 서버 통신 중 오류", e);
            return new ChatResponseDto("System", "죄송합니다. 잠시 후 다시 말씀해 주세요.");
        }
    }

    // 주문 처리 로직
    private ChatResponseDto handleOrderIntent(Long userId, AiAnalysisResultDto aiResult) {
        String menuName = aiResult.getMenuName();
        int quantity = aiResult.getQuantity();

        try {
            // [기존 코드 재사용] OrderService의 메서드 호출
            // 예: public void createOrderFromChat(String userId, String menuName, int count)
            orderService.createOrderFromChat(userId, menuName, quantity);
            
            return new ChatResponseDto("System",
                    String.format("[%s] %d개 주문이 정상적으로 접수되었습니다.", menuName, quantity));
            
        } catch (Exception e) {
            // 메뉴가 없거나 재고가 없을 때 등 예외 처리
            return new ChatResponseDto("System", "주문 실패: " + e.getMessage());
        }
    }
}