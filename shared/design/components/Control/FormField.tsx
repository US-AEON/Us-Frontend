import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LabelS, CaptionL } from '../Typography';
import { colors, spacing, typography } from '../../index';
import HideIcon from '@/assets/icons/Hide.svg';
import ShowIcon from '@/assets/icons/Show.svg';
import CloseCircleIcon from '@/assets/icons/Close_Circle.svg';

export type FormFieldState = 'default' | 'focused' | 'error' | 'success' | 'disabled';

interface FormFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
  helperText?: string;
  state?: FormFieldState;
  secureTextEntry?: boolean;
  editable?: boolean;
  autoFocus?: boolean;
  showClearButton?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  placeholder = "플레이스홀더",
  value = "",
  onChangeText,
  onClear,
  helperText,
  state = 'default',
  secureTextEntry = false,
  editable = true,
  autoFocus = false,
  showClearButton = true,
}) => {
  const [isFocused, setIsFocused] = useState(autoFocus);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleChangeText = (text: string) => {
    onChangeText?.(text);
  };

  const handleClear = () => {
    onChangeText?.("");
    onClear?.();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getLabelColor = () => {
    switch (state) {
      case 'error':
        return colors.danger;
      case 'success':
        return colors.primary[500];
      case 'focused':
        return colors.primary[500];
      case 'disabled':
        return colors.gray[400];
      default:
        return colors.gray[900];
    }
  };

  const getBorderColor = () => {
    if (state === 'disabled') {
      return colors.gray[200];
    }
    if (isFocused || state === 'focused') {
      return colors.primary[300];
    }
    if (state === 'error') {
      return colors.danger;
    }
    return colors.gray[200];
  };

  const getHelperTextColor = () => {
    switch (state) {
      case 'error':
        return colors.danger;
      case 'success':
        return colors.primary[500];
      case 'disabled':
        return colors.gray[300];
      default:
        return colors.gray[400];
    }
  };

  const isDisabled = state === 'disabled' || !editable;

  return (
    <View style={styles.container}>
      {label && (
        <LabelS style={[styles.label, { color: getLabelColor() }]}>
          {label}
        </LabelS>
      )}
      
      <View style={[
        styles.inputContainer, 
        { borderColor: getBorderColor() },
        (isFocused || state === 'focused') && styles.focused,
        isDisabled && styles.disabled
      ]}>
        <TextInput
          style={[
            styles.textInput,
            isDisabled && { color: colors.gray[400] }
          ]}
          placeholder={placeholder}
          placeholderTextColor={isDisabled ? colors.gray[300] : colors.gray[400]}
          value={value}
          onChangeText={handleChangeText}
          onFocus={() => !isDisabled && setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!isDisabled}
          autoFocus={autoFocus && !isDisabled}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
        />
        
        {/* 우측 아이콘들 */}
        <View style={styles.rightIcons}>
          {secureTextEntry && (
            <TouchableOpacity 
              onPress={togglePasswordVisibility} 
              style={styles.eyeButton}
              disabled={isDisabled}
            >
              {isPasswordVisible ? (
                <ShowIcon 
                  width={20} 
                  height={20} 
                  color={isDisabled ? colors.gray[300] : colors.gray[400]}
                />
              ) : (
                <HideIcon 
                  width={20} 
                  height={20} 
                  color={isDisabled ? colors.gray[300] : colors.gray[400]}
                />
              )}
            </TouchableOpacity>
          )}
          
          {showClearButton && value.length > 0 && !isDisabled && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <CloseCircleIcon 
                width={20} 
                height={20} 
                color={colors.gray[300]}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {helperText && (
        <CaptionL style={[styles.helperText, { color: getHelperTextColor() }]}>
          {helperText}
        </CaptionL>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 79,
    marginBottom: 24,
  },
  label: {
    marginBottom: spacing.xs,
    height: 20, // Label height
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    height: 51, // 79 - 20 (label) - 8 (marginBottom) = 51
  },
  focused: {
    // 포커스 시 추가 스타일링이 필요하면 여기에
  },
  disabled: {
    backgroundColor: colors.gray[50],
  },
  textInput: {
    flex: 1,
    ...typography.bodyM,
    color: colors.gray[900],
    padding: 0,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  clearButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  helperText: {
    marginTop: spacing.xs,
  },
}); 