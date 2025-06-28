import apiClient from '../axios';
import { WORKSPACE } from '../endpoints';
import { CreateWorkspaceDto, JoinWorkspaceDto, StandardResponse, Workspace } from '../types';

// 워크스페이스 관련 서비스
export const WorkspaceService = {
  // 워크스페이스 생성
  createWorkspace: async (data: CreateWorkspaceDto): Promise<Workspace> => {
    const response = await apiClient.post<StandardResponse<Workspace>>(WORKSPACE.CREATE, data);
    return response.data.data;
  },
  
  // 워크스페이스 참여
  joinWorkspace: async (data: JoinWorkspaceDto): Promise<Workspace> => {
    const response = await apiClient.post<StandardResponse<Workspace>>(WORKSPACE.JOIN, data);
    return response.data.data;
  },
  
  // 모든 워크스페이스 조회
  getAllWorkspaces: async (): Promise<Workspace[]> => {
    const response = await apiClient.get<StandardResponse<Workspace[]>>(WORKSPACE.GET_ALL);
    return response.data.data;
  },
  
  // 특정 워크스페이스 조회
  getWorkspaceById: async (id: string): Promise<Workspace> => {
    const response = await apiClient.get<StandardResponse<Workspace>>(WORKSPACE.GET_BY_ID(id));
    return response.data.data;
  },
  
  // 워크스페이스 삭제
  deleteWorkspace: async (id: string): Promise<void> => {
    await apiClient.delete<StandardResponse<void>>(WORKSPACE.DELETE(id));
  },
};

export default WorkspaceService; 