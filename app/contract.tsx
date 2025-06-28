import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { s, vs } from '@/shared/utils/responsive';
import { colors } from '@/shared/design';
import { BottomNavBar } from '@/shared/design/components/Navigation/BottomNavBar';
import { GlobalNavigationBar } from '@/shared/design/components/Navigation/GlobalNavigationBar';
import useNavigation, { TabType } from '@/shared/hooks/useNavigation';
import { useRouter } from 'expo-router';

// 임시 계약서 이미지 (실제 이미지로 교체 필요)
const ContractImage1 = require('@/assets/images/Character.png');
const ContractImage2 = require('@/assets/images/Character2.png');

export default function ContractScreen() {
  const { navigateToTab } = useNavigation('mypage');
  const router = useRouter();

  const handleTabPress = (tab: TabType) => {
    navigateToTab(tab);
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* 상단 네비게이션 바 */}
      <GlobalNavigationBar
        title="Contract"
        showBackButton={true}
        onBackPress={handleBackPress}
      />

      {/* 메인 콘텐츠 영역 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* 계약서 이미지들 */}
          <View style={styles.contractImageContainer}>
            <Image source={ContractImage1} style={styles.contractImage} />
          </View>
          
          <View style={styles.contractImageContainer}>
            <Image source={ContractImage2} style={styles.contractImage} />
          </View>
        </View>
      </ScrollView>

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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: s(20),
    paddingVertical: vs(20),
  },
  contractImageContainer: {
    marginBottom: vs(20),
    alignItems: 'center',
  },
  contractImage: {
    width: '100%',
    height: vs(400),
    borderRadius: s(8),
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
}); 