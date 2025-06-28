import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { s, vs } from '@/shared/utils/responsive';
import { colors } from '@/shared/design';
import { LabelM, BodyS, CaptionM } from '@/shared/design/components/Typography';
import { Button } from '@/shared/design/components/Control/Button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ChatDotsIcon from '@/assets/icons/Chat_Dots.svg';
import ArrowLeftIcon from '@/assets/icons/Arrow_Left.svg';

// 임시 게시물 데이터
const POSTS = {
  1: {
    id: 1,
    name: '김철수',
    date: '2023.06.28',
    content: '오늘 작업 중에 안전사고가 발생했습니다. 어떻게 신고해야 하나요?',
  },
  2: {
    id: 2,
    name: '이영희',
    date: '2023.06.27',
    content: '산재보험 신청 절차에 대해 궁금한 점이 있습니다.',
  },
  3: {
    id: 3,
    name: '박민수',
    date: '2023.06.26',
    content: '근로계약서 내용 중 이해가 안 되는 부분이 있어서 질문드립니다.',
  },
  4: {
    id: 4,
    name: '최지영',
    date: '2023.06.25',
    content: '작업장에서 보호구 착용에 대한 규정이 궁금합니다.',
  },
};

// 임시 댓글 데이터
const COMMENTS = [
  {
    id: 1,
    name: '이민수',
    content: '저도 비슷한 경험이 있어서 공감됩니다. 산재신청은 빠르게 하시는 게 좋을 것 같아요.',
    date: '2023.06.28',
    isReply: false,
  },
  {
    id: 2,
    name: '박영희',
    content: '근로복지공단에 문의해보세요.',
    date: '2023.06.28',
    isReply: true,
  },
  {
    id: 3,
    name: '김준호',
    content: '안전사고 발생 시 즉시 상급자에게 보고하고 병원 치료를 받으시기 바랍니다.',
    date: '2023.06.27',
    isReply: false,
  },
  {
    id: 4,
    name: '최수진',
    content: '감사합니다. 도움이 되었어요!',
    date: '2023.06.27',
    isReply: true,
  },
  {
    id: 5,
    name: '정태영',
    content: '저희 회사에서도 비슷한 사례가 있었는데, 산재보험 처리까지 약 2주 정도 걸렸습니다.',
    date: '2023.06.26',
    isReply: false,
  },
];

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [commentText, setCommentText] = useState('');

  // 현재 게시물 정보 가져오기
  const currentPost = POSTS[parseInt(id as string) as keyof typeof POSTS];

  const handleBackPress = () => {
    router.back();
  };

  const handleSendComment = () => {
    if (commentText.trim()) {
      // 댓글 전송 로직
      console.log('댓글 전송:', commentText);
      setCommentText('');
    }
  };

  const renderComment = (comment: typeof COMMENTS[0]) => (
    <View 
      key={comment.id} 
      style={[
        styles.commentItem,
        comment.isReply && styles.replyComment
      ]}
    >
      <View style={styles.commentContent}>
        <LabelM color={colors.black} style={styles.commentName}>
          {comment.name}
        </LabelM>
        <BodyS color={colors.black} style={styles.commentText}>
          {comment.content}
        </BodyS>
        <CaptionM color={colors.gray[600]} style={styles.commentDate}>
          {comment.date}
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 게시글 영역 (150px) */}
        <View style={styles.postSection}>
          <View style={styles.postContent}>
            <LabelM color={colors.black} style={styles.postName}>
              {currentPost?.name}
            </LabelM>
            <CaptionM color={colors.gray[600]} style={styles.postDate}>
              {currentPost?.date}
            </CaptionM>
            <BodyS color={colors.black} style={styles.postText}>
              {currentPost?.content}
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
              {COMMENTS.length}
            </CaptionM>
          </View>
        </View>

        {/* 댓글 목록 */}
        <View style={styles.commentsList}>
          {COMMENTS.map(renderComment)}
        </View>
      </ScrollView>

      {/* 댓글 입력 영역 */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="댓글을 입력하세요..."
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSendComment}
        >
          <BodyS color={colors.white}>전송</BodyS>
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
    height: vs(48),
    paddingHorizontal: s(16),
    backgroundColor: colors.primary[400],
    borderRadius: s(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 