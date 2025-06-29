import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { s, vs } from '@/shared/utils/responsive';
import { colors } from '@/shared/design';
import { BottomNavBar } from '@/shared/design/components/Navigation/BottomNavBar';
import { FormField } from '@/shared/design/components/Control/FormField';
import { Button } from '@/shared/design/components/Control/Button';
import { BodyM } from '@/shared/design/components/Typography';
import useNavigation, { TabType } from '@/shared/hooks/useNavigation';
import { useRouter } from 'expo-router';
import { WorkspaceService, UserService } from '@/services/api';

export default function WorkspaceScreen() {
  const { navigateToTab } = useNavigation('workspace');
  const router = useRouter();
  const [workspaceCode, setWorkspaceCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCheckingWorkspace, setIsCheckingWorkspace] = useState(true);

  useEffect(() => {
    const checkWorkspaceStatus = async () => {
      try {
        const hasWorkspace = await UserService.checkWorkspaceStatus();
        
        if (hasWorkspace) {
          router.replace('/workspace-posts' as never);
        } else {
          setIsCheckingWorkspace(false);
        }
      } catch (error) {
        console.error('워크스페이스 상태 체크 오류:', error);
        setIsCheckingWorkspace(false);
      }
    };

    checkWorkspaceStatus();
  }, []);

  const handleTabPress = (tab: TabType) => {
    navigateToTab(tab);
  };

  const handleEnterWorkspace = async () => {
    if (!workspaceCode.trim()) {
      Alert.alert('접근불가', '워크스페이스 코드를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      await WorkspaceService.joinWorkspace({
        code: workspaceCode.trim()
      });
      
      // 성공적으로 참여했으면 워크스페이스 게시글 목록 페이지로 이동
      router.push('/workspace-posts' as never);
    } catch (error) {
      console.error('워크스페이스 참여 실패:', error);
      Alert.alert('접근불가', '워크스페이스 참여에 실패했습니다. 코드를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 워크스페이스 상태 체크 중이면 로딩 화면 표시
  if (isCheckingWorkspace) {
    return (
      <View style={styles.container}>
        {/* 상단 헤더 영역 */}
        <View style={styles.header}>
          <BodyM color={colors.gray[900]}>WORKSPACE</BodyM>
        </View>

        {/* 로딩 표시 */}
        <View style={styles.loadingContainer}>
          <BodyM color={colors.gray[600]}>Checking workspace status...</BodyM>
        </View>

        {/* 하단 네비게이션 바 */}
        <BottomNavBar activeTab="workspace" onTabPress={handleTabPress} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 상단 헤더 영역 */}
      <View style={styles.header}>
        <BodyM color={colors.gray[900]}>WORKSPACE</BodyM>
      </View>

      {/* 메인 콘텐츠 영역 */}
      <View style={styles.codeInputContainer}>
        <View style={styles.codeInput}>
          <FormField
            label="code"
            placeholder="Copy paste here"
            value={workspaceCode}
            onChangeText={setWorkspaceCode}
          />
        </View>
        
        <View style={styles.enterButton}>
          <Button
            variant="primary"
            title={loading ? "ENTERING..." : "ENTER"}
            onPress={handleEnterWorkspace}
            disabled={loading}
          />
        </View>
      </View>

      {/* 하단 네비게이션 바 */}
      <BottomNavBar activeTab="workspace" onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    height: vs(56),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  codeInputContainer: {
    flex: 1,
    paddingHorizontal: s(20),
    paddingTop: vs(210),
  },
  codeInput: {
    marginBottom: vs(10),
  },
  enterButton: {
    height: vs(64),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 