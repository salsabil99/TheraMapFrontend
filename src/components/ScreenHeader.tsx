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
  // Text action on the right, e.g. "Save draft". Takes the badge's place.
  action?: { title: string; onPress: () => void };
};

export function ScreenHeader({ onBack, title = 'theramap', badge, badgeIcon, action }: Props) {
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
        {action ? (
          <Pressable onPress={action.onPress} hitSlop={8} accessibilityRole="button">
            {({ pressed }) => <Text style={[styles.action, pressed && { opacity: 0.6 }]}>{action.title}</Text>}
          </Pressable>
        ) : !!badge && (
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
  // Takes the space between the back button and badge, so a wide badge never overlaps it.
  brand: {
    flex: 1,
    marginHorizontal: spacing.sm,
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
  action: {
    ...type.label,
    fontSize: 14,
    color: colors.petrol,
  },
  badgeText: {
    ...type.caption,
    color: colors.textSecondary,
  },
});
