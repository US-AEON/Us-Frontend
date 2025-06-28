import apiClient, { tokenStorage } from '../axios';
import { AUTH } from '../endpoints';
import { AuthResponse, KakaoLoginDto, RefreshTokenResponse, StandardResponse } from '../types';

// 인증 관련 서비스
export const AuthService = {
  // 카카오 로그인
  kakaoLogin: async (data: KakaoLoginDto): Promise<AuthResponse> => {
    console.log('🔐 카카오 로그인 API 호출 시작');
    
    const response = await apiClient.post<StandardResponse<AuthResponse>>(AUTH.KAKAO_LOGIN, data);
    
    console.log('✅ 카카오 로그인 API 응답 성공');
    
    // 토큰 저장
    const { access_token, refresh_token } = response.data.data;
    console.log('💾 토큰 저장 중...');
    console.log('🔑 Access Token 길이:', access_token.length);
    console.log('🔄 Refresh Token 길이:', refresh_token.length);
    
    await tokenStorage.setAccessToken(access_token);
    await tokenStorage.setRefreshToken(refresh_token);
    
    console.log('✅ 토큰 저장 완료');
    
    // 저장된 토큰 검증
    const savedAccessToken = await tokenStorage.getAccessToken();
    const savedRefreshToken = await tokenStorage.getRefreshToken();
    console.log('🔍 저장된 토큰 검증:', {
      accessToken: savedAccessToken ? '✅ 존재함' : '❌ 없음',
      refreshToken: savedRefreshToken ? '✅ 존재함' : '❌ 없음'
    });
    
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