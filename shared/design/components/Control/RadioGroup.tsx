import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioButton } from './RadioButton';

type RadioButtonVariant = 'selected' | 'unselected' | 'disabled';

interface RadioGroupProps {
  options: RadioButtonVariant[];
  selectedIndex?: number;
  onSelectionChange?: (index: number) => void;
  disabled?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  selectedIndex = 0,
  onSelectionChange,
  disabled = false,
}) => {
  const [selected, setSelected] = useState(selectedIndex);

  const handlePress = (index: number) => {
    if (disabled || options[index] === 'disabled') return;
    
    setSelected(index);
    onSelectionChange?.(index);
  };

  return (
    <View style={styles.container}>
      {options.map((variant, index) => {
        const isSelected = selected === index && variant !== 'disabled';
        const isDisabled = disabled || variant === 'disabled';
        
        return (
          <RadioButton
            key={index}
            variant={variant === 'disabled' ? 'disabled' : (isSelected ? 'selected' : 'unselected')}
            selected={isSelected}
            onPress={() => handlePress(index)}
            disabled={isDisabled}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
  },
}); 