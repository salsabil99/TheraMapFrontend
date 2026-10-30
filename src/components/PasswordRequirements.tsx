import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, type } from '../theme/tokens';
import { CheckIcon } from './icons';

export const PASSWORD_RULES = [
  { label: 'At least 8 characters long', test: (p: string) => p.length >= 8 },
  { label: 'Contains at least 1 number', test: (p: string) => /\d/.test(p) },
  { label: 'Contains a symbol or special character (@, $, #, !)', test: (p: string) => /[^A-Za-z0-9\s]/.test(p) },
];

export function isStrongPassword(password: string) {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

// Live checklist: each rule turns green with a check as soon as it's met.
export function PasswordRequirements({ password }: { password: string }) {
  return (
    <View style={styles.card}>
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);
        return (
          <View key={rule.label} style={styles.row} accessibilityLabel={`${rule.label}${met ? ', met' : ''}`}>
            <View style={[styles.marker, met && styles.markerMet]}>
              {met && <CheckIcon size={10} color={colors.textOnPetrol} strokeWidth={3} />}
            </View>
            <Text style={[styles.text, met && styles.textMet]}>{rule.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  marker: {
    width: 16,
    height: 16,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerMet: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  text: {
    ...type.caption,
    flex: 1,
    color: colors.textSecondary,
  },
  textMet: {
    color: colors.success,
  },
});
