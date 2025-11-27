from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import whisper
import requests
import json
import os
import shutil
from datetime import datetime
import uuid

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Whisper 모델 로드
print("------------------------------------------------------")
print("▶ Whisper 모델 로딩 중... (잠시만 기다려주세요)")
stt_model = whisper.load_model("base")
print("▶ Whisper 모델 로딩 완료! 서버가 준비되었습니다.")
print("------------------------------------------------------")

# 2. 세션 저장소
sessions = {}

# 3. 시스템 프롬프트 (한국어 강제 명령 추가)
def get_system_prompt():
    today = datetime.now().strftime("%Y년 %m월 %d일")
    return f"""
    You are a professional waiter AI at 'Mr. Daebak Dinner Service'.
    Current Date: {today}

    [CRITICAL INSTRUCTION]
    You must respond ONLY in KOREAN. (한국어로만 답변하세요.)
    Never use English in the "response" field.

    [Menu]
    1. Valentine Dinner: Wine, Steak, Napkin (Heart plate)
    2. French Dinner: Coffee, Wine, Salad, Steak
    3. English Dinner: Scrambled eggs, Bacon, Bread, Steak
    4. Champagne Feast Dinner: Champagne(1btl), Baguette(4pcs), Coffee(1pot), Wine, Steak (Min 2 people)

    [Serving Styles]
    - Simple, Grand, Deluxe
    - Note: 'Champagne Feast' is only available in Grand or Deluxe.

    [Rules]
    1. If the user asks for a recommendation, ask if it's a special day.
    2. Calculate dates accurately based on '{today}'. (e.g., if user says 'tomorrow', calculate the date).
    3. If the user modifies the order (add/remove/change qty), reflect it immediately.
    4. Speak politely and professionally in Korean.

    [Output Format (JSON Only)]
    {{
        "response": "Your response to the customer (MUST BE KOREAN)",
        "current_order": "Summary of current order in Korean (e.g. 프렌치 디너 1개, 커피 제외)",
        "is_finished": false
    }}
    """

@app.post("/chat")
async def chat_process(
    file: UploadFile = File(...), 
    session_id: str = Form(...)
):
    temp_filename = f"temp_{uuid.uuid4()}.wav"
    
    try:
        # 1. 음성 파일 저장
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    
        # 2. STT 변환 (터미널 출력 강화)
        print(f"\n[Processing] 음성 인식 중...")
        stt_result = stt_model.transcribe(temp_filename, language="ko")
        user_text = stt_result['text']
        
        # ★ 여기에 사용자가 한 말이 크게 출력됩니다 ★
        print(f"\n🗣️  사용자({session_id}): {user_text}") 

        # 3. 대화 기록 관리
        if session_id not in sessions:
            sessions[session_id] = []
        
        sessions[session_id].append(f"Customer: {user_text}")
        conversation_history = "\n".join(sessions[session_id][-10:])

        # 4. LLM 호출
        prompt_text = f"{get_system_prompt()}\n\n[Conversation History]\n{conversation_history}\n\n[System]: Respond in JSON format. Language: Korean."
        
        print(f"🤖 AI 생각 중...") 
        response = requests.post('http://localhost:11434/api/generate', json={
            "model": "llama3", 
            "prompt": prompt_text,
            "stream": False,
            "format": "json"
        })
        
        llm_data = response.json()
        ai_response_json = json.loads(llm_data['response'])
        
        ai_text = ai_response_json.get("response", "죄송합니다. 오류가 발생했습니다.")
        
        # ★ AI 답변도 터미널에 출력 ★
        print(f"🤖 AI 답변: {ai_text}")
        print("------------------------------------------------------")

        sessions[session_id].append(f"AI: {ai_text}")

        return {
            "status": "success",
            "user_text": user_text,
            "ai_response": ai_response_json
        }

    except Exception as e:
        print(f"\n❌ 오류 발생: {e}")
        return {"status": "error", "message": str(e)}
    
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

if __name__ == "__main__":
    import uvicorn
    # 터미널 로그를 더 잘 보기 위해 log_level 설정
    uvicorn.run(app, host="0.0.0.0", port=5000, log_level="info")