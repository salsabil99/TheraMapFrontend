import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, type } from '../theme/tokens';
import { CheckIcon } from './icons';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  error?: boolean;
};

// Checkbox with a rich-text label. Nest <Text style={checkboxStyles.strong}> for emphasis.
export function Checkbox({ checked, onChange, children, error }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={styles.row}
    >
      <View style={[styles.box, checked && styles.boxChecked, error && !checked && styles.boxError]}>
        {checked && <CheckIcon size={14} color={colors.textOnPetrol} strokeWidth={2.5} />}
      </View>
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  box: {
    width: 22,
    height: 22,
    marginTop: 1,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: colors.petrol,
    borderColor: colors.petrol,
  },
  boxError: {
    borderColor: colors.danger,
  },
  label: {
    ...type.body,
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
  },
});

export const checkboxStyles = StyleSheet.create({
  strong: {
    ...type.label,
    color: colors.textPrimary,
  },
});
