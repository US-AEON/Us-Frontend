import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors, spacing } from '../../index';
import HomeIcon from '@/assets/icons/Home.svg';
import HomeFilledIcon from '@/assets/icons/Home_filled.svg';
import EmergencyIcon from '@/assets/icons/Emergency.svg';
import EmergencyFilledIcon from '@/assets/icons/Emergency_filled.svg';
import WorkspaceIcon from '@/assets/icons/Workspace.svg';
import WorkspaceFilledIcon from '@/assets/icons/Workspace_filled.svg';
import UserIcon from '@/assets/icons/User.svg';
import UserFilledIcon from '@/assets/icons/User_filled.svg';
import MicrophoneFilledIcon from '@/assets/icons/Microphone_filled.svg';
import { TabType } from '@/shared/hooks/useNavigation';
const GradientOrangeImage = require('../../../../assets/images/Gradient_orange.png');

interface BottomNavBarProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabPress,
}) => {

  const renderCenterButton = () => {
    return (
      <TouchableOpacity 
        style={styles.centerButton}
        onPress={() => onTabPress('record')}
      >
        <View style={styles.gradientContainer}>
          <Image 
            source={GradientOrangeImage}
            style={styles.gradientImage}
          />
          <View style={styles.microphoneContainer}>
            <MicrophoneFilledIcon 
              width={24} 
              height={24} 
              color={colors.primary[800]}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 홈 */}
      <TouchableOpacity 
        style={styles.tabButton}
        onPress={() => onTabPress('home')}
      >
        {activeTab === 'home' ? (
          <HomeFilledIcon 
            width={24} 
            height={24} 
            color={colors.gray[900]}
          />
        ) : (
          <HomeIcon 
            width={24} 
            height={24} 
            color={colors.primary[800]}
          />
        )}
      </TouchableOpacity>

      {/* 헬프 */}
      <TouchableOpacity 
        style={styles.tabButton}
        onPress={() => onTabPress('help')}
      >
        {activeTab === 'help' ? (
          <EmergencyFilledIcon 
            width={24} 
            height={24} 
            color={colors.gray[900]}
          />
        ) : (
          <EmergencyIcon 
            width={24} 
            height={24} 
            color={colors.primary[800]}
          />
        )}
      </TouchableOpacity>

      {/* 가운데 녹음 버튼 */}
      {renderCenterButton()}

      {/* 워크스페이스 */}
      <TouchableOpacity 
        style={styles.tabButton}
        onPress={() => onTabPress('workspace')}
      >
        {activeTab === 'workspace' ? (
          <WorkspaceFilledIcon 
            width={24} 
            height={24} 
            color={colors.gray[900]}
          />
        ) : (
          <WorkspaceIcon 
            width={24} 
            height={24} 
            color={colors.primary[800]}
          />
        )}
      </TouchableOpacity>

      {/* 마이페이지 */}
      <TouchableOpacity 
        style={styles.tabButton}
        onPress={() => onTabPress('mypage')}
      >
        {activeTab === 'mypage' ? (
          <UserFilledIcon 
            width={24} 
            height={24} 
            color={colors.gray[900]}
          />
        ) : (
          <UserIcon 
            width={24} 
            height={24} 
            color={colors.primary[800]}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    paddingBottom: spacing.lg + spacing.sm, // Safe area 고려
  },
  tabButton: {
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientImage: {
    width: 72,
    height: 72,
  },
  microphoneContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 