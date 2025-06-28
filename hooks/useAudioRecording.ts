import { useState, useEffect, useCallback } from 'react';
import { useAudioRecorder, AudioModule, RecordingPresets } from 'expo-audio';
import { requestAudioPermission, setupAudioMode, HIGH_QUALITY_RECORDING, formatDuration, formatRemainingTime } from '@/shared/lib/audio';

export interface AudioRecordingState {
  isRecording: boolean;
  hasPermission: boolean | null;
  recordingDuration: number; // 녹음 시간 (초)
  maxDuration: number; // 최대 녹음 시간 (초)
  formattedDuration: string; // 포맷된 시간 (MM:SS)
  formattedRemainingTime: string; // 남은 시간 (MM:SS)
  uri: string | null;
}

export function useAudioRecording(maxDurationSeconds: number = 600) { // 기본 10분
  const audioRecorder = useAudioRecorder(HIGH_QUALITY_RECORDING);
  
  const [state, setState] = useState<AudioRecordingState>({
    isRecording: false,
    hasPermission: null,
    recordingDuration: 0,
    maxDuration: maxDurationSeconds,
    formattedDuration: '00:00',
    formattedRemainingTime: formatDuration(maxDurationSeconds),
    uri: null,
  });

  // 권한 요청
  const requestPermission = useCallback(async () => {
    const hasPermission = await requestAudioPermission();
    setState(prev => ({ ...prev, hasPermission }));
    
    if (hasPermission) {
      await setupAudioMode();
    }
    
    return hasPermission;
  }, []);

  // 초기화 시 권한 확인
  useEffect(() => {
    const initializePermissions = async () => {
      const status = await AudioModule.getRecordingPermissionsAsync();
      setState(prev => ({ ...prev, hasPermission: status.granted }));
      
      if (status.granted) {
        await setupAudioMode();
      }
    };

    initializePermissions();
  }, []);

  // 녹음 시간 추적
  useEffect(() => {
    let interval: number;
    
    if (state.isRecording) {
      interval = setInterval(() => {
        setState(prev => {
          const newDuration = prev.recordingDuration + 1;
          
          // 최대 시간 도달 시 자동 중지
          if (newDuration >= prev.maxDuration) {
            stopRecording();
            return prev;
          }
          
          return {
            ...prev,
            recordingDuration: newDuration,
            formattedDuration: formatDuration(newDuration),
            formattedRemainingTime: formatRemainingTime(newDuration, prev.maxDuration),
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.isRecording, state.maxDuration]);

  const startRecording = useCallback(async (): Promise<boolean> => {
    try {
      if (!state.hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          return false;
        }
      }

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      
      setState(prev => ({
        ...prev,
        isRecording: true,
        recordingDuration: 0,
        formattedDuration: '00:00',
        formattedRemainingTime: formatDuration(prev.maxDuration),
        uri: null,
      }));

      return true;
    } catch (error) {
      console.error('녹음 시작 실패:', error);
      return false;
    }
  }, [state.hasPermission, audioRecorder, requestPermission]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    try {
      await audioRecorder.stop();
      const recordingUri = audioRecorder.uri;
      
      setState(prev => ({
        ...prev,
        isRecording: false,
        uri: recordingUri,
      }));

      return recordingUri;
    } catch (error) {
      console.error('녹음 중지 실패:', error);
      setState(prev => ({ ...prev, isRecording: false }));
      return null;
    }
  }, [audioRecorder]);

  const resetRecording = useCallback(() => {
    setState(prev => ({
      ...prev,
      recordingDuration: 0,
      formattedDuration: '00:00',
      formattedRemainingTime: formatDuration(prev.maxDuration),
      uri: null,
    }));
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
    requestPermission,
  };
} 