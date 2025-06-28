import { useState } from 'react';
import { Platform } from 'react-native';
import { tokenStorage } from '@/services/api/axios';

export interface ConversationMessage {
  id: string;
  timestamp: string;
  originalText: string;
  originalLanguage: string;
  translatedText: string;
  translatedLanguage: string;
  confidence: number;
  audioData?: string;
}

export const useConversation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-US');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const supportedLanguages = [
    { code: 'en-US', name: '영어 (English)', flag: '🇺🇸' },
    { code: 'vi-VN', name: '베트남어 (Tiếng Việt)', flag: '🇻🇳' },
    { code: 'th-TH', name: '태국어 (ไทย)', flag: '🇹🇭' },
    { code: 'km-KH', name: '크메르어 (ភាសាខ្មែរ)', flag: '🇰🇭' },
  ];



  const processConversation = async (audioUri: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      
      // URI에서 Blob 생성 (React Native)
      const audioBlob = await fetch(audioUri).then(r => r.blob());
      
      // FormData 생성
      const formData = new FormData();
      
      // React Native에서 파일 업로드
      const fileUpload = {
        uri: audioUri,
        type: audioBlob.type || 'audio/wav',
        name: 'recording.wav'
      };
      
      formData.append('audio', fileUpload as any);
      formData.append('selectedForeignLanguage', selectedLanguage);
      
      if (conversationId) {
        formData.append('conversationId', conversationId);
      }
      
      // JWT 토큰 가져오기
      const token = await tokenStorage.getAccessToken();
      
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
      }
      
      // fetch로 직접 요청
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${token}`,
      };
      
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/speech/conversation`, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      // 새로운 응답 구조에 맞게 데이터 추출
      const responseData = result.data;
      const message = responseData.message;
      
      const newMessage: ConversationMessage = {
        id: message.id,
        timestamp: message.timestamp,
        originalText: message.originalText,
        originalLanguage: message.originalLanguage,
        translatedText: message.translatedText || '',
        translatedLanguage: message.translatedLanguage || selectedLanguage,
        confidence: 1.0,
        audioData: message.audioData,
      };
      
      // 대화 ID 설정
      if (!conversationId) {
        setConversationId(responseData.conversationId);
      }
      
      // 메시지 추가
      setMessages(prev => [...prev, newMessage]);
      
      // 번역된 음성 자동 재생 (TTS 결과)
      if (newMessage.audioData) {
        await playTranslatedAudio(newMessage.audioData);
      }
      return newMessage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const playTranslatedAudio = async (audioData: string) => {
    try {
      setIsPlayingAudio(true);
      
      if (Platform.OS === 'web') {
        // 웹에서는 기존 방식 사용
        const audioBytes = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
        const audioBlob = new Blob([audioBytes], { type: 'audio/mpeg' });
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.onerror = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
      } else {
        // React Native에서는 expo-av 사용
        try {
          const { Audio } = await import('expo-av');
          
          // base64를 data URI로 변환
          const audioUri = `data:audio/mpeg;base64,${audioData}`;
          
          // Sound 객체 생성 및 재생
          const { sound } = await Audio.Sound.createAsync(
            { uri: audioUri },
            { shouldPlay: true }
          );
          
          // 재생 완료 시 콜백
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded) {
              if (status.didJustFinish) {
                setIsPlayingAudio(false);
                sound.unloadAsync(); // 메모리 정리
              }
            } else if (status.error) {
              setIsPlayingAudio(false);
            }
          });
        } catch (nativeError) {
          setIsPlayingAudio(false);
        }
      }
    } catch (err) {
      setIsPlayingAudio(false);
    }
  };

  const playMessageAudio = async (audioData: string) => {
    await playTranslatedAudio(audioData);
  };

  const clearConversation = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  };

  const changeLanguage = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  return {
    isLoading,
    error,
    conversationId,
    messages,
    selectedLanguage,
    supportedLanguages,
    isPlayingAudio,
    processConversation,
    playMessageAudio,
    clearConversation,
    changeLanguage,
  };
}; 