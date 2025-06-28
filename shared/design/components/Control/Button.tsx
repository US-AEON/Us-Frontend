import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { LabelM } from '../Typography';
import { colors, spacing } from '../../index';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  title: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  selected = false,
  onPress,
  variant = 'primary',
  disabled = false,
}) => {
  const getBackgroundColor = () => {
    if (selected) {
      return colors.primary[400];
    } else {
      return 'rgba(0, 0, 0, 0.5)'; // black 50% 투명도
    }
  };

  const getTextColor = () => {
    return colors.white;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        disabled && styles.disabled,
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