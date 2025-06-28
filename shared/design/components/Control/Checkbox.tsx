import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import CheckIcon from '@/assets/icons/Check.svg';
import { colors, borderRadius } from '../../index';

interface CheckboxProps {
  checked?: boolean;
  onPress?: (checked: boolean) => void;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onPress,
  disabled = false,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handlePress = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onPress?.(newValue);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isChecked ? styles.checked : styles.unchecked,
        disabled && styles.disabled,
      ]}
      onPress={handlePress}
      disabled={disabled}
    >
      {isChecked && (
        <CheckIcon width={24} height={24} color={colors.white} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: colors.primary[400],
    borderColor: colors.primary[400],
  },
  unchecked: {
    backgroundColor: colors.white,
    borderColor: colors.gray[300],
  },
  disabled: {
    opacity: 0.5,
  },
}); 