//FAST API(파이썬) --> 서버(spring-boot) 로부터 오는 AI 분석 결과 DTO
package com.hellofood.backend.dto.chat;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AiAnalysisResultDto {
    // 파이썬이 보내주는 JSON 키값과 매칭
    private String intent;    // "ORDER" or "TALK"
    
    @JsonProperty("menu_name") // 파이썬의 snake_case를 자바의 camelCase로 매핑
    private String menuName;
    
    private int quantity;
    
    @JsonProperty("reply_message")
    private String replyMessage; // AI가 생성한 잡담 응답
}