import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { s, vs, ms } from '@/shared/utils/responsive';
import { colors, typography } from '@/shared/design';
import { BottomNavBar } from '@/shared/design/components/Navigation/BottomNavBar';
import { BodyM, HeadingM, LabelS, BodyL, LabelM } from '@/shared/design/components/Typography';
import { Button } from '@/shared/design/components/Control/Button';
import useNavigation, { TabType } from '@/shared/hooks/useNavigation';
import { useRouter } from 'expo-router';
import ArrowRightIcon from '@/assets/icons/Arrow_Right.svg';
import EditPencilIcon from '@/assets/icons/Edit_Pencil.svg';
import CheckIcon from '@/assets/icons/Check.svg';
import CloseIcon from '@/assets/icons/Close_M.svg';
import { UserService } from '@/services/api';
import { UserProfile, UpdateUserProfileDto } from '@/services/api/types';
import { LANGUAGE_OPTIONS, LanguageType } from '@/shared/constants/languages';
import { Dropdown } from '@/shared/design/components/Control/Dropdown';

export default function MyPageScreen() {
  const { navigateToTab } = useNavigation('mypage');
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProfile, setEditingProfile] = useState<{
    currentCity: string;
    mainLanguage: string;
  }>({
    currentCity: '',
    mainLanguage: '',
  });
  const [saving, setSaving] = useState(false);

  const handleTabPress = (tab: TabType) => {
    navigateToTab(tab);
  };

  const handleContractPress = () => {
    router.push('/contract' as never);
  };

  const handleEditProfile = () => {
    if (!profile) return;
    
    // 편집 모드로 전환하고 현재 프로필 데이터로 초기화
    setEditingProfile({
      currentCity: profile.currentCity || '',
      mainLanguage: profile.mainLanguage || '',
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProfile({
      currentCity: '',
      mainLanguage: '',
    });
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      
      const updateData: UpdateUserProfileDto = {
        currentCity: editingProfile.currentCity.trim() || undefined,
        mainLanguage: editingProfile.mainLanguage.trim() || undefined,
      };

      const updatedProfile = await UserService.updatePartialProfile(updateData);
      setProfile(updatedProfile);
      setIsEditing(false);
      Alert.alert('성공', '프로필이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      Alert.alert('오류', '프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
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
                
                {!isEditing && (
                  <TouchableOpacity onPress={handleEditProfile}>
                    <EditPencilIcon 
                      width={s(20)} 
                      height={s(20)} 
                      color={colors.gray[600]}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Work Location */}
              <View style={styles.infoSection}>
                <LabelS color={colors.black}>Work Location</LabelS>
                {isEditing ? (
                  <TextInput
                    style={styles.infoEditInput}
                    value={editingProfile.currentCity}
                    onChangeText={(text) => setEditingProfile({...editingProfile, currentCity: text})}
                    placeholder="근무지를 입력하세요"
                    placeholderTextColor={colors.gray[400]}
                  />
                ) : (
                  <BodyL color={colors.black} style={styles.infoValue}>
                    {profile?.currentCity || '정보 없음'}
                  </BodyL>
                )}
              </View>

              {/* Language */}
              <View style={styles.infoSection}>
                <LabelS color={colors.black}>Language</LabelS>
                {isEditing ? (
                  <View style={styles.dropdownContainer}>
                    <Dropdown
                      options={LANGUAGE_OPTIONS}
                      value={editingProfile.mainLanguage}
                      onSelect={(value) => setEditingProfile({...editingProfile, mainLanguage: value})}
                      placeholder="언어를 선택하세요"
                    />
                  </View>
                ) : (
                  <BodyL color={colors.black} style={styles.infoValue}>
                    {profile?.mainLanguage || '정보 없음'}
                  </BodyL>
                )}
              </View>

              {/* 저장/취소 버튼 */}
              {isEditing && (
                <View style={styles.editActionsBottom}>
                  <TouchableOpacity 
                    onPress={handleCancelEdit}
                    style={styles.cancelButtonBottom}
                  >
                    <BodyM color={colors.gray[600]}>취소</BodyM>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={handleSaveProfile}
                    style={styles.saveButtonBottom}
                    disabled={saving}
                  >
                    {saving ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <BodyM color={colors.white}>저장</BodyM>
                    )}
                  </TouchableOpacity>
                </View>
              )}
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
  editInput: {
    flex: 1,
    fontSize: s(20),
    fontWeight: '600',
    color: colors.black,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary[400],
    paddingVertical: vs(4),
    marginRight: s(8),
  },
  editActions: {
    flexDirection: 'row',
    gap: s(8),
  },
  saveButton: {
    width: s(32),
    height: s(32),
    backgroundColor: colors.primary[400],
    borderRadius: s(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    width: s(32),
    height: s(32),
    backgroundColor: colors.gray[100],
    borderRadius: s(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoEditInput: {
    marginTop: vs(4),
    fontSize: s(16),
    color: colors.black,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary[400],
    paddingVertical: vs(4),
  },
  dropdownContainer: {
    marginTop: vs(8),
  },
  editActionsBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(24),
    gap: s(12),
  },
  cancelButtonBottom: {
    flex: 1,
    height: vs(48),
    backgroundColor: colors.gray[100],
    borderRadius: s(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonBottom: {
    flex: 1,
    height: vs(48),
    backgroundColor: colors.primary[400],
    borderRadius: s(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 