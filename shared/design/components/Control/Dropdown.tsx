import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { LabelS, BodyM } from '../Typography';
import { colors, spacing } from '../../index';
import ArrowDownIcon from '@/assets/icons/Arrow_Down.svg';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder = "Select an option",
  value,
  options,
  onSelect,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && (
        <LabelS style={styles.label}>
          {label}
        </LabelS>
      )}
      
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          disabled && styles.disabled
        ]}
        onPress={() => !disabled && setIsVisible(true)}
        disabled={disabled}
      >
        <BodyM style={[
          styles.buttonText,
          !selectedOption && styles.placeholderText,
          disabled && { color: colors.gray[400] }
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </BodyM>
        
        <ArrowDownIcon 
          width={20} 
          height={20} 
          color={disabled ? colors.gray[300] : colors.gray[400]}
        />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item.value === value && styles.selectedOption
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <BodyM style={[
                    styles.optionText,
                    item.value === value && styles.selectedOptionText
                  ]}>
                    {item.label}
                  </BodyM>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 79,
    marginBottom: 24,
  },
  label: {
    marginBottom: spacing.xs,
    height: 20,
    color: colors.gray[900],
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    height: 51,
  },
  disabled: {
    backgroundColor: colors.gray[50],
  },
  buttonText: {
    flex: 1,
    color: colors.gray[900],
  },
  placeholderText: {
    color: colors.gray[400],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    maxHeight: 300,
    width: '80%',
    maxWidth: 300,
  },
  optionItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  selectedOption: {
    backgroundColor: colors.primary[50],
  },
  optionText: {
    color: colors.gray[900],
  },
  selectedOptionText: {
    color: colors.primary[500],
  },
}); 