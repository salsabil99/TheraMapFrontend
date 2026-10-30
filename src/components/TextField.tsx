import { forwardRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native';

import { colors, fonts, radius, spacing, type } from '../theme/tokens';
import { EyeIcon, EyeOffIcon } from './icons';

type Props = TextInputProps & {
  label: string;
  icon?: (color: string) => ReactNode;
  labelAction?: { title: string; onPress: () => void };
  error?: string;
  secure?: boolean;
};

export const TextField = forwardRef<TextInputInstance, Props>(function TextField(
  { label, icon, labelAction, error, secure, style, onFocus, onBlur, ...inputProps },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const iconColor = focused ? colors.petrol : colors.textMuted;

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {labelAction && (
          <Pressable onPress={labelAction.onPress} hitSlop={8} accessibilityRole="link">
            <Text style={styles.labelAction}>{labelAction.title}</Text>
          </Pressable>
        )}
      </View>

      <View style={[styles.field, focused && styles.fieldFocused, !!error && styles.fieldError]}>
        {icon?.(iconColor)}
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secure && hidden}
          accessibilityLabel={label}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...inputProps}
        />
        {secure && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
          >
            {hidden ? <EyeIcon color={colors.textSecondary} /> : <EyeOffIcon color={colors.textSecondary} />}
          </Pressable>
        )}
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...type.label,
    color: colors.textPrimary,
  },
  labelAction: {
    ...type.label,
    color: colors.textPrimary,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 48,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldFocused: {
    borderColor: colors.petrol,
  },
  fieldError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textPrimary,
  },
  error: {
    ...type.caption,
    color: colors.danger,
  },
});
