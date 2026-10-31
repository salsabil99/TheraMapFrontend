import { useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { TabTriggerSlotProps } from 'expo-router/ui';

import { colors, fonts, radius, shadow, spacing } from '../theme/tokens';

// `ref` is omitted: expo-router's slot ref type doesn't match RN 0.88's View instance type.
type TabButtonProps = Omit<TabTriggerSlotProps, 'ref'> & {
  label: string;
  icon: (color: string) => ReactNode;
  // Small dot for something new, e.g. pending tasks.
  badge?: boolean;
};

const CIRCLE = 46;

// Floating navigation item: icon with a visible label. The selected destination
// grows into a petrol circle with an underline. Used as the asChild of an
// expo-router/ui TabTrigger, which supplies isFocused/onPress.
export function TabButton({ label, icon, badge, isFocused, ...props }: TabButtonProps) {
  const [progress] = useState(() => new Animated.Value(isFocused ? 1 : 0));
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
  }, []);

  useEffect(() => {
    const toValue = isFocused ? 1 : 0;
    if (reduceMotion) {
      progress.setValue(toValue);
      return;
    }
    Animated.spring(progress, { toValue, friction: 7, tension: 90, useNativeDriver: true }).start();
  }, [isFocused, reduceMotion, progress]);

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={badge ? `${label}, new items` : label}
      style={styles.item}
    >
      <View style={styles.iconArea}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.circle,
            {
              opacity: progress,
              transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
            },
          ]}
        />
        <View>
          {icon(isFocused ? colors.textOnPetrol : colors.textPrimary)}
          {badge && <View style={[styles.badge, isFocused && styles.badgeOnActive]} />}
        </View>
      </View>
      <Text style={[styles.label, isFocused && styles.labelActive]}>{label}</Text>
      <Animated.View style={[styles.indicator, { opacity: progress }]} pointerEvents="none" />
    </Pressable>
  );
}

export const tabBarStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    borderRadius: 28,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
});

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  iconArea: {
    width: CIRCLE,
    height: CIRCLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: radius.pill,
    backgroundColor: colors.petrol,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -4,
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.surface,
    backgroundColor: colors.petrol,
  },
  badgeOnActive: {
    borderColor: colors.petrol,
    backgroundColor: colors.surface,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  labelActive: {
    fontFamily: fonts.semibold,
    color: colors.textPrimary,
  },
  indicator: {
    width: 36,
    height: 3,
    marginTop: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.petrol,
  },
});
