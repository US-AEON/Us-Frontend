import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { s, vs, ms } from '@/shared/utils/responsive';
import { colors, typography } from '@/shared/design';
import { BottomNavBar } from '@/shared/design/components/Navigation/BottomNavBar';
import { BodyM, HeadingM, LabelS, BodyL, LabelM } from '@/shared/design/components/Typography';
import useNavigation, { TabType } from '@/shared/hooks/useNavigation';
import { useRouter } from 'expo-router';
import ArrowRightIcon from '@/assets/icons/Arrow_Right.svg';
import EditPencilIcon from '@/assets/icons/Edit_Pencil.svg';
import { UserService } from '@/services/api';
import { UserProfile } from '@/services/api/types';

export default function MyPageScreen() {
  const { navigateToTab } = useNavigation('mypage');
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const handleTabPress = (tab: TabType) => {
    navigateToTab(tab);
  };

  const handleContractPress = () => {
    router.push('/contract' as never);
  };

  const handleEditProfile = () => {
    // 유저 정보 변경 로직
    console.log('유저 정보 변경');
  };

  // 프로필 정보 불러오기
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userProfile = await UserService.getProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('프로필 불러오기 실패:', error);
      Alert.alert('오류', '프로필 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      {/* 상단 헤더 영역 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MY</Text>
      </View>

      {/* 메인 콘텐츠 영역 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[400]} />
          <BodyM color={colors.gray[600]} style={styles.loadingText}>
            프로필을 불러오는 중...
          </BodyM>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* 프라이머리50 박스 */}
            <View style={styles.primaryBox}>
              {/* 유저 닉네임과 편집 아이콘 */}
              <View style={styles.nicknameContainer}>
                <HeadingM color={colors.black}>
                  {profile?.name || '사용자'}
                </HeadingM>
                <TouchableOpacity onPress={handleEditProfile}>
                  <EditPencilIcon 
                    width={s(20)} 
                    height={s(20)} 
                    color={colors.gray[600]}
                  />
                </TouchableOpacity>
              </View>

              {/* Work Location */}
              <View style={styles.infoSection}>
                <LabelS color={colors.black}>Work Location</LabelS>
                <BodyL color={colors.black} style={styles.infoValue}>
                  {profile?.currentCity || '정보 없음'}
                </BodyL>
              </View>

              {/* Language */}
              <View style={styles.infoSection}>
                <LabelS color={colors.black}>Language</LabelS>
                <BodyL color={colors.black} style={styles.infoValue}>
                  {profile?.mainLanguage || '정보 없음'}
                </BodyL>
              </View>
            </View>

            {/* Check your contract 메뉴 */}
            <View style={styles.contractMenuItem}>
              <LabelM color={colors.black}>Check your contract</LabelM>
              <TouchableOpacity onPress={handleContractPress}>
                <ArrowRightIcon 
                  width={s(20)} 
                  height={s(20)} 
                  color={colors.gray[400]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

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
  header: {
    height: vs(56),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    ...typography.titleL,
    color: colors.gray[900],
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: s(20),
  },
  primaryBox: {
    marginTop: vs(28),
    backgroundColor: colors.primary[50],
    borderRadius: s(20),
    marginBottom: vs(28),
    paddingVertical: vs(16),
    paddingHorizontal: s(20),
  },
  nicknameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(20),
  },
  infoSection: {
    marginBottom: vs(20),
  },
  infoValue: {
    marginTop: vs(4),
  },
  contractMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingVertical: vs(16),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: vs(16),
  },
}); 