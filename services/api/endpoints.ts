// API 엔드포인트 경로 상수
export const API_BASE_URL = '/api';

// 인증 관련 엔드포인트
export const AUTH = {
  KAKAO_LOGIN: `${API_BASE_URL}/auth/kakao`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
};

// 사용자 관련 엔드포인트
export const USER = {
  PROFILE: `${API_BASE_URL}/users/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
};

// 게시물 관련 엔드포인트
export const POST = {
  CREATE: `${API_BASE_URL}/posts`,
  GET_ALL: `${API_BASE_URL}/posts`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/posts/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/posts/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/posts/${id}`,
};

// 댓글 관련 엔드포인트
export const COMMENT = {
  CREATE: `${API_BASE_URL}/comments`,
  GET_BY_POST: (postId: string) => `${API_BASE_URL}/posts/${postId}/comments`,
  UPDATE: (id: string) => `${API_BASE_URL}/comments/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/comments/${id}`,
};

// 워크스페이스 관련 엔드포인트
export const WORKSPACE = {
  CREATE: `${API_BASE_URL}/workspaces`,
  JOIN: `${API_BASE_URL}/workspaces/join`,
  GET_ALL: `${API_BASE_URL}/workspaces`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/workspaces/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/workspaces/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/workspaces/${id}`,
};

// 음성 관련 엔드포인트
export const SPEECH = {
  CONVERSATION: `${API_BASE_URL}/speech/conversation`,
};

// 기본 앱 관련 엔드포인트
export const APP = {
  HEALTH_CHECK: `${API_BASE_URL}/health`,
  FIREBASE_TEST: `${API_BASE_URL}/firebase-test`,
}; 