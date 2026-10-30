import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing, type } from '../theme/tokens';
import { ChevronLeftIcon } from './icons';

type Props = {
  onBack?: () => void;
  // Shown as a pill on the right, e.g. "Step 1 of 2".
  badge?: string;
};

export function ScreenHeader({ onBack, badge }: Props) {
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

      <Text style={styles.brand}>theramap</Text>

      <View style={styles.side}>{!!badge && <Text style={styles.badge}>{badge}</Text>}</View>
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
  brand: {
    fontFamily: fonts.bold,
    fontSize: 17,
    letterSpacing: -0.3,
    color: colors.textPrimary,
  },
  // Fixed width keeps the brand centred whether or not a badge is shown.
  side: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  badge: {
    ...type.caption,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
});
