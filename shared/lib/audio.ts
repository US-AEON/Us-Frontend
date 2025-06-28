import { 
  useAudioRecorder, 
  useAudioPlayer, 
  AudioModule,
  RecordingPresets 
} from 'expo-audio';

export async function requestAudioPermission(): Promise<boolean> {
  const permission = await AudioModule.requestRecordingPermissionsAsync();
  return permission.status === 'granted';
}

export async function setupAudioMode(): Promise<void> {
  await AudioModule.setAudioModeAsync({
    allowsRecording: true,
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    shouldRouteThroughEarpiece: false,
  });
}

// 고품질 녹음을 위한 WAV 커스텀 프리셋
export const HIGH_QUALITY_RECORDING = {
  extension: '.wav',
  sampleRate: 16000, // Google Cloud Speech API 권장 사양
  numberOfChannels: 1, // 모노 - 음성 인식에 최적화
  bitRate: 16000,
  android: {
    extension: '.wav',
    outputFormat: 'default', // Android에서 WAV 지원을 위해
    audioEncoder: 'default',
    sampleRate: 16000,
    numberOfChannels: 1,
    maxFileSize: 50 * 1024 * 1024, // 50MB
  },
  ios: {
    extension: '.wav',
    outputFormat: 'lpcm', // LINEARPCM - WAV 형식
    audioQuality: 96, // HIGH
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 16000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/wav',
    bitsPerSecond: 16000,
  },
};

// 시간 포맷 유틸리티
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatRemainingTime(currentSeconds: number, maxSeconds: number): string {
  const remaining = Math.max(0, maxSeconds - currentSeconds);
  return formatDuration(remaining);
} 