import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Image, Alert, View, Platform } from 'react-native';
import { BodyM, HeadingS } from '@/shared/design/components';
import { colors, spacing } from '@/shared/design';
import { useRouter } from 'expo-router';
import { login } from '@react-native-kakao/user';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { Config } from '@/constants/Config';
import { AuthService } from '@/services/api';

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isKakaoReady, setIsKakaoReady] = useState(false);

  // 자동 우회 제거 - 실제 로그인 플로우 사용

  // 카카오 SDK 초기화
  useEffect(() => {
    const initKakao = async () => {
      try {
        console.log('카카오 앱 키 확인:', Config.KAKAO_NATIVE_APP_KEY ? '존재함' : '없음');
        
        if (Config.KAKAO_NATIVE_APP_KEY) {
          await initializeKakaoSDK(Config.KAKAO_NATIVE_APP_KEY);
          console.log('카카오 SDK 초기화 성공');
          setIsKakaoReady(true);
        } else {
          console.error('카카오 앱 키가 설정되지 않았습니다.');
          Alert.alert('설정 오류', '카카오 앱 키가 설정되지 않았습니다.');
        }
      } catch (error) {
        console.error('카카오 SDK 초기화 실패:', error);
        Alert.alert('초기화 오류', '카카오 SDK 초기화에 실패했습니다. Development build가 필요할 수 있습니다.');
      }
    };

    initKakao().catch(console.error);
  }, []);

  // 카카오 로그인 처리
  const handleKakaoLogin = async () => {
    // 웹 플랫폼 체크
    if (Platform.OS === 'web') {
      Alert.alert('플랫폼 오류', '웹에서는 카카오 로그인이 지원되지 않습니다. 모바일 앱을 사용해주세요.');
      return;
    }

    if (!isKakaoReady) {
      Alert.alert('오류', '카카오 SDK가 준비되지 않았습니다.');
      return;
    }

    try {
      setIsLoading(true);
      console.log('카카오 로그인 시도 중...');
      
      const token = await login();
      console.log('카카오 로그인 성공, 토큰:', token.idToken ? '존재함' : '없음');
      
      if (token.idToken) {
        await loginWithKakao(token.idToken);
      } else {
        Alert.alert('오류', 'ID 토큰을 받지 못했습니다.');
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error('카카오 로그인 오류:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      Alert.alert('오류', `카카오 로그인 중 문제가 발생했습니다.\n${errorMessage}`);
      setIsLoading(false);
    }
  };
  

  const loginWithKakao = async (idToken: string) => {
    try {   
      await AuthService.kakaoLogin({ idToken });
      
      // 로그인 성공 후 마이크 페이지로 이동
      console.log('✅ 로그인 성공! 마이크 페이지로 이동합니다.');
      router.replace('/mic');
      
    } catch (error) {
      console.error('서버 통신 오류:', error);
      Alert.alert('오류', '서버 통신 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <HeadingS style={styles.subtitle}>카카오 로그인</HeadingS>
      </View>
      
      <TouchableOpacity
        style={styles.kakaoButton}
        onPress={handleKakaoLogin}
        disabled={isLoading || !isKakaoReady}
      >
        <Image 
          source={{ uri: 'https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png' }} 
          style={styles.kakaoIcon} 
        />
        <BodyM style={styles.kakaoButtonText}>
          {isLoading ? '로그인 중...' : (!isKakaoReady ? '준비 중...' : '카카오로 로그인')}
        </BodyM>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl + spacing.md, // 60
  },
  subtitle: {
    color: colors.gray[600],
  },
  kakaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE500',
    borderRadius: 4,
    padding: spacing.md,
    width: '100%',
    maxWidth: 280,
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  kakaoIcon: {
    width: 24,
    height: 24,
    marginRight: spacing.md,
  },
  kakaoButtonText: {
    color: '#3C1E1E',
    fontWeight: '600',
  },
}); 