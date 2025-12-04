import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import '../../App.css'; // 필요하다면 주석 해제

function VoiceOrderScreen() {
  const navigate = useNavigate();
  
  // --- 상태 관리 ---
  const [messages, setMessages] = useState([
    { sender: 'ai', text: '안녕하세요, 미스터 대박입니다. 주문을 도와드릴까요?' }
  ]);
  
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('마이크를 눌러 말씀하세요'); 
  const [sessionId, setSessionId] = useState('');
  const [orderSummary, setOrderSummary] = useState(null); // 주문 요약 객체

  // 녹음 및 스크롤 관련 Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatEndRef = useRef(null);

  // 1. 접속 시 세션 ID 생성
  useEffect(() => {
    setSessionId(Math.random().toString(36).substring(7));
  }, []);

  // 2. 자동 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- 녹음 로직 ---
  const handleStartListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = sendAudioToServer;
      mediaRecorderRef.current.start();
      
      setIsListening(true);
      setStatus('듣고 있습니다... 🎧');
    } catch (err) {
      console.error("Mic Error:", err);
      alert("마이크 사용 권한을 허용해주세요.");
    }
  };

  const handleStopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setStatus('AI가 생각 중입니다... 🤖');
    }
  };

  // --- 서버 전송 로직 (핵심 수정됨) ---
  const sendAudioToServer = async () => {
    if (audioChunksRef.current.length === 0) return;

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    audioChunksRef.current = []; // 초기화

    const formData = new FormData();
    formData.append('file', audioBlob, 'voice.wav');
    formData.append('session_id', sessionId);
    formData.append('customer_id', 1); // ★ [수정1] 백엔드 요구사항: 고객 ID 필수 추가

    try {
      // Python 서버 주소 (5000번 포트)
      const res = await axios.post('http://localhost:5000/chat', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = res.data;
      const aiJson = data.ai_response; // 백엔드가 보낸 JSON 객체

      // ★ [수정2] 사용자 메시지(User Text)는 화면에 표시하지 않음 (요청사항 반영)
      
      // 2. AI 답변 추가
      if (aiJson && aiJson.response) {
        setMessages(prev => [...prev, { sender: 'ai', text: aiJson.response }]);
      }

      // 3. 주문 상태 업데이트 (updated_state 파싱)
      if (aiJson && aiJson.updated_state) {
        setOrderSummary(aiJson.updated_state);
      }

      setStatus('마이크를 눌러 대답하세요');

      // 4. 주문 완료 처리
      if (aiJson && aiJson.is_finished) {
        setTimeout(() => {
            alert("주문이 완료되었습니다! 잠시 후 홈으로 이동합니다.");
            navigate('/customer-home'); // 주문 완료 후 이동
        }, 1000);
      }

    } catch (error) {
      console.error(error);
      setStatus('❌ 서버 연결 실패 (Python 서버를 확인하세요)');
    }
  };

  // --- 주문 요약 텍스트 포맷팅 함수 ---
  const formatOrderSummary = (state) => {
    if (!state) return "주문 내역 없음";
    const dinner = state.dinnerType ? state.dinnerType.toUpperCase() : "선택 안됨";
    const style = state.servingStyle ? state.servingStyle.toUpperCase() : "선택 안됨";
    const itemCount = state.items ? state.items.length : 0;
    return `${dinner} 디너 / ${style} 스타일 / 추가메뉴: ${itemCount}개`;
  };

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{ maxWidth: '500px', width: '100%' }}>
        
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <button
            onClick={() => navigate('/customer-home')}
            style={{
              background: 'none', border: 'none', color: '#b0b0b0',
              fontSize: '20px', cursor: 'pointer', marginRight: '15px'
            }}
          >
            ←
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFFFFF', margin: 0 }}>
            Voice Order
          </h1>
        </div>

        {/* 🛒 실시간 주문 상태 바 (데이터 연동됨) */}
        <div style={{
            backgroundColor: '#333', padding: '15px', borderRadius: '12px',
            marginBottom: '20px', border: '1px solid #FFC107',
            color: '#FFC107', fontSize: '14px', textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}>
            <strong style={{ display:'block', marginBottom:'5px', color:'white'}}>Current Order</strong>
            {formatOrderSummary(orderSummary)}
        </div>

        {/* 💬 대화 내용 (AI 메시지만 표시됨) */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '30px',
          height: '400px',
          overflowY: 'auto',
          borderLeft: '4px solid #FFC107'
        }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ 
              marginBottom: '15px', 
              textAlign: 'left' // AI 메시지는 항상 왼쪽
            }}>
              <p style={{ fontSize: '12px', color: '#FF6B6B', marginBottom: '5px', fontWeight:'bold' }}>
                AI WAITER
              </p>
              <div style={{
                display: 'inline-block',
                padding: '12px 18px',
                borderRadius: '0px 15px 15px 15px', // 말풍선 모양
                backgroundColor: '#FFC107',
                color: '#000',
                fontSize: '16px',
                fontWeight: 'bold',
                maxWidth: '90%',
                lineHeight: '1.5',
                boxShadow: '2px 2px 5px rgba(0,0,0,0.2)'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* 🎤 마이크 버튼 */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button
            onClick={isListening ? handleStopListening : handleStartListening}
            style={{
              width: '90px', height: '90px', borderRadius: '50%',
              border: '4px solid #1a1a1a', 
              backgroundColor: isListening ? '#FF6B6B' : '#FFC107',
              cursor: 'pointer', fontSize: '36px',
              boxShadow: isListening ? '0 0 20px #FF6B6B' : '0 0 10px #FFC107',
              transition: 'all 0.2s',
              transform: isListening ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            {isListening ? '⏹️' : '🎙️'}
          </button>
          <p style={{ marginTop: '15px', fontSize: '15px', color: '#b0b0b0', fontWeight: '500' }}>
            {status}
          </p>
        </div>

      </div>
    </div>
  );
}

export default VoiceOrderScreen;