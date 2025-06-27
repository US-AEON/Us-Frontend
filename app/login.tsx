import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { login } from '@react-native-kakao/user';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { API_URL, KAKAO_NATIVE_APP_KEY } from '@env';

// 카카오 SDK 초기화
initializeKakaoSDK(KAKAO_NATIVE_APP_KEY);

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 카카오 로그인 처리
  const handleKakaoLogin = async () => {
    try {
      setIsLoading(true);
      
      const token = await login();
      
      if (token.idToken) {
        await sendIdTokenToServer(token.idToken);
      } else {
        Alert.alert('오류', 'ID 토큰을 받지 못했습니다.');
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error('카카오 로그인 오류:', error);
      Alert.alert('오류', '카카오 로그인 중 문제가 발생했습니다.');
      setIsLoading(false);
    }
  };
  
  // 서버로 idToken 전송
  const sendIdTokenToServer = async (idToken: string) => {
    try {   
      const response = await fetch(`${API_URL}/auth/kakao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });
      
      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }
      
      // 로그인 성공 후 메인 페이지로 이동
      router.replace('/(tabs)');
      
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
        <Text style={styles.subtitle}>카카오 로그인</Text>
      </View>
      
      <TouchableOpacity
        style={styles.kakaoButton}
        onPress={handleKakaoLogin}
        disabled={isLoading}
      >
        <Image 
          source={{ uri: 'https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png' }} 
          style={styles.kakaoIcon} 
        />
        <Text style={styles.kakaoButtonText}>
          {isLoading ? '로그인 중...' : '카카오로 로그인'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  kakaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE500',
    borderRadius: 4,
    padding: 12,
    width: '100%',
    maxWidth: 280,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  kakaoIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  kakaoButtonText: {
    color: '#3C1E1E',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ff9800',
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#ff5722',
    fontWeight: 'bold',
  },
}); 