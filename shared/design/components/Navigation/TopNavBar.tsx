import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../../index';
import ArrowLeftIcon from '@/assets/icons/Arrow_Left.svg';

interface TopNavBarProps {
  onMenuPress?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ 
  onMenuPress 
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={onMenuPress}
      >
        <ArrowLeftIcon 
          width={24} 
          height={24} 
          color={colors.primary[800]} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  menuButton: {
    padding: spacing.sm,
  },
}); 