import { Dimensions } from 'react-native';
import { scale, verticalScale, moderateScale, ScaledSheet } from 'react-native-size-matters';

// 디자인 기준 크기 (피그마)
const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;

// 현재 디바이스 크기
const { width, height } = Dimensions.get('window');

// 가로 비율 계산
export const wp = (size: number) => {
  return (width / DESIGN_WIDTH) * size;
};

// 세로 비율 계산
export const hp = (size: number) => {
  return (height / DESIGN_HEIGHT) * size;
};

// 일반적인 크기 비율 계산 (react-native-size-matters의 scale 함수 재활용)
export const s = scale;

// 세로 크기 비율 계산 (react-native-size-matters의 verticalScale 함수 재활용)
export const vs = verticalScale;

// 폰트 등 일반 크기 비율 계산 (react-native-size-matters의 moderateScale 함수 재활용)
export const ms = moderateScale;

// 비율화된 스타일시트 생성 (react-native-size-matters의 ScaledSheet 재활용)
export const SS = ScaledSheet;

// 피그마 디자인 크기 그대로 사용할 때 비율 적용 함수
export const designScale = (size: number) => {
  return scale(size);
};

// 반응형 폰트 크기 계산
export const fontSize = (size: number) => {
  return moderateScale(size, 0.3); // 0.3은 조정 계수 (필요에 따라 변경 가능)
};

export default {
  wp,
  hp,
  s,
  vs,
  ms,
  designScale,
  fontSize,
  DESIGN_WIDTH,
  DESIGN_HEIGHT,
}; 