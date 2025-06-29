import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Alert, StatusBar, Platform } from 'react-native';
import { Stack } from 'expo-router';
import MicrophoneFilledIcon from '@/assets/icons/Microphone_filled.svg';
import { colors } from '@/shared/design';
import { wp, hp, s, vs, ms } from '@/shared/lib/responsive';
import { Typography } from '@/shared/design/components/Typography';
import { TopNavBar } from '@/shared/design/components/Navigation/TopNavBar';
import { useAudioRecording } from '@/hooks/useAudioRecording';
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
      // 녹음 중지
      setRecordingState('processing');
      
      try {
        const recordingUri = await stopRecording();
        if (recordingUri) {
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
      <StatusBar barStyle="light-content" backgroundColor="#000323" />
      <View style={styles.container}>
        {/* Top Navigation */}
        <View style={styles.topNavContainer}>
          <TopNavBar onBackPress={() => {
            navigateToTab('home');
          }} />
        </View>

        {/* Main Recording Area - Fixed Position */}
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
        </View>

        {/* Complete Button */}
        {isCompleted && (
          <View style={styles.saveButtonContainer}>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.7}
            >
              <Typography variant="labelM" color={colors.primary[400]}>
                Save
              </Typography>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000323',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : vs(44),
  },
  topNavContainer: {
    height: vs(60),
  },
  recordingArea: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: vs(300),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: vs(-150), 
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
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: wp(20),
    paddingBottom: vs(40),
    paddingTop: vs(20),
  },
  saveButton: {
    backgroundColor: colors.primary[50],
    height: vs(56),
    borderRadius: s(16),
    justifyContent: 'center',
    alignItems: 'center',
  },

}); 