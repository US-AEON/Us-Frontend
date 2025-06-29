import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { s, vs, ms, wp, hp } from '@/shared/utils/responsive';
import { colors, typography } from '@/shared/design';
import { BottomNavBar } from '@/shared/design/components/Navigation/BottomNavBar';
import useNavigation, { TabType } from '@/shared/hooks/useNavigation';
import { UserService } from '@/services/api';
import LogoSvg from '@/assets/icons/logo.svg';
import BagSvg from '@/assets/icons/bag.svg';
import EllipseSvg from '@/assets/icons/Ellipse 21.svg';

const CharacterImage = require('@/assets/images/Character.png');

// 임시 노트 데이터
const NOTES = [
  { id: 1, title: '6월 28일의 음성기록', date: '2025.06.28' },
  { id: 2, title: '6월 27일의 음성기록', date: '2025.06.27' },
  { id: 3, title: '6월 26일의 음성기록', date: '2025.06.26' },
  { id: 4, title: '6월 25일의 음성기록', date: '2025.06.25' },
];

export default function HomeScreen() {  
  const { navigateToTab } = useNavigation('home');
  const [userName, setUserName] = useState('사용자님');

  // 사용자 프로필 정보 불러오기
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await UserService.getProfile();
        if (profile.name) {
          setUserName(profile.name + '님');
        }
      } catch (error) {
        console.error('프로필 불러오기 실패:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleTabPress = (tab: TabType) => {
    navigateToTab(tab);
  };

  return (
    <View style={styles.container}>
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
            <Text style={styles.nameText}>{userName}</Text>
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

        {/* 노트 섹션 헤더 */}
        <View style={styles.noteSectionHeader}>
          <Text style={styles.noteSectionTitle}>NEW NOTE</Text>
          <TouchableOpacity>
            <Text style={styles.noteSectionMore}>&gt;</Text>
          </TouchableOpacity>
        </View>

        {/* 노트 목록 */}
        <View style={styles.noteList}>
          {NOTES.map((note) => (
            <TouchableOpacity key={note.id} style={styles.noteItem}>
              <View style={styles.noteContent}>
                <Text style={styles.noteTitle}>{note.title}</Text>
                <Text style={styles.noteDate}>{note.date}</Text>
              </View>
              <Text style={styles.noteArrow}>&gt;</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 하단 네비게이션 바 */}
      <BottomNavBar activeTab="home" onTabPress={handleTabPress} />
    </View>
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
  noteSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: vs(52),
    marginHorizontal: s(20),
    marginTop: vs(20),
  },
  noteSectionTitle: {
    ...typography.labelM,
    color: colors.gray[900],
  },
  noteSectionMore: {
    ...typography.titleL,
    color: colors.gray[500],
  },
  noteList: {
    paddingHorizontal: s(20),
    paddingTop: vs(12),
    paddingBottom: vs(20), // 하단 네비게이션 바를 가리지 않도록 여백 추가
    gap: vs(12), // 노트 사이 간격
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(16),
    paddingHorizontal: s(16),
    backgroundColor: colors.secondary[50],
    borderRadius: s(8),
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    ...typography.bodyM,
    color: colors.gray[900],
    marginBottom: vs(4),
  },
  noteDate: {
    ...typography.captionL,
    color: colors.gray[500],
  },
  noteArrow: {
    ...typography.titleL,
    color: colors.gray[400],
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