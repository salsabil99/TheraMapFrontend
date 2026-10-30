import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing, type } from '../theme/tokens';
import { LockIcon, LogoIcon } from './icons';

// Wordmark on the left, "Your private map" reassurance on the right.
export function BrandBar() {
  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <LogoIcon size={20} />
        <Text style={styles.brandText}>theramap</Text>
      </View>
      <View style={styles.pill}>
        <LockIcon size={12} color={colors.textSecondary} />
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
    fontSize: 18,
    letterSpacing: -0.3,
    color: colors.textPrimary,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  pillText: {
    ...type.caption,
    color: colors.textSecondary,
  },
});
