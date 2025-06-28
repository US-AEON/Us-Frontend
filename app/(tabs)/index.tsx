import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { 
  HeadingM,
  TopNavBar,
  BottomNavBar,
  TabType
} from '../../shared/design/components';
import { colors, spacing } from '../../shared/design';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const handleMenuPress = () => {
    console.log('Menu pressed');
  };

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    console.log('Tab pressed:', tab);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopNavBar onMenuPress={handleMenuPress} />
      
      <View style={styles.container}>
        <HeadingM style={styles.title}>Navigation Bar System</HeadingM>
        <View style={styles.content}>
          {/* 현재 선택된 탭 표시 */}
          <HeadingM style={styles.activeTabText}>
            Active Tab: {activeTab}
          </HeadingM>
        </View>
      </View>

      <BottomNavBar 
        activeTab={activeTab} 
        onTabPress={handleTabPress} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.lg,
  },
  title: {
    textAlign: 'center',
    color: colors.gray[900],
    marginBottom: spacing.xl,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabText: {
    color: colors.primary[600],
    textAlign: 'center',
  },
}); 