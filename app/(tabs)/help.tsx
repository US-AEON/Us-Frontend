import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { s, vs } from '@/shared/utils/responsive';
import { colors, typography } from '@/shared/design';
import { BottomNavBar } from '@/shared/design/components/Navigation/BottomNavBar';
import { TitleL, CaptionBL, BodyS, LabelM } from '@/shared/design/components/Typography';
import { Button } from '@/shared/design/components/Control/Button';
import { Chip } from '@/shared/design/components/Control/Chip';
import useNavigation, { TabType } from '@/shared/hooks/useNavigation';
import ArrowDownIcon from '@/assets/icons/Arrow_Down.svg';

const Character2Image = require('@/assets/images/Character2.png');

const descriptions = {
  한국어: `산업재해보상보험은 근로자가 일을 하다가 다치거나 병에 걸렸을 때, 치료비와 생계비 등을 국가가 대신 보장해주는 사회보장 제도입니다. '산재보험'이라고도 불리며, 업무 중 발생한 사고뿐 아니라 업무와 관련된 질병, 심지어 출퇴근 중 발생한 사고까지도 보상 대상이 될 수 있습니다. 무엇보다 중요한 점은, 이 제도는 한국인뿐 아니라 외국인 노동자에게도 똑같이 적용된다는 것입니다. 외국인 근로자라 하더라도 고용보험과 산재보험은 법적으로 가입이 의무화되어 있으며, 사고 발생 시 내국인과 동일한 절차로 치료비와 보상을 받을 수 있습니다. 이는 외국인 근로자의 권리를 보호하기 위한 중요한 제도적 장치입니다. 만약 근무 중 사고나 질병이 발생했다면, 가장 먼저 병원 치료를 받은 뒤, 고용주 또는 근로자 본인이 근로복지공단에 '산재요양신청서'를 제출해야 합니다. 이후 심사를 통해 치료비, 휴업급여, 장애급여, 유족급여 등 다양한 형태의 보상을 받을 수 있습니다.`,
  English: `The Industrial Accident Compensation Insurance (IACI) is a social insurance system that supports workers who get injured or become ill due to work. It covers not only accidents during work, but also work-related illnesses and commuting accidents. Foreign workers are also covered under the same legal obligations and rights. To apply, you must submit medical records, an application form, and proof of employment. You can apply online or at local branches.`,
  中国话: `产业灾害赔偿保险是国家为在工作中受伤或患病的劳动者提供治疗和生活费用的一种社会保障制度。外国劳动者也依法享有同样的权益。申请时需提交医疗记录、申请表和就业证明，可在线或到相关机关申请。`,
  'tiếng Việt': `Bảo hiểm tai nạn lao động là một chế độ hỗ trợ người lao động bị thương hoặc mắc bệnh khi làm việc. Người lao động nước ngoài cũng có quyền lợi như người Hàn. Để nộp đơn, cần hồ sơ y tế, đơn đăng ký và hợp đồng lao động. Có thể nộp trực tiếp hoặc trực tuyến.`,
} as const;

type Language = keyof typeof descriptions;

export default function HelpScreen() {
  const { navigateToTab } = useNavigation('help');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('한국어');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTabPress = (tab: TabType) => {
    navigateToTab(tab);
  };

  const languages: Language[] = Object.keys(descriptions) as Language[];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EMERGENT HELP</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <TitleL color={colors.black} style={styles.titleText}>What is Korean IACI?</TitleL>
            <CaptionBL color={colors.gray[600]} style={styles.captionText}>
              (Korean Industrial Accident Compensation Insurance)
            </CaptionBL>
          </View>

          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>
              If you get injured while working, you're eligible for compensation.
            </Text>
          </View>

          <View style={styles.languageContainer}>
            <View style={styles.chipsContainer}>
              {languages.map((language) => (
                <Chip
                  key={language}
                  label={language}
                  selected={selectedLanguage === language}
                  onPress={() => setSelectedLanguage(language)}
                />
              ))}
            </View>
          </View>

          <View style={styles.longDescriptionBox}>
            <Text
              style={styles.longDescriptionText}
              numberOfLines={isExpanded ? undefined : 5}
              ellipsizeMode="tail"
            >
              {descriptions[selectedLanguage]}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <BodyS color={colors.black}>{isExpanded ? '접기' : '더보기'}</BodyS>
            <ArrowDownIcon
              width={s(16)}
              height={s(16)}
              color={colors.black}
              style={[styles.arrowIcon, isExpanded && styles.arrowIconRotated]}
            />
          </TouchableOpacity>

          <View style={styles.characterSection}>
            <Image source={Character2Image} style={styles.characterImage} />
            <LabelM color={colors.black} style={styles.lawyerText}>
              Didn't receive compensation for your injury?{'\n'}Tap below to talk to a lawyer.
            </LabelM>
          </View>

          <View style={styles.lawyerButtonContainer}>
            <Button
              variant="primary"
              title="CONNECT WITH A LAWYER"
              onPress={() => {
                console.log('변호사 연결');
              }}
            />
          </View>
        </View>
      </ScrollView>

      <BottomNavBar activeTab="help" onTabPress={handleTabPress} />
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
  content: {
    paddingBottom: vs(20),
  },
  titleSection: {
    marginTop: vs(20),
    paddingHorizontal: s(20),
    marginBottom: vs(20),
  },
  titleText: {
    textAlign: 'center',
  },
  captionText: {
    textAlign: 'center',
  },
  descriptionBox: {
    marginHorizontal: s(20),
    backgroundColor: colors.secondary[50],
    borderRadius: s(12),
    paddingHorizontal: s(52),
    paddingVertical: vs(16),
    marginBottom: vs(24),
  },
  descriptionText: {
    ...typography.bodyM,
    color: colors.black,
    textAlign: 'center',
  },
  languageContainer: {
    height: vs(48),
    justifyContent: 'center',
    paddingHorizontal: s(32),
    marginBottom: vs(4),
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: s(10),
  },
  longDescriptionBox: {
    marginHorizontal: s(20),
    backgroundColor: colors.gray[50],
    borderRadius: s(12),
    padding: s(16),
    marginBottom: vs(8),
  },
  longDescriptionText: {
    ...typography.bodyS,
    color: colors.black,
    lineHeight: vs(20),
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: vs(44),
    marginHorizontal: s(12),
    gap: s(8),
  },
  arrowIcon: {
    transform: [{ rotate: '0deg' }],
  },
  arrowIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  characterSection: {
    alignItems: 'center',
    marginTop: vs(20),
    paddingHorizontal: s(20),
  },
  characterImage: {
    width: s(230),
    height: s(230),
    marginBottom: vs(16),
  },
  lawyerText: {
    textAlign: 'center',
    marginBottom: vs(16),
  },
  lawyerButtonContainer: {
    paddingHorizontal: s(20),
    marginBottom: vs(20),
  },
});
