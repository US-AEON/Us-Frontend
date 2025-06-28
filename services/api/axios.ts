import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Config } from '../../constants/Config';
import { AUTH } from './endpoints';
import { RefreshTokenDto, StandardResponse } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

console.log('Config.API_URL', Config.API_URL);

// AsyncStorage 키 상수
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: Config.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 토큰 관리 함수
export const tokenStorage = {
  // 액세스 토큰 저장
  setAccessToken: async (token: string): Promise<void> => {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  
  // 리프레시 토큰 저장
  setRefreshToken: async (token: string): Promise<void> => {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  
  // 액세스 토큰 조회
  getAccessToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  },
  
  // 리프레시 토큰 조회
  getRefreshToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },
  
  // 모든 토큰 삭제 (로그아웃)
  clearTokens: async (): Promise<void> => {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
  },
};

// 토큰 갱신 함수
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 리프레시 토큰으로 액세스 토큰 갱신
const refreshAccessToken = async (): Promise<string> => {
  try {
    const refreshToken = await tokenStorage.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('리프레시 토큰이 없습니다');
    }
    
    const response = await axios.post<StandardResponse<{ access_token: string }>>(
      `${Config.API_URL}${AUTH.REFRESH_TOKEN}`,
      { refreshToken } as RefreshTokenDto
    );
    
    const { access_token } = response.data.data;
    await tokenStorage.setAccessToken(access_token);
    
    return access_token;
  } catch (error) {
    // 리프레시 토큰도 만료된 경우 로그아웃 처리
    await tokenStorage.clearTokens();
    throw error;
  }
};

// 액세스 토큰 갱신 후 대기 중인 요청 처리
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// 액세스 토큰 갱신 대기 함수
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// 요청 인터셉터
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.log('🔍 API 요청:', config.url);
    
    // 인증이 필요한 요청에만 토큰 추가
    if (config.url && !config.url.includes('/auth/') && config.url !== AUTH.REFRESH_TOKEN) {
      const token = await tokenStorage.getAccessToken();
      console.log('🔑 저장된 토큰:', token ? '✅ 존재함' : '❌ 없음');
      
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
        console.log('🔒 Authorization 헤더 추가됨');
        
        // 토큰의 앞부분만 로그로 출력 (보안상 전체는 출력하지 않음)
        const tokenPreview = token.substring(0, 20) + '...';
        console.log('🔑 토큰 미리보기:', tokenPreview);
      } else {
        console.log('⚠️ 토큰이 없습니다. 인증이 필요한 요청입니다.');
      }
    } else {
      console.log('🔓 인증이 필요하지 않은 요청입니다.');
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.log('❌ 요청 인터셉터 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ API 응답 성공:', response.config.url, 'Status:', response.status);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    console.log('❌ API 응답 에러:', {
      url: originalRequest.url,
      status: error.response?.status,
      message: error.message,
      hasRetried: originalRequest._retry
    });
    
    // 401 에러이고, 토큰 갱신 시도를 하지 않은 경우
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== AUTH.REFRESH_TOKEN
    ) {
      console.log('🔄 401 에러 감지 - 토큰 갱신 시도');
      
      if (isRefreshing) {
        console.log('⏳ 이미 토큰 갱신 중 - 대기열에 추가');
        // 이미 토큰 갱신 중이면 대기열에 추가
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            console.log('🔄 대기열에서 재시도:', originalRequest.url);
            originalRequest.headers.set('Authorization', `Bearer ${token}`);
            originalRequest._retry = true;
            resolve(apiClient(originalRequest));
          });
        });
      }
      
      // 토큰 갱신 시작
      console.log('🚀 토큰 갱신 시작');
      isRefreshing = true;
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshAccessToken();
        console.log('✅ 토큰 갱신 성공');
        isRefreshing = false;
        onRefreshed(newToken);
        
        originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
        
        console.log('🔄 원래 요청 재시도:', originalRequest.url);
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.log('❌ 토큰 갱신 실패:', refreshError);
        isRefreshing = false;
        // 로그아웃 처리 또는 로그인 화면으로 이동
        // 여기서는 에러를 그대로 반환
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 