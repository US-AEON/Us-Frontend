import React, { useState } from 'react';
import { StyleSheet, Pressable, Alert, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { Text, View } from '@/components/Themed';

export default function VoiceRecorderScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);

  // 권한 요청 및 녹음 시작
  async function startRecording() {
    try {
      // 웹에서는 브라우저 권한, 모바일에서는 앱 권한
      const permission = await Audio.requestPermissionsAsync();
      
      if (permission.status !== 'granted') {
        Alert.alert('권한 필요', '마이크 사용 권한이 필요합니다.');
        return;
      }

      // 오디오 모드 설정
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      console.log('🎤 녹음 시작!');
    } catch (err) {
      console.error('녹음 시작 실패:', err);
      Alert.alert('오류', '녹음을 시작할 수 없습니다.');
    }
  }

  // 녹음 중지
  async function stopRecording() {
    if (!recording) return;

    try {
      console.log('⏹️ 녹음 중지...');
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      
      const uri = recording.getURI();
      setRecordingUri(uri);
      setRecording(null);
      
      console.log('📁 녹음 파일 저장됨:', uri);
      Alert.alert('완료', '녹음이 완료되었습니다!');
    } catch (err) {
      console.error('녹음 중지 실패:', err);
    }
  }

  // 녹음 재생
  async function playRecording() {
    if (!recordingUri) {
      Alert.alert('알림', '재생할 녹음이 없습니다.');
      return;
    }

    try {
      console.log('🔊 재생 시작:', recordingUri);
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: true }
      );
      
      setSound(sound);
      setIsPlaying(true);

      // 재생 완료 시 처리
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          console.log('✅ 재생 완료');
        }
      });
    } catch (err) {
      console.error('재생 실패:', err);
      Alert.alert('오류', '재생할 수 없습니다.');
    }
  }

  // 재생 중지
  async function stopPlaying() {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      console.log('⏹️ 재생 중지');
    }
  }

  // 컴포넌트 언마운트 시 정리
  React.useEffect(() => {
    return sound
      ? () => {
          console.log('🧹 사운드 정리');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎤 음성 녹음기</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.status}>
          {isRecording ? '🔴 녹음 중...' : 
           recordingUri ? '✅ 녹음 완료' : '⚪ 대기 중'}
        </Text>
        {Platform.OS === 'web' && (
          <Text style={styles.webNote}>웹 버전: HTTPS 환경에서만 동작합니다</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {/* 녹음 버튼 */}
        <Pressable
          style={[styles.button, isRecording ? styles.recordingButton : styles.recordButton]}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={isPlaying}
        >
          <Text style={styles.buttonText}>
            {isRecording ? '⏹️ 중지' : '🎤 녹음'}
          </Text>
        </Pressable>

        {/* 재생 버튼 */}
        <Pressable
          style={[styles.button, styles.playButton, !recordingUri && styles.disabledButton]}
          onPress={isPlaying ? stopPlaying : playRecording}
          disabled={!recordingUri || isRecording}
        >
          <Text style={styles.buttonText}>
            {isPlaying ? '⏹️ 중지' : '🔊 재생'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.info}>
          💡 사용법:{'\n'}
          1. 녹음 버튼을 눌러 음성을 녹음하세요{'\n'}
          2. 중지 버튼으로 녹음을 마치세요{'\n'}
          3. 재생 버튼으로 녹음을 들어보세요
        </Text>
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  status: {
    fontSize: 18,
    marginBottom: 10,
  },
  webNote: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 40,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  recordButton: {
    backgroundColor: '#007AFF',
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
  },
  playButton: {
    backgroundColor: '#34C759',
  },
  disabledButton: {
    backgroundColor: '#8E8E93',
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 20,
    borderRadius: 10,
    maxWidth: 300,
  },
  info: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
