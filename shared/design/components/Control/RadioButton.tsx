import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { colors } from '../../index';

type RadioButtonVariant = 'selected' | 'unselected' | 'disabled';

interface RadioButtonProps {
  selected?: boolean;
  onPress?: () => void;
  variant?: RadioButtonVariant;
  disabled?: boolean;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  selected = false,
  onPress,
  variant,
  disabled = false,
}) => {
  // variant가 명시적으로 전달되지 않으면 selected/disabled 상태로 결정
  const getVariant = (): RadioButtonVariant => {
    if (variant) return variant;
    if (disabled) return 'disabled';
    return selected ? 'selected' : 'unselected';
  };

  const getOuterColor = () => {
    const currentVariant = getVariant();
    switch (currentVariant) {
      case 'selected':
        return colors.primary[400];
      case 'unselected':
        return colors.gray[200];
      case 'disabled':
        return colors.gray[100];
      default:
        return colors.primary[400];
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderColor: getOuterColor() },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {selected && (
        <View style={[styles.innerCircle, { backgroundColor: colors.white }]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  disabled: {
    opacity: 0.5,
  },
}); 