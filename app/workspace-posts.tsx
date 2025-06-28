import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { s, vs } from '@/shared/utils/responsive';
import { colors, typography } from '@/shared/design';
import { BottomNavBar } from '@/shared/design/components/Navigation/BottomNavBar';
import { BodyM, BodyS, CaptionL, TitleL } from '@/shared/design/components/Typography';
import useNavigation, { TabType } from '@/shared/hooks/useNavigation';
import { useRouter } from 'expo-router';
import ChatDotsIcon from '@/assets/icons/Chat_Dots.svg';
import ArrowLeftIcon from '@/assets/icons/Arrow_Left.svg';
import HamburgerIcon from '@/assets/icons/Hamburger.svg';
import { PostService, WorkspaceService } from '@/services/api';
import { PostResponse } from '@/services/api/types';

export default function WorkspacePostsScreen() {
  const { navigateToTab } = useNavigation('workspace');
  const router = useRouter();
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [workspaceId, setWorkspaceId] = useState<string>('current-workspace');

  const handleTabPress = (tab: TabType) => {
    navigateToTab(tab);
  };

  const handlePostPress = (postId: string) => {
    router.push(`/post/${postId}` as never);
  };

  const handleLeaveWorkspace = () => {
    Alert.alert(
      'Leave Workspace',
      'Are you sure you want to leave this workspace?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await WorkspaceService.leaveWorkspace();
              Alert.alert('Success', 'You have left the workspace.', [
                {
                  text: 'OK',
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              console.error('워크스페이스 탈퇴 실패:', error);
              Alert.alert('Error', 'Failed to leave workspace. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // 게시글 목록 불러오기
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await PostService.getAllPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('게시글 불러오기 실패:', error);
      Alert.alert('오류', '게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderPostItem = ({ item }: { item: PostResponse }) => (
    <TouchableOpacity 
      style={styles.postItem}
      onPress={() => handlePostPress(item.id)}
    >
      <View style={styles.postContent}>
        <BodyM color={colors.black} style={styles.postName}>
          {item.authorName || '익명'}
        </BodyM>
        <CaptionL color={colors.gray[600]} style={styles.postDate}>
          {new Date(item.createdAt).toLocaleDateString('ko-KR')}
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
          <View style={styles.headerLeft} />
          <TitleL color={colors.gray[900]}>WORKSPACE</TitleL>
          <TouchableOpacity onPress={handleLeaveWorkspace} style={styles.headerRight}>
            <HamburgerIcon width={s(24)} height={s(24)} color={colors.gray[900]} />
          </TouchableOpacity>
        </View>

      {/* 메인 콘텐츠 영역 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[400]} />
          <BodyM color={colors.gray[600]} style={styles.loadingText}>
            게시글을 불러오는 중...
          </BodyM>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          style={styles.postsList}
          contentContainerStyle={styles.postsContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <BodyM color={colors.gray[600]}>게시글이 없습니다.</BodyM>
            </View>
          )}
        />
      )}

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerLeft: {
    width: s(24),
  },
  headerRight: {
    width: s(24),
    height: s(24),
    justifyContent: 'center',
    alignItems: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: vs(16),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: vs(100),
  },
}); 