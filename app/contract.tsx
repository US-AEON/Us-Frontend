import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { s, vs } from '@/shared/utils/responsive';
import { colors } from '@/shared/design';
import { BottomNavBar } from '@/shared/design/components/Navigation/BottomNavBar';
import { TopNavBar } from '@/shared/design/components/Navigation/TopNavBar';
import { LabelM, BodyS } from '@/shared/design/components/Typography';
import useNavigation, { TabType } from '@/shared/hooks/useNavigation';
import { useRouter } from 'expo-router';

export default function ContractScreen() {
  const { navigateToTab } = useNavigation('mypage');
  const router = useRouter();

  // TODO: API 호출로 계약서 데이터 불러오기

  const handleTabPress = (tab: TabType) => {
    navigateToTab(tab);
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* 상단 네비게이션 바 */}
      <TopNavBar
        onBackPress={handleBackPress}
      />

      {/* 메인 콘텐츠 영역 */}
      <View style={styles.content}>
        {/* Empty State */}
        <View style={styles.emptyContainer}>
          <LabelM color={colors.gray[600]} style={styles.emptyTitle}>
            No Contracts Available
          </LabelM>
          <BodyS color={colors.gray[500]} style={styles.emptyDescription}>
            Your employment contracts will appear here once they are uploaded.
          </BodyS>
        </View>
      </View>

      {/* 하단 네비게이션 바 */}
      <BottomNavBar activeTab="mypage" onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(20),
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: vs(40),
  },
  emptyTitle: {
    marginBottom: vs(8),
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    lineHeight: vs(20),
  },
}); 