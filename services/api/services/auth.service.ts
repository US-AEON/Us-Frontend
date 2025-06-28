import apiClient, { tokenStorage } from '../axios';
import { AUTH } from '../endpoints';
import { AuthResponse, KakaoLoginDto, RefreshTokenResponse, StandardResponse } from '../types';

// 인증 관련 서비스
export const AuthService = {
  // 카카오 로그인
  kakaoLogin: async (data: KakaoLoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post<StandardResponse<AuthResponse>>(AUTH.KAKAO_LOGIN, data);
    
    // 토큰 저장
    const { access_token, refresh_token } = response.data.data;
    await tokenStorage.setAccessToken(access_token);
    await tokenStorage.setRefreshToken(refresh_token);
    
    return response.data.data;
  },
  
  // 토큰 갱신
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<StandardResponse<RefreshTokenResponse>>(
      AUTH.REFRESH_TOKEN,
      { refreshToken }
    );
    
    // 새 액세스 토큰 저장
    const { access_token } = response.data.data;
    await tokenStorage.setAccessToken(access_token);
    
    return response.data.data;
  },
  
  // 로그아웃
  logout: async (): Promise<void> => {
    await tokenStorage.clearTokens();
  },
  
  // 로그인 상태 확인
  isLoggedIn: async (): Promise<boolean> => {
    const token = await tokenStorage.getAccessToken();
    return !!token;
  },
};

export default AuthService; 