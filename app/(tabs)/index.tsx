import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  HeadingM, 
  BodyM, 
  Checkbox, 
  RadioGroup, 
  Button 
} from '../../shared/design/components';
import { colors, spacing } from '../../shared/design';

export default function HomeScreen() {
  const [checkboxStates, setCheckboxStates] = useState([false, true]);
  const [pillButtons, setPillButtons] = useState([true, false]);
  const [radioSelected, setRadioSelected] = useState(0);

  const handleCheckboxChange = (index: number, checked: boolean) => {
    const newStates = [...checkboxStates];
    newStates[index] = checked;
    setCheckboxStates(newStates);
  };

  const handlePillButtonPress = (index: number) => {
    const newStates = [...pillButtons];
    newStates[index] = !newStates[index];
    setPillButtons(newStates);
  };

  const handleRadioChange = (index: number) => {
    setRadioSelected(index);
    console.log('Radio selected:', index);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <HeadingM style={styles.title}>Control</HeadingM>
      
      {/* 체크박스 섹션 */}
      <View style={styles.controlSection}>
        <View style={styles.checkboxContainer}>
          <Checkbox 
            checked={checkboxStates[0]} 
            onPress={(checked) => handleCheckboxChange(0, checked)}
          />
          <Checkbox 
            checked={checkboxStates[1]} 
            onPress={(checked) => handleCheckboxChange(1, checked)}
          />
        </View>
      </View>

      {/* 라디오 버튼 섹션 */}
      <View style={styles.controlSection}>
        <RadioGroup
          options={['unselected', 'unselected', 'disabled']}
          selectedIndex={radioSelected}
          onSelectionChange={handleRadioChange}
        />
      </View>

      {/* 버튼 섹션 */}
      <View style={styles.controlSection}>
        <View style={styles.pillContainer}>
          <Button
            title="대표"
            variant="primary"
            selected={pillButtons[0]}
            onPress={() => handlePillButtonPress(0)}
          />
          <Button
            title="대표"
            variant="secondary"
            selected={pillButtons[1]}
            onPress={() => handlePillButtonPress(1)}
          />
        </View>
      </View>

      <BodyM style={styles.subtitle} color={colors.gray[600]}>
        디자이너 시안에 따라 UI가 구현될 예정입니다
      </BodyM>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  title: {
    marginBottom: spacing.xl,
    textAlign: 'center',
    color: colors.gray[900],
  },
  controlSection: {
    borderWidth: 2,
    borderColor: colors.primary[400],
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.white,
  },
  checkboxContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
  },
  pillContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: spacing.xl,
  },
}); 