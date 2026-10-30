import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadow, spacing, type } from '../theme/tokens';
import { ArrowRightIcon } from './icons';

type PrimaryProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  showArrow?: boolean;
};

export function PrimaryButton({ title, onPress, loading, disabled, showArrow = true }: PrimaryProps) {
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.primary,
        pressed && { backgroundColor: colors.petrolPressed },
        disabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textOnPetrol} />
      ) : (
        <View style={styles.row}>
          <Text style={styles.primaryText}>{title}</Text>
          {showArrow && <ArrowRightIcon size={18} color={colors.textOnPetrol} strokeWidth={2} />}
        </View>
      )}
    </Pressable>
  );
}

type SecondaryProps = {
  title: string;
  icon?: ReactNode;
  onPress: () => void;
};

export function SecondaryButton({ title, icon, onPress }: SecondaryProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.secondary, pressed && { backgroundColor: colors.surfaceMuted }]}
    >
      <View style={styles.row}>
        {icon}
        <Text style={styles.secondaryText}>{title}</Text>
      </View>
    </Pressable>
  );
}

// Low-emphasis pill with an outline, for secondary actions like "Resend".
export function OutlineButton({ title, icon, onPress, disabled }: SecondaryProps & { disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [styles.outline, pressed && { backgroundColor: colors.surface }, disabled && styles.disabled]}
    >
      <View style={styles.row}>
        {icon}
        <Text style={styles.secondaryText}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primary: {
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.petrol,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  primaryText: {
    ...type.button,
    color: colors.textOnPetrol,
  },
  disabled: {
    opacity: 0.5,
  },
  secondary: {
    flex: 1,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    height: 52,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    ...type.button,
    fontSize: 14,
    color: colors.textPrimary,
  },
});
