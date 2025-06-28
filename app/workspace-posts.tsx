import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { s, vs } from '@/shared/utils/responsive';
import { colors, typography } from '@/shared/design';
import { BottomNavBar } from '@/shared/design/components/Navigation/BottomNavBar';
import { BodyM, BodyS, CaptionL, TitleL } from '@/shared/design/components/Typography';
import useNavigation, { TabType } from '@/shared/hooks/useNavigation';
import { useRouter } from 'expo-router';
import ChatDotsIcon from '@/assets/icons/Chat_Dots.svg';
import ArrowLeftIcon from '@/assets/icons/Arrow_Left.svg';

// 임시 워크스페이스 데이터
const WORKSPACE_POSTS = [
  {
    id: 1,
    name: '김철수',
    date: '2023.06.28',
    content: '오늘 작업 중에 안전사고가 발생했습니다. 어떻게 신고해야 하나요?',
    commentCount: 5,
  },
  {
    id: 2,
    name: '이영희',
    date: '2023.06.27',
    content: '산재보험 신청 절차에 대해 궁금한 점이 있습니다.',
    commentCount: 3,
  },
  {
    id: 3,
    name: '박민수',
    date: '2023.06.26',
    content: '근로계약서 내용 중 이해가 안 되는 부분이 있어서 질문드립니다.',
    commentCount: 8,
  },
  {
    id: 4,
    name: '최지영',
    date: '2023.06.25',
    content: '작업장에서 보호구 착용에 대한 규정이 궁금합니다.',
    commentCount: 2,
  },
];

export default function WorkspacePostsScreen() {
  const { navigateToTab } = useNavigation('workspace');
  const router = useRouter();

  const handleTabPress = (tab: TabType) => {
    navigateToTab(tab);
  };

  const handlePostPress = (postId: number) => {
    router.push(`/post/${postId}` as never);
  };

  const renderPostItem = ({ item }: { item: typeof WORKSPACE_POSTS[0] }) => (
    <TouchableOpacity 
      style={styles.postItem}
      onPress={() => handlePostPress(item.id)}
    >
      <View style={styles.postContent}>
        <BodyM color={colors.black} style={styles.postName}>
          {item.name}
        </BodyM>
        <CaptionL color={colors.gray[600]} style={styles.postDate}>
          {item.date}
        </CaptionL>
        <BodyS color={colors.black} style={styles.postText}>
          {item.content}
        </BodyS>
        <View style={styles.commentSection}>
          <ChatDotsIcon 
            width={s(16)} 
            height={s(16)} 
            color={colors.gray[600]}
          />
          <CaptionL color={colors.gray[600]} style={styles.commentCount}>
            {item.commentCount}
          </CaptionL>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
              {/* 상단 헤더 영역 */}
        <View style={styles.header}>
          <TitleL color={colors.gray[900]}>WORKSPACE</TitleL>
        </View>

      {/* 메인 콘텐츠 영역 */}
      <FlatList
        data={WORKSPACE_POSTS}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.postsList}
        contentContainerStyle={styles.postsContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* 하단 네비게이션 바 */}
      <BottomNavBar activeTab="workspace" onTabPress={handleTabPress} />
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
    paddingHorizontal: s(20),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },

  postsList: {
    flex: 1,
  },
  postsContainer: {
    paddingHorizontal: s(20),
    paddingTop: vs(28),
    paddingBottom: vs(20),
  },
  postItem: {
    height: vs(130),
    backgroundColor: colors.white,
    borderRadius: s(20),
    borderWidth: 2,
    borderColor: colors.gray[100],
    padding: s(16),
  },
  postContent: {
    flex: 1,
  },
  postName: {
    ...typography.labelM,
    marginBottom: vs(8),
  },
  postDate: {
    ...typography.captionBL,
    marginBottom: vs(8),
  },
  postText: {
    ...typography.bodyS,
    marginBottom: vs(10),
    flex: 1,
  },
  commentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  commentCount: {
    marginLeft: s(5),
  },
  separator: {
    height: vs(20),
  },
}); 