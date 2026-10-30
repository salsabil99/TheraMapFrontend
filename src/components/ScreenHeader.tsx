import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing, type } from '../theme/tokens';
import { ChevronLeftIcon } from './icons';

type Props = {
  onBack?: () => void;
  // Centre text; defaults to the wordmark.
  title?: string;
  // Shown as a pill on the right, e.g. "Step 1 of 2".
  badge?: string;
  badgeIcon?: ReactNode;
};

export function ScreenHeader({ onBack, title = 'theramap', badge, badgeIcon }: Props) {
  const handleBack = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/sign-in')));

  return (
    <View style={styles.row}>
      <Pressable
        onPress={handleBack}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={({ pressed }) => [styles.back, pressed && { backgroundColor: colors.surfaceMuted }]}
      >
        <ChevronLeftIcon size={18} strokeWidth={2} />
      </Pressable>

      <Text style={styles.brand} accessibilityRole="header" numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.side}>
        {!!badge && (
          <View style={styles.badge}>
            {badgeIcon}
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
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
  back: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Absolutely centred so it stays in the middle regardless of the badge width.
  brand: {
    position: 'absolute',
    left: 56,
    right: 56,
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 17,
    letterSpacing: -0.3,
    color: colors.textPrimary,
  },
  side: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  badgeText: {
    ...type.caption,
    color: colors.textSecondary,
  },
});
