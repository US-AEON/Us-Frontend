import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Image, Alert, View, Platform, Pressable } from 'react-native';
import { BodyM } from '@/shared/design/components';
import { colors,typography } from '@/shared/design';
import { s, vs } from '@/shared/utils/responsive';
import { useRouter } from 'expo-router';
import { login } from '@react-native-kakao/user';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { AuthService } from '@/services/api';
import LogoSvg from '@/assets/icons/logo.svg';

const OnboardingImage = require('@/assets/images/onboarding.png');

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isKakaoReady, setIsKakaoReady] = useState(false);  

  // 카카오 SDK 초기화
  useEffect(() => {
    const initKakao = async () => {
      try {
        const KAKAO_NATIVE_APP_KEY = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;
        console.log('카카오 앱 키 확인:', KAKAO_NATIVE_APP_KEY ? '존재함' : '없음');
        
        if (KAKAO_NATIVE_APP_KEY) {
          await initializeKakaoSDK(KAKAO_NATIVE_APP_KEY);
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
      
      // 로그인 성공 후 온보딩 페이지로 이동
      router.replace('/onboarding' as never);
      
    } catch (error) {
      console.error('서버 통신 오류:', error);
      Alert.alert('오류', '서버 통신 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 로고 */}
      <View style={styles.logoContainer}>
        <LogoSvg width={s(59)} height={s(30)} />
      </View>
      
      {/* 온보딩 이미지 */}
      <View style={styles.onboardingContainer}>
        <Image source={OnboardingImage} style={styles.onboardingImage} />
      </View>
      
      {/* 카카오 로그인 버튼 */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.kakaoButton}
          onPress={handleKakaoLogin}
          disabled={isLoading || !isKakaoReady}
        >
          <Image 
            source={{ uri: 'https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png' }} 
            style={styles.kakaoIcon} 
          />
          <BodyM style={styles.kakaoButtonText}>
            {(!isKakaoReady ? '준비 중...' : '카카오톡으로 시작하기')}
          </BodyM>
        </Pressable>
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
  onboardingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onboardingImage: {
    width: s(300),
    height: vs(400),
    resizeMode: 'contain',
  },
  buttonContainer: {
    paddingHorizontal: s(20),
    paddingBottom: vs(60),
  },
  kakaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE500',
    borderRadius: s(28),
    height: vs(46),
    width: '100%',
    justifyContent: 'center',
  },
  kakaoIcon: {
    width: s(40),
    height: s(40),
    marginRight: s(4),
  },
  kakaoButtonText: {
    ...typography.bodyM,
    color: '#3C1E1E',
  },
}); 