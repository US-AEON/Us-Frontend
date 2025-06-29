import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { s, vs } from '@/shared/utils/responsive';
import { colors } from '@/shared/design';
import { LabelM, BodyS, CaptionM } from '@/shared/design/components/Typography';
import { Button } from '@/shared/design/components/Control/Button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ChatDotsIcon from '@/assets/icons/Chat_Dots.svg';
import ArrowLeftIcon from '@/assets/icons/Arrow_Left.svg';
import { PostService, CommentService } from '@/services/api';
import { PostResponse, CommentResponse } from '@/services/api/types';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [commentText, setCommentText] = useState('');
  const [post, setPost] = useState<PostResponse | null>(null);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('알림', '댓글을 입력해주세요.');
      return;
    }

    try {
      setCommentLoading(true);
      await CommentService.createComment({
        content: commentText.trim(),
        postId: id as string,
      });
      
      setCommentText('');
      // 댓글 목록 새로고침
      await fetchComments();
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      Alert.alert('오류', '댓글 작성에 실패했습니다.');
    } finally {
      setCommentLoading(false);
    }
  };

  // 게시물 정보 불러오기
  const fetchPost = async () => {
    try {
      const fetchedPost = await PostService.getPostById(id as string);
      setPost(fetchedPost);
    } catch (error) {
      console.error('게시물 불러오기 실패:', error);
      Alert.alert('오류', '게시물을 불러오는데 실패했습니다.');
    }
  };

  // 댓글 목록 불러오기
  const fetchComments = async () => {
    try {
      const fetchedComments = await CommentService.getCommentsByPostId(id as string);
      setComments(fetchedComments);
    } catch (error) {
      console.error('댓글 불러오기 실패:', error);
      Alert.alert('오류', '댓글을 불러오는데 실패했습니다.');
    }
  };

  // 데이터 초기 로딩
  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchPost(), fetchComments()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const renderComment = (comment: CommentResponse) => (
    <View 
      key={comment.id} 
      style={[
        styles.commentItem,
        comment.children && comment.children.length > 0 && styles.replyComment
      ]}
    >
      <View style={styles.commentContent}>
        <LabelM color={colors.black} style={styles.commentName}>
          {comment.authorName || '익명'}
        </LabelM>
        <BodyS color={colors.black} style={styles.commentText}>
          {comment.content}
        </BodyS>
        <CaptionM color={colors.gray[600]} style={styles.commentDate}>
          {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
        </CaptionM>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 상단 헤더 영역 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ArrowLeftIcon width={s(24)} height={s(24)} color={colors.gray[900]} />
        </TouchableOpacity>
      </View>

      {/* 메인 콘텐츠 영역 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[400]} />
          <LabelM color={colors.gray[600]} style={styles.loadingText}>
            로딩 중...
          </LabelM>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 게시글 영역 (150px) */}
          <View style={styles.postSection}>
            <View style={styles.postContent}>
              <LabelM color={colors.black} style={styles.postName}>
                {post?.authorName || '익명'}
              </LabelM>
              <CaptionM color={colors.gray[600]} style={styles.postDate}>
                {post?.createdAt ? new Date(post.createdAt).toLocaleDateString('ko-KR') : ''}
              </CaptionM>
              <BodyS color={colors.black} style={styles.postText}>
                {post?.content}
              </BodyS>
            </View>
          </View>

          {/* 여백 */}
          <View style={styles.spacing} />

          {/* 댓글 헤더 */}
          <View style={styles.commentsHeader}>
            <LabelM color={colors.black}>Comments</LabelM>
            <View style={styles.commentCountContainer}>
              <ChatDotsIcon 
                width={s(16)} 
                height={s(16)} 
                color={colors.gray[600]}
              />
              <CaptionM color={colors.gray[600]} style={styles.commentCount}>
                {comments.length}
              </CaptionM>
            </View>
          </View>

          {/* 댓글 목록 */}
          <View style={styles.commentsList}>
            {comments.length > 0 ? (
              comments.map(renderComment)
            ) : (
              <View style={styles.emptyCommentsContainer}>
                <BodyS color={colors.gray[600]}>Be the first to comment!</BodyS>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {/* 댓글 입력 영역 */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Leave the comments."
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, commentLoading && styles.sendButtonDisabled]}
          onPress={handleSendComment}
          disabled={commentLoading}
        >
          <BodyS color={colors.white}>
            {commentLoading ? 'Sending...' : 'Enter'}
          </BodyS>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: s(20),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  scrollView: {
    flex: 1,
  },
  postSection: {
    height: vs(150),
    marginTop: vs(16),
    backgroundColor: colors.gray[50],
    marginHorizontal: s(20),
    borderRadius: s(8),
  },
  postContent: {
    flex: 1,
    padding: s(16),
  },
  postName: {
    marginBottom: vs(8),
  },
  postDate: {
    marginBottom: vs(12),
  },
  postText: {
    flex: 1,
  },
  spacing: {
    height: vs(20),
  },
  commentsHeader: {
    height: vs(48),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
  },
  commentCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    marginLeft: s(4),
  },
  commentsList: {
    paddingBottom: vs(20),
  },
  commentItem: {
    height: vs(98),
    paddingHorizontal: s(20),
    paddingVertical: vs(12),
    justifyContent: 'center',
  },
  replyComment: {
    backgroundColor: colors.gray[50],
    paddingLeft: s(60),
  },
  commentContent: {
    flex: 1,
  },
  commentName: {
    marginBottom: vs(8),
  },
  commentText: {
    marginBottom: vs(8),
    flex: 1,
  },
  commentDate: {
    // marginBottom는 필요 없음 (마지막 요소)
  },
  commentInputContainer: {
    height: vs(72),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(20),
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  commentInput: {
    flex: 1,
    height: vs(48),
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: s(8),
    paddingHorizontal: s(12),
    paddingVertical: s(8),
    fontSize: s(14),
    textAlignVertical: 'top',
  },
  sendButton: {
    marginLeft: s(8),
    width: s(81),
    height: vs(48),
    backgroundColor: colors.primary[400],
    borderRadius: s(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray[400],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: vs(16),
  },
  emptyCommentsContainer: {
    alignItems: 'center',
    paddingVertical: vs(40),
  },
}); 