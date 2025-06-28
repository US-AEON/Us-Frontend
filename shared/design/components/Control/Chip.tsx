import React from 'react';
import { TouchableOpacity, StyleSheet, View, TouchableOpacityProps } from 'react-native';
import { BodyS } from '../Typography';
import { colors } from '../../index';
import { s, vs } from '@/shared/utils/responsive';

interface ChipProps extends TouchableOpacityProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

/**
 * 칩 컴포넌트
 * 
 * @param label - 칩에 표시할 텍스트
 * @param selected - 선택 여부 (기본값: false)
 * @param onPress - 클릭 이벤트 핸들러
 */
export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected ? styles.selected : styles.unselected,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      {...props}
    >
      <BodyS
        color={selected ? colors.white : colors.black}
      >
        {label}
      </BodyS>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: s(12),
    paddingVertical: vs(5.5),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: colors.primary[400],
  },
  unselected: {
    backgroundColor: colors.gray[200],
  },
}); 