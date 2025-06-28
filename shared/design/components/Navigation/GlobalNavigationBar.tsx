import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { LabelM } from '../Typography';
import { colors, spacing } from '../../index';
import ArrowLeftIcon from '@/assets/icons/Arrow_Left.svg';
import CloseMIcon from '@/assets/icons/Close_M.svg';

interface GlobalNavigationBarProps {
  title?: string;
  onBackPress?: () => void;
  onClosePress?: () => void;
  showBackButton?: boolean;
  showCloseButton?: boolean;
}

export const GlobalNavigationBar: React.FC<GlobalNavigationBarProps> = ({
  title = "라벨",
  onBackPress,
  onClosePress,
  showBackButton = true,
  showCloseButton = true,
}) => {
  return (
    <View style={styles.container}>
      {/* 왼쪽 버튼 영역 */}
      <View style={styles.leftSection}>
        {showBackButton ? (
          <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
            <ArrowLeftIcon 
              width={24} 
              height={24} 
              color={colors.gray[900]}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>

      {/* 가운데 제목 영역 */}
      <View style={styles.centerSection}>
        <LabelM style={styles.title}>{title}</LabelM>
      </View>

      {/* 오른쪽 버튼 영역 */}
      <View style={styles.rightSection}>
        {showCloseButton ? (
          <TouchableOpacity onPress={onClosePress} style={styles.iconButton}>
            <CloseMIcon 
              width={24} 
              height={24} 
              color={colors.gray[900]}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    height: 56,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors.gray[900],
    textAlign: 'center',
  },
}); 