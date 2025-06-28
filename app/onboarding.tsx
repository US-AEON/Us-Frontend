import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { colors, typography } from '@/shared/design';
import { s, vs } from '@/shared/utils/responsive';
import { useRouter } from 'expo-router';
import { FormField } from '@/shared/design/components/Control/FormField';
import { Button } from '@/shared/design/components/Control/Button';
import LogoSvg from '@/assets/icons/logo.svg';

export default function OnboardingScreen() {
  const router = useRouter();
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

  const handleContinue = () => {
    // 온보딩 완료 후 메인 페이지로 이동
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* 로고 */}
      <View style={styles.logoContainer}>
        <LogoSvg width={s(59)} height={s(30)} />
      </View>

      {/* 입력 필드들 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <FormField
            label="Name"
            placeholder="Enter your name"
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

          <FormField
            label="Mother tongue"
            placeholder="Enter your mother tongue"
            value={formData.motherTongue}
            onChangeText={(value) => handleInputChange('motherTongue', value)}
          />
        </View>
      </ScrollView>

      {/* Continue 버튼 */}
      <View style={styles.buttonContainer}>
        <Button
          variant="primary"
          title="Continue"
          onPress={handleContinue}
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