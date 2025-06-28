import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { LabelM } from '../Typography';
import { colors, spacing } from '../../index';
import HamburgerIcon from '@/assets/icons/Hamburger.svg';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'neutral';
export type ButtonState = 'default' | 'pressed' | 'disabled';

interface ButtonSystemProps {
  title: string;
  variant?: ButtonVariant;
  state?: ButtonState;
  onPress?: () => void;
  disabled?: boolean;
  withIcon?: boolean;
}

export const ButtonSystem: React.FC<ButtonSystemProps> = ({
  title,
  variant = 'primary',
  state = 'default',
  onPress,
  disabled = false,
  withIcon = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const getButtonStyles = () => {
    const actualState = disabled ? 'disabled' : (isPressed ? 'pressed' : state);
    
    switch (variant) {
      case 'primary':
        switch (actualState) {
          case 'default':
            return {
              backgroundColor: colors.primary[500],
              textColor: colors.white,
            };
          case 'pressed':
            return {
              backgroundColor: colors.primary[700],
              textColor: colors.white,
            };
          case 'disabled':
            return {
              backgroundColor: colors.primary[200],
              textColor: colors.white,
            };
        }
        break;
        
      case 'secondary':
        switch (actualState) {
          case 'default':
            return {
              backgroundColor: colors.primary[600],
              textColor: colors.white,
            };
          case 'pressed':
            return {
              backgroundColor: colors.primary[800],
              textColor: colors.white,
            };
          case 'disabled':
            return {
              backgroundColor: colors.primary[300],
              textColor: colors.white,
            };
        }
        break;
        
      case 'tertiary':
        switch (actualState) {
          case 'default':
            return {
              backgroundColor: colors.primary[300],
              textColor: colors.primary[800],
            };
          case 'pressed':
            return {
              backgroundColor: colors.primary[400],
              textColor: colors.primary[800],
            };
          case 'disabled':
            return {
              backgroundColor: colors.primary[100],
              textColor: colors.primary[400],
            };
        }
        break;
        
      case 'neutral':
        switch (actualState) {
          case 'default':
            return {
              backgroundColor: colors.gray[200],
              textColor: colors.gray[900],
            };
          case 'pressed':
            return {
              backgroundColor: colors.gray[400],
              textColor: colors.gray[900],
            };
          case 'disabled':
            return {
              backgroundColor: colors.gray[100],
              textColor: colors.gray[400],
            };
        }
        break;
    }
    
    return {
      backgroundColor: colors.primary[500],
      textColor: colors.white,
    };
  };

  const buttonStyles = getButtonStyles();
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: buttonStyles.backgroundColor },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {withIcon && (
          <HamburgerIcon 
            width={16} 
            height={16} 
            color={buttonStyles.textColor}
            style={styles.icon}
          />
        )}
        <LabelM color={buttonStyles.textColor}>{title}</LabelM>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 88,
    minHeight: 36,
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.xs,
  },
  disabled: {
    // 추가 disabled 스타일링이 필요하면 여기에
  },
}); 