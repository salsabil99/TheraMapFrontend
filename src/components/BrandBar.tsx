import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing } from '../theme/tokens';
import { LockIcon, LogoIcon } from './icons';

// Wordmark on the left, "Your private map" reassurance on the right.
export function BrandBar() {
  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <LogoIcon size={20} color={colors.petrol} />
        <Text style={styles.brandText}>theramap</Text>
      </View>
      <View style={styles.pill}>
        <LockIcon size={12} color={colors.teal} strokeWidth={2} />
        <Text style={styles.pillText}>Your private map</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandText: {
    fontFamily: fonts.bold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.4,
    color: colors.textPrimary,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 30,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  pillText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
});
