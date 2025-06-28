import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../index';
import SearchIcon from '@/assets/icons/Search.svg';
import CloseCircleIcon from '@/assets/icons/Close_Circle.svg';
import CloseMIcon from '@/assets/icons/Close_M.svg';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
  editable?: boolean;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "플레이스홀더",
  value = "",
  onChangeText,
  onClear,
  onCancel,
  showCancelButton = false,
  editable = true,
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState(autoFocus);

  const handleChangeText = (text: string) => {
    onChangeText?.(text);
  };

  const handleClear = () => {
    onChangeText?.("");
    onClear?.();
  };

  const handleCancel = () => {
    onChangeText?.("");
    setIsFocused(false);
    onCancel?.();
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.searchContainer, 
        isFocused && styles.focused
      ]}>
        <TextInput
          style={styles.textInput}
          placeholder={isFocused ? "" : placeholder}
          placeholderTextColor={colors.gray[400]}
          value={value}
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={editable}
          autoFocus={autoFocus}
        />
        
        {/* 우측 아이콘들 */}
        <View style={styles.rightIcons}>
          {value.length > 0 && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <CloseCircleIcon 
                width={20} 
                height={20} 
                color={colors.gray[300]}
              />
            </TouchableOpacity>
          )}
          
          <SearchIcon 
            width={20} 
            height={20} 
            color={colors.gray[900]} 
            style={styles.searchIcon}
          />
        </View>
      </View>
      
      {showCancelButton && (
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <CloseMIcon 
            width={20} 
            height={20} 
            color={colors.gray[300]}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  focused: {
    borderColor: colors.primary[300],
  },
  textInput: {
    flex: 1,
    ...typography.bodyM,
    color: colors.gray[900],
    padding: 0,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    marginRight: spacing.sm,
    padding: spacing.xs,
  },
  searchIcon: {
    // 기본 마진 없음, 가장 우측
  },
  cancelButton: {
    marginLeft: spacing.sm,
    padding: spacing.sm,
  },
}); 