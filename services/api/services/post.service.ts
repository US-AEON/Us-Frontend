import apiClient from '../axios';
import { POST } from '../endpoints';
import { CreatePostDto, PostResponse, StandardResponse } from '../types';

// 게시물 관련 서비스
export const PostService = {
  // 게시물 생성
  createPost: async (data: CreatePostDto): Promise<PostResponse> => {
    const response = await apiClient.post<StandardResponse<PostResponse>>(POST.CREATE, data);
    return response.data.data;
  },
  
  // 모든 게시물 조회
  getAllPosts: async (): Promise<PostResponse[]> => {
    const response = await apiClient.get<StandardResponse<PostResponse[]>>(POST.GET_ALL);
    return response.data.data;
  },
  
  // 특정 게시물 조회
  getPostById: async (id: string): Promise<PostResponse> => {
    const response = await apiClient.get<StandardResponse<PostResponse>>(POST.GET_BY_ID(id));
    return response.data.data;
  },
  
  // 게시물 삭제
  deletePost: async (id: string): Promise<void> => {
    await apiClient.delete<StandardResponse<void>>(POST.DELETE(id));
  },
};

export default PostService; 