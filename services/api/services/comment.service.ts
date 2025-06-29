import apiClient from '../axios';
import { COMMENT } from '../endpoints';
import { CommentResponse, CreateCommentDto, StandardResponse } from '../types';

// 댓글 관련 서비스
export const CommentService = {
  // 댓글 생성
  createComment: async (data: CreateCommentDto): Promise<CommentResponse> => {
    const response = await apiClient.post<StandardResponse<CommentResponse>>(COMMENT.CREATE(data.postId), data);
    return response.data.data;
  },
  
  // 게시물의 모든 댓글 조회
  getCommentsByPostId: async (postId: string): Promise<CommentResponse[]> => {
    const response = await apiClient.get<StandardResponse<CommentResponse[]>>(
      COMMENT.GET_BY_POST(postId)
    );
    return response.data.data;
  },

  // 댓글 삭제
  deleteComment: async (id: string): Promise<void> => {
    await apiClient.delete<StandardResponse<void>>(COMMENT.DELETE(id));
  },
};

export default CommentService; 