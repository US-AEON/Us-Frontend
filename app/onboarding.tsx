import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import { colors, typography } from '@/shared/design';
import { s, vs } from '@/shared/utils/responsive';
import { useRouter } from 'expo-router';
import { FormField } from '@/shared/design/components/Control/FormField';
import { Button } from '@/shared/design/components/Control/Button';
import { Dropdown } from '@/shared/design/components/Control/Dropdown';
import { UserService } from '@/services/api';
import LogoSvg from '@/assets/icons/logo.svg';
import { LANGUAGE_OPTIONS } from '@/shared/constants/languages';

export default function OnboardingScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    nationality: '',
    workLocation: '',
    motherTongue: '',
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = async () => {
    try {
      setIsLoading(true);
      
      // 입력값 검증
      if (!formData.name || !formData.birthdate || !formData.nationality || !formData.workLocation || !formData.motherTongue) {
        Alert.alert('입력 오류', '모든 필드를 입력해주세요.');
        return;
      }

      // birthdate를 년도로 변환
      const birthYear = parseInt(formData.birthdate);
      
      // 프로필 업데이트 API 호출
      await UserService.updateFullProfile({
        name: formData.name,
        birthYear: birthYear,
        nationality: formData.nationality,
        currentCity: formData.workLocation,
        mainLanguage: formData.motherTongue,
      });

      // 성공 시 메인 페이지로 이동
      router.replace('/(tabs)');
      
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      Alert.alert('오류', '프로필 업데이트 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 로고 */}
      <View style={styles.logoContainer}>
        <LogoSvg width={s(87)} height={s(44)} />
      </View>

      {/* 입력 필드들 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <FormField
            label="Name"
            placeholder="Write down your name"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
          />

          <FormField
            label="Birthdate"
            placeholder="YYYY-MM-DD"
            value={formData.birthdate}
            onChangeText={(value) => handleInputChange('birthdate', value)}
          />

          <FormField
            label="Nationality"
            placeholder="Enter your nationality"
            value={formData.nationality}
            onChangeText={(value) => handleInputChange('nationality', value)}
          />

          <FormField
            label="Work Location"
            placeholder="Enter your work location"
            value={formData.workLocation}
            onChangeText={(value) => handleInputChange('workLocation', value)}
          />

          <Dropdown
            label="Mother tongue"
            placeholder="Select a language"
            value={formData.motherTongue}
            options={LANGUAGE_OPTIONS}
            onSelect={(value) => handleInputChange('motherTongue', value)}
          />
        </View>
      </ScrollView>

      {/* Continue 버튼 */}
      <View style={styles.buttonContainer}>
        <Button
          variant="primary"
          title={isLoading ? "처리 중..." : "Continue"}
          onPress={handleContinue}
          disabled={isLoading}
          style={styles.continueButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: vs(88),
    marginBottom: vs(40),
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: s(20),
  },
  buttonContainer: {
    paddingHorizontal: s(20),
    paddingBottom: vs(40),
  },
  continueButton: {
    height: 56,
    borderRadius: s(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 