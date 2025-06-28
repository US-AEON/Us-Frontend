import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AUTH } from './endpoints';
import { RefreshTokenDto, StandardResponse } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage 키 상수
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
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
    try {
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch (error) {
      console.error('액세스 토큰 저장 실패:', error);
    }
  },
  
  // 리프레시 토큰 저장
  setRefreshToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('리프레시 토큰 저장 실패:', error);
    }
  },
  
  // 액세스 토큰 조회
  getAccessToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('액세스 토큰 조회 실패:', error);
      return null;
    }
  },
  
  // 리프레시 토큰 조회
  getRefreshToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('리프레시 토큰 조회 실패:', error);
      return null;
    }
  },
  
  // 모든 토큰 삭제 (로그아웃)
  clearTokens: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
    } catch (error) {
      console.error('토큰 삭제 실패:', error);
    }
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
      `${process.env.EXPO_PUBLIC_API_BASE_URL}${AUTH.REFRESH_TOKEN}`,
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
    // 인증이 필요한 요청에만 토큰 추가
    if (config.url && !config.url.includes('/auth/') && config.url !== AUTH.REFRESH_TOKEN) {
      const token = await tokenStorage.getAccessToken();
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // 401 에러이고, 토큰 갱신 시도를 하지 않은 경우
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== AUTH.REFRESH_TOKEN
    ) {
      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 대기열에 추가
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            originalRequest.headers.set('Authorization', `Bearer ${token}`);
            originalRequest._retry = true;
            resolve(apiClient(originalRequest));
          });
        });
      }
      
      // 토큰 갱신 시작
      isRefreshing = true;
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        onRefreshed(newToken);
        
        originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
        
        return apiClient(originalRequest);
      } catch (refreshError) {
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