import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MicrophoneFilledIcon from '@/assets/icons/Microphone_filled.svg';
import ArrowLeftRightIcon from '@/assets/icons/Arrow_Left_Right.svg';
import { colors } from '@/shared/design';
import { wp, hp, s, vs, ms } from '@/shared/lib/responsive';
import { Typography } from '@/shared/design/components/Typography';
import { TopNavBar } from '@/shared/design/components/Navigation/TopNavBar';
import { BottomNavBar } from '@/shared/design/components/Navigation/BottomNavBar';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { useConversation } from '@/hooks/useConversation';
import useNavigation, { TabType } from '@/shared/hooks/useNavigation';

type RecordingState = 'idle' | 'recording' | 'processing' | 'completed';

export default function RecordPage() {
  const { navigateToTab } = useNavigation('record');
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const buttonScale = useState(new Animated.Value(1))[0];
  
  // 오디오 녹음 훅
  const {
    isRecording,
    hasPermission,
    recordingDuration,
    formattedDuration,
    uri,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecording(60); // 최대 1분 녹음
  
  // 대화 기능 훅
  const {
    isLoading,
    error,
    selectedLanguage,
    supportedLanguages,
    isPlayingAudio,
    processConversation,
    changeLanguage,
  } = useConversation();
  
  // 언어 매핑
  const languageMap = {
    'ko-KR': 'SATURI',
    'en-US': 'ENG',
    'vi-VN': 'VIE',
    'th-TH': 'THA',
    'km-KH': 'KHM',
  };
  
  const sourceLanguage = 'SATURI'; // 한국어 고정
  const targetLanguage = languageMap[selectedLanguage as keyof typeof languageMap] || 'ENG';

  // 실제 녹음 상태와 UI 상태 동기화
  useEffect(() => {
    if (!isRecording && recordingState === 'recording') {
      setRecordingState('idle');
    }
  }, [isRecording, recordingState]);

  // 권한 확인
  useEffect(() => {
    if (hasPermission === false) {
      Alert.alert(
        '권한 필요',
        '음성 녹음을 위해 마이크 권한이 필요합니다.',
        [{ text: '확인' }]
      );
    }
  }, [hasPermission]);

  const handleMicPress = async () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (recordingState === 'completed') {
      // 완료 상태에서 다시 녹음 상태로 돌아가기
      setRecordingState('idle');
      resetRecording();
    } else if (!isRecording && recordingState === 'idle') {
      // 녹음 시작
      const success = await startRecording();
      if (success) {
        setRecordingState('recording');
      } else {
        Alert.alert('권한 오류', '마이크 권한이 필요합니다.');
      }
    } else if (isRecording && recordingState === 'recording') {
      // 녹음 중지 + API 요청
      setRecordingState('processing');
      
      try {
        const recordingUri = await stopRecording();
        if (recordingUri) {
          // 실제 음성 처리 및 번역
          await processConversation(recordingUri);
          setRecordingState('completed');
        } else {
          setRecordingState('idle');
          Alert.alert('오류', '녹음 파일을 생성할 수 없습니다.');
        }
      } catch (error) {
        setRecordingState('idle');
        Alert.alert('오류', '음성 처리 중 오류가 발생했습니다.');
      }
    }
  };

  const handleSwapLanguages = () => {
    // 현재 선택된 언어를 다음 언어로 변경
    const currentIndex = supportedLanguages.findIndex(lang => lang.code === selectedLanguage);
    const nextIndex = (currentIndex + 1) % supportedLanguages.length;
    changeLanguage(supportedLanguages[nextIndex].code);
  };

  const handleSave = () => {
    // 바로 초기화면으로 돌리기
    setRecordingState('idle');
    resetRecording();
  };

  const isProcessing = recordingState === 'processing';
  const isCompleted = recordingState === 'completed';

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView style={styles.container}>
        {/* Top Navigation */}
        <TopNavBar onMenuPress={() => {
          navigateToTab('home');
        }} />
        
        {/* Language Selection Bar */}
        <View style={styles.languageBar}>
          <TouchableOpacity style={styles.languageButton} activeOpacity={0.7}>
            <Typography variant="labelS" color={colors.white}>
              {sourceLanguage}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.swapButton} 
            onPress={handleSwapLanguages}
            activeOpacity={0.7}
          >
            <ArrowLeftRightIcon 
              width={s(20)} 
              height={s(20)} 
              fill={colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.languageButton} activeOpacity={0.7}>
            <Typography variant="labelS" color={colors.white}>
              {targetLanguage}
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Main Recording Area */}
        <View style={styles.recordingArea}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[
                styles.recordButton,
                (isRecording || isProcessing) && styles.recordButtonActive,
              ]}
              onPress={isProcessing ? undefined : handleMicPress}
              activeOpacity={0.8}
              disabled={isProcessing}
            >
              {isRecording ? (
                // Stop recording (square)
                <View style={styles.pauseIcon} />
              ) : (
                // Microphone icon
                <MicrophoneFilledIcon
                  width={s(62)}
                  height={s(64)}
                  fill={colors.primary[900]}
                />
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Complete Button - only show when completed */}
          {isCompleted && (
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.7}
            >
              <Typography variant="labelM" color={colors.primary[900]}>
                Save
              </Typography>
            </TouchableOpacity>
          )}

          {/* Error Message */}
          {error && (
            <View style={styles.errorMessage}>
              <Typography variant="bodyS" color={colors.danger}>
                {error}
              </Typography>
            </View>
          )}
        </View>

        {/* 하단 네비게이션 바 */}
        <BottomNavBar 
          activeTab="record" 
          onTabPress={(tab: TabType) => navigateToTab(tab)} 
        />

      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000323',
  },
  languageBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(20),
    paddingVertical: vs(16),
    marginTop: vs(20),
  },
  languageButton: {
    backgroundColor: colors.gray[700],
    paddingHorizontal: wp(16),
    paddingVertical: vs(8),
    borderRadius: s(20),
    minWidth: wp(80),
    alignItems: 'center',
  },
  swapButton: {
    backgroundColor: colors.gray[700],
    padding: s(8),
    borderRadius: s(20),
    marginHorizontal: wp(12),
  },
  recordingArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: s(154),
    height: s(154),
    backgroundColor: colors.primary[400],
    borderRadius: s(77), // 154/2
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  recordButtonActive: {
    width: s(242),
    height: s(242),
    backgroundColor: colors.secondary[300],
    borderRadius: s(121), // 242/2
  },
  pauseIcon: {
    width: s(44),
    height: s(44),
    backgroundColor: colors.primary[900],
    borderRadius: s(4),
  },
  saveButton: {
    backgroundColor: colors.white,
    paddingHorizontal: wp(48),
    paddingVertical: vs(16),
    borderRadius: s(24),
    marginTop: vs(32),
    minWidth: wp(200),
    alignItems: 'center',
  },
  errorMessage: {
    marginTop: vs(16),
    paddingHorizontal: wp(20),
    paddingVertical: vs(8),
    backgroundColor: colors.gray[800],
    borderRadius: s(8),
    alignItems: 'center',
  },
}); 