import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { 
  HeadingM,
  GlobalNavigationBar,
} from '../../shared/design/components';
import { colors, spacing } from '../../shared/design';

export default function HomeScreen() {
  const handleBackPress = () => {
    console.log('Back pressed');
  };

  const handleClosePress = () => {
    console.log('Close pressed');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <HeadingM style={styles.title}>GNB</HeadingM>
        
        <View style={styles.gnbContainer}>
          {/* 첫 번째 GNB - 뒤로가기 + 제목 + 닫기 */}
          <GlobalNavigationBar
            title="라벨"
            onBackPress={handleBackPress}
            onClosePress={handleClosePress}
            showBackButton={true}
            showCloseButton={true}
          />
          
          {/* 두 번째 GNB - 뒤로가기 + 제목 + 닫기 */}
          <GlobalNavigationBar
            title="라벨"
            onBackPress={handleBackPress}
            onClosePress={handleClosePress}
            showBackButton={true}
            showCloseButton={true}
          />
        </View>
      </ScrollView>
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
  },
  contentContainer: {
    padding: spacing.lg,
  },
  title: {
    textAlign: 'left',
    color: colors.black,
    marginBottom: spacing.xl,
    fontSize: 32,
    fontWeight: 'bold',
  },
  gnbContainer: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary[200],
    borderStyle: 'dashed',
    overflow: 'hidden',
    width: '100%',
  },
}); 