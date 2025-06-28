import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export type TabType = 'home' | 'help' | 'record' | 'workspace' | 'mypage';

// 각 탭에 해당하는 경로 매핑
const TAB_ROUTES: Record<TabType, string> = {
  home: '/(tabs)',
  help: '/(tabs)/help',
  record: '/(tabs)/record',
  workspace: '/(tabs)/workspace',
  mypage: '/(tabs)/mypage',
};

// 바텀 네비게이션 탭 이동을 처리하는 훅
export const useNavigation = (initialTab: TabType = 'home') => {
  const router = useRouter();
  
  // 탭 전환 함수
  const navigateToTab = useCallback((tab: TabType) => {
    const route = TAB_ROUTES[tab];
    router.push(route as never);
  }, [router]);
  
  return {
    navigateToTab,
    TAB_ROUTES,
  };
};

export default useNavigation; 