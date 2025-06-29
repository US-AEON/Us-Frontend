import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs, ms, wp, hp } from '@/shared/utils/responsive';
import { colors, typography } from '@/shared/design';
import { BottomNavBar } from '@/shared/design/components/Navigation/BottomNavBar';
import useNavigation, { TabType } from '@/shared/hooks/useNavigation';
import LogoSvg from '@/assets/icons/logo.svg';
import BagSvg from '@/assets/icons/bag.svg';
import EllipseSvg from '@/assets/icons/Ellipse 21.svg';

const CharacterImage = require('@/assets/images/Character.png');
const Banner1Image = require('@/assets/images/banner1.png');
const Banner2Image = require('@/assets/images/banner2.png');

// 배너 데이터
const BANNERS = [
  { 
    id: 1, 
    image: Banner1Image, 
    url: 'https://eps.go.kr/eo/kr/frnr/index02.eo',
    title: '고용허가제 서비스'
  },
  { 
    id: 2, 
    image: Banner2Image, 
    url: 'https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003256',
    title: '복지로 서비스'
  },
];

export default function HomeScreen() {  
  const { navigateToTab } = useNavigation('home');

  const handleTabPress = (tab: TabType) => {
    navigateToTab(tab);
  };

  const handleBannerPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log('Cannot open URL:', url);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 영역 (56px) */}
      <View style={styles.header}>
        <LogoSvg width={s(59)} height={s(30)} />
      </View>

      {/* 메인 콘텐츠 영역 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 상단 색상 배경 영역 */}
        <View style={styles.topBackground}>
          {/* 인사말 텍스트 */}
          <View style={styles.greetingContainer}>
            <Text style={styles.hiText}>HI,</Text>
            <Text style={styles.nameText}>사용자님</Text>
          </View>
          
          {/* 캐릭터 이미지와 텍스트 */}
          <Image source={CharacterImage} style={styles.characterImage} />
          <View style={styles.workingTextContainer}>
            <Text style={styles.workingText}>You've been working</Text>
            <Text style={styles.dayText}>DAY 1</Text>
          </View>
        </View>

        {/* 워크스페이스 카드 */}
        <TouchableOpacity
          style={styles.workspaceCard}
          onPress={() => handleTabPress('workspace')}
        >
          <LinearGradient
            colors={['#F66707', '#FF841F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.workspaceCardGradient}
          >
            <View style={styles.workspaceCardContent}>
              <View style={styles.workspaceTextContainer}>
                <Text style={styles.workspaceCardSubtitle}>
                  나의 직장 정보를 한눈에 볼 수 있는
                </Text>
                <Text style={styles.workspaceCardTitle}>Work Space</Text>
              </View>
              <BagSvg width={s(91)} height={s(78)} style={styles.bagIcon} />
              <EllipseSvg width={s(64)} height={s(68)} style={styles.ellipseIcon} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* 배너 섹션 */}
        <View style={styles.bannerSection}>
          {BANNERS.map((banner) => (
            <TouchableOpacity 
              key={banner.id} 
              style={styles.bannerCard}
              onPress={() => handleBannerPress(banner.url)}
              activeOpacity={0.8}
            >
              <Image source={banner.image} style={styles.bannerImage} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 하단 네비게이션 바 */}
      <BottomNavBar activeTab="home" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    height: vs(56),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    ...typography.titleL,
    color: colors.gray[900],
  },
  scrollView: {
    flex: 1,
  },
  topBackground: {
    backgroundColor: colors.secondary[50],
    paddingBottom: vs(20),
    borderBottomLeftRadius: s(20),
    borderBottomRightRadius: s(20),
    height: vs(285),
    position: 'relative',
  },
  workspaceCard: {
    marginHorizontal: s(20),
    marginTop: vs(-50),
  },
  workspaceCardGradient: {
    height: vs(100),
    borderRadius: s(12),
    overflow: 'hidden',
  },
  workspaceCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: s(22),
    position: 'relative',
  },
  workspaceTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  workspaceCardSubtitle: {
    ...typography.labelS,
    color: colors.white,
    marginBottom: vs(4),
  },
  workspaceCardTitle: {
    ...typography.headingS,
    color: colors.white,
  },
  bagIcon: {
    position: 'absolute',
    right: s(16),
    top: s(11),
  },
  ellipseIcon: {
    position: 'absolute',
    right: 0,
    bottom: vs(-40),
  },
  bannerSection: {
    paddingHorizontal: s(20),
    paddingTop: vs(20), 
    paddingBottom: vs(40),
    gap: vs(10),
  },
  bannerCard: {
    height: vs(70),
    borderRadius: s(12),
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  characterImage: {
    position: 'absolute',
    left: s(20),
    top: vs(68),
    width: s(170),
    height: vs(146),
  },
  workingTextContainer: {
    position: 'absolute',
    right: s(20),
    top: vs(147),
  },
  workingText: {
    ...typography.labelS,
    color: colors.gray[400],
    textAlign: 'right',
  },
  dayText: {
    ...typography.headingL,
    color: colors.gray[900],
    textAlign: 'right',
    marginTop: vs(4),
  },
  greetingContainer: {
    position: 'absolute',
    right: s(20),
    top: vs(20),
  },
  hiText: {
    ...typography.headingM,
    color: colors.primary[400],
    textAlign: 'right',
  },
  nameText: {
    ...typography.titleXL,
    color: colors.gray[900],
    textAlign: 'right',
    marginTop: vs(4),
  },
}); 