import apiClient from '../axios';
import { SPEECH } from '../endpoints';
import { ConversationRequestDto, ConversationResponse, StandardResponse } from '../types';

// 음성 관련 서비스
export const SpeechService = {
  // 대화 요청
  conversation: async (
    audio: File | Blob,
    data: ConversationRequestDto
  ): Promise<ConversationResponse> => {
    // FormData 생성
    const formData = new FormData();
    formData.append('audio', audio);
    formData.append('selectedForeignLanguage', data.selectedForeignLanguage);
    
    if (data.conversationId) {
      formData.append('conversationId', data.conversationId);
    }
    
    // Content-Type을 multipart/form-data로 설정하기 위한 헤더
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    
    const response = await apiClient.post<StandardResponse<ConversationResponse>>(
      SPEECH.CONVERSATION,
      formData,
      { headers }
    );
    
    return response.data.data;
  },
};

export default SpeechService; 