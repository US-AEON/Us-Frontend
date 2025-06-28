// 프리텐다드 폰트 정의
export const fonts = {
  thin: 'Pretendard-Thin',
  extraLight: 'Pretendard-ExtraLight', 
  light: 'Pretendard-Light',
  regular: 'Pretendard-Regular',
  medium: 'Pretendard-Medium',
  semiBold: 'Pretendard-SemiBold',
  bold: 'Pretendard-Bold',
  extraBold: 'Pretendard-ExtraBold',
  black: 'Pretendard-Black',
} as const;

// 폰트 가중치 매핑
export const fontWeights = {
  100: fonts.thin,
  200: fonts.extraLight,
  300: fonts.light,
  400: fonts.regular,
  500: fonts.medium,
  600: fonts.semiBold,
  700: fonts.bold,
  800: fonts.extraBold,
  900: fonts.black,
} as const;

// 타이포그래피 스타일
export const typography = {
  // Heading
  headingL: {
    fontFamily: fonts.bold,
    fontSize: 32,
    lineHeight: 32 * 1.35, // 135%
    letterSpacing: 0,
  },
  headingM: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 28 * 1.35, // 135%
    letterSpacing: 0,
  },
  headingS: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 24 * 1.35, // 135%
    letterSpacing: 0,
  },
  
  // Title
  titleXL: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 20 * 1.35, // 135%
    letterSpacing: 0,
  },
  titleL: {
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 18 * 1.35, // 135%
    letterSpacing: 0,
  },
  
  // Label
  labelM: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 16 * 1.35, // 135%
    letterSpacing: 0,
  },
  labelS: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 14 * 1.35, // 135%
    letterSpacing: 0,
  },
  
  // Body
  bodyXL: {
    fontFamily: fonts.regular,
    fontSize: 20,
    lineHeight: 20 * 1.5, // 150%
    letterSpacing: 0,
  },
  bodyL: {
    fontFamily: fonts.regular,
    fontSize: 18,
    lineHeight: 18 * 1.5, // 150%
    letterSpacing: 0,
  },
  bodyM: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 16 * 1.5, // 150%
    letterSpacing: 0,
  },
  bodyS: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 14 * 1.5, // 150%
    letterSpacing: 0,
  },
  
  // Caption
  captionBL: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 12 * 1.35, // 135%
    letterSpacing: 0,
  },
  captionBM: {
    fontFamily: fonts.bold,
    fontSize: 10,
    lineHeight: 10 * 1.35, // 135%
    letterSpacing: 0,
  },
  captionL: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 12 * 1.5, // 150%
    letterSpacing: 0,
  },
  captionM: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 10 * 1.5, // 150%
    letterSpacing: 0,
  },
} as const;

// 컬러 시스템
export const colors = {
  // White
  white: '#FFFFFF',
  black: '#000000',
  
  // Primary 색상 (주황색 계열)
  primary: {
    50: '#FFF4EB',
    100: '#FFD8B8', 
    200: '#FFBC85',
    300: '#FFA052',
    400: '#FF841F',
    500: '#EB6A00', // 메인 Primary
    600: '#B85300',
    700: '#853C00',
    800: '#522500',
    900: '#1F0E00',
  },
  
  // Secondary 색상 (파란색 계열)
  secondary: {
    50: '#F0FAFF',
    100: '#C7EDFF',
    200: '#94DDFF',
    300: '#61CDFF',
    400: '#2DBDFF',
    500: '#00ABFA',
    600: '#0088C7',
    700: '#006594',
    800: '#004261',
    900: '#001F2E',
  },
  
  // Gray 색상
  gray: {
    50: '#FAF9F9',
    100: '#E1DFDF',
    200: '#C8C6C6',
    300: '#AFACAC',
    400: '#969292',
    500: '#7D7878',
    600: '#645F5F',
    700: '#494646',
    800: '#2F2D2D',
    900: '#151414',
  },
  
  // Danger 색상
  danger: '#F9064B',
} as const;

// 간격 시스템
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// 반지름
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// 플랫폼별 섀도우 스타일
import { Platform } from 'react-native';

export const shadows = {
  sm: Platform.select({
    web: {
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    },
    default: {
      // React Native에서는 elevation만 사용
      elevation: 1,
    },
  }),
  md: Platform.select({
    web: {
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    },
    default: {
      elevation: 3,
    },
  }),
  lg: Platform.select({
    web: {
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    },
    default: {
      elevation: 5,
    },
  }),
} as const;

// 전체 디자인 시스템 export
export const designSystem = {
  fonts,
  fontWeights,
  typography,
  colors,
  spacing,
  borderRadius,
  shadows,
} as const;

export default designSystem; 