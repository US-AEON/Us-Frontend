// 표준 응답 형식
export interface StandardResponse<T> {
  success: boolean;    // 요청 성공 여부
  message: string;     // 응답 메시지
  data: T;             // 응답 데이터
}

// 인증 (Auth)
export interface KakaoLoginDto {
  idToken: string;     // 카카오 ID 토큰
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    uid: string;
  };
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

// 사용자 (User)
export interface UserProfile {
  id: string;
  name: string;
  birthYear: number;
  nationality: string;
  currentCity: string;
  mainLanguage: string;
}

export interface ProfileDto {
  name: string;
  birthYear: number;
  nationality: string;
  currentCity: string;
  mainLanguage: string;
}

export interface UpdateUserProfileDto {
  name?: string;
  birthYear?: number;
  nationality?: string;
  currentCity?: string;
  mainLanguage?: string;
}

// 게시물 (Post)
export interface CreatePostDto {
  title: string;
  content: string;
  language: string;
}

export interface PostResponse {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
  language: string;
  commentCount: number;
}

// 댓글 (Comment)
export interface CreateCommentDto {
  content: string;
  postId: string;
  parentId?: string;  // 대댓글인 경우 부모 댓글 ID
}

export interface CommentResponse {
  id: string;
  content: string;
  authorId: string;
  authorName?: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
  children?: CommentResponse[];  // 대댓글 목록
}

// 워크스페이스 (Workspace)
export interface CreateWorkspaceDto {
  name: string;
  description?: string;
}

export interface JoinWorkspaceDto {
  code: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  inviteCode: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

// 음성 (Speech)
export interface ConversationRequestDto {
  selectedForeignLanguage: string;  // 'en-US', 'vi-VN', 'km-KH' 등
  conversationId?: string;          // 대화 세션 ID (선택 사항)
}

export interface ConversationResponse {
  inputText: string;
  responseText: string;
  audioUrl: string;
  detectedLanguage: string;
}

// 기본 (App)
export interface HealthCheckResponse {
  message: string;
}

export interface FirebaseTestResponse {
  message: string;
} 