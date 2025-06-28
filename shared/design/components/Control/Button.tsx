import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { LabelM } from '../Typography';
import { colors, spacing } from '../../index';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  title: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  selected = false,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}) => {
  const getBackgroundColor = () => {
    if (disabled) {
      return colors.gray[200];
    }
    
    switch (variant) {
      case 'primary':
        return colors.primary[400];
      case 'secondary':
        return colors.secondary[50];
      default:
        return colors.primary[400];
    }
  };

  const getTextColor = () => {
    if (disabled) {
      return colors.gray[400];
    }
    
    switch (variant) {
      case 'primary':
        return colors.white;
      case 'secondary':
        return colors.gray[900];
      default:
        return colors.white;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <LabelM color={getTextColor()}>{title}</LabelM>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  disabled: {
    opacity: 0.5,
  },
}); 