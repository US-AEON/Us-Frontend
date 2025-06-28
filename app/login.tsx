import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Image, Alert, View, Platform, Pressable } from 'react-native';
import { BodyM } from '@/shared/design/components';
import { colors, typography } from '@/shared/design';
import { s, vs } from '@/shared/utils/responsive';
import { useRouter } from 'expo-router';
import { login } from '@react-native-kakao/user';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { AuthService } from '@/services/api';
import LogoSvg from '@/assets/icons/logo.svg';
import PageIndicatorActive from '@/assets/images/page-indicator-active.svg';
import PageIndicatorInactive from '@/assets/images/page-indicator-inactive.svg';

const OnboardingImages = [
  require('@/assets/images/onboarding1.png'),
  require('@/assets/images/onboarding2.png'),
  require('@/assets/images/onboarding3.png'),
];

const OnboardingTexts = [
  "지역 방언이 모국어로\n실시간 통역이되어 쉽게 소통할 수 있어요.",
  "외국인과 고용주가 공지·질문을\n각자 언어로 쉽게 주고받을 수 있어요.",
  "산재보험 정보를 모국어로 쉽게 보고,\n필요시 변호사 연결도 도와줘요."
];

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isKakaoReady, setIsKakaoReady] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);  

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

  // 자동 슬라이드 기능
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex(prevIndex => 
        prevIndex === OnboardingImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // 3초마다 이미지 변경

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
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
      
      {/* 온보딩 이미지 슬라이드 */}
      <View style={styles.onboardingContainer}>
        <Image source={OnboardingImages[currentImageIndex]} style={styles.onboardingImage} />
        
        {/* 설명 텍스트 */}
        <View style={styles.textContainer}>
          <BodyM style={styles.descriptionText}>
            {OnboardingTexts[currentImageIndex]}
          </BodyM>
        </View>
        
        {/* 페이지 인디케이터 */}
        <View style={styles.indicatorContainer}>
          {OnboardingImages.map((_, index) => (
            index === currentImageIndex ? (
              <PageIndicatorActive 
                key={index} 
                width={s(24)} 
                height={s(6)} 
                style={styles.indicator}
              />
            ) : (
              <PageIndicatorInactive 
                key={index} 
                width={s(6)} 
                height={s(6)} 
                style={styles.indicator}
              />
            )
          ))}
        </View>
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
    marginTop: vs(60),
    marginBottom: vs(24),
  },
  onboardingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onboardingImage: {
    width: s(280),
    height: vs(320),
    resizeMode: 'contain',
  },
  textContainer: {
    marginTop: vs(32),
    paddingHorizontal: s(20),
    alignItems: 'center',
  },
  descriptionText: {
    ...typography.titleL,
    textAlign: 'center',
    color: colors.black,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(40),
    gap: s(8),
  },
  indicator: {
  },
  buttonContainer: {
    paddingHorizontal: s(20),
    paddingBottom: vs(40),
    marginTop: vs(40),
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