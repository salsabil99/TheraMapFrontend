import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing } from '../../theme/tokens';
import { LockIcon } from '../icons';

// Onboarding "Collaborative Support" hero: You ↔ Therapist, sharing selected entries only.
export function SessionBridge() {
  return (
    <View
      style={styles.wrapper}
      accessible
      accessibilityLabel="You and your therapist connected, sharing selected entries only"
    >
      <View style={styles.row}>
        <Person label="You" tone={colors.pink} />
        <View style={styles.link}>
          <View style={styles.line} />
          <View style={styles.node} />
          <View style={styles.line} />
        </View>
        <Person label="Therapist" tone={colors.lavender} />
      </View>

      <View style={styles.pill}>
        <Text style={styles.pillText}>Selected entries only</Text>
        <LockIcon size={13} color={colors.petrol} strokeWidth={2} />
      </View>
    </View>
  );
}

function Person({ label, tone }: { label: string; tone: string }) {
  return (
    <View style={styles.card}>
      <View style={[styles.avatar, { backgroundColor: tone }]} />
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    width: 100,
    height: 84,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.petrol,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
  },
  cardLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.textPrimary,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    width: 6,
    height: 2,
    backgroundColor: colors.petrol,
  },
  node: {
    width: 14,
    height: 14,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.petrol,
    backgroundColor: colors.surface,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.petrol,
    backgroundColor: colors.surface,
  },
  pillText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.textPrimary,
  },
});
