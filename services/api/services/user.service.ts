import apiClient from '../axios';
import { USER } from '../endpoints';
import { ProfileDto, StandardResponse, UpdateUserProfileDto, UserProfile } from '../types';

// 사용자 관련 서비스
export const UserService = {
  // 프로필 조회
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<StandardResponse<UserProfile>>(USER.PROFILE);
    return response.data.data;
  },
  
  // 프로필 전체 업데이트
  updateFullProfile: async (data: ProfileDto): Promise<UserProfile> => {
    const response = await apiClient.put<StandardResponse<UserProfile>>(USER.UPDATE_PROFILE, data);
    return response.data.data;
  },
  
  // 프로필 부분 업데이트
  updatePartialProfile: async (data: UpdateUserProfileDto): Promise<UserProfile> => {
    const response = await apiClient.patch<StandardResponse<UserProfile>>(USER.UPDATE_PROFILE, data);
    return response.data.data;
  },
};

export default UserService; 