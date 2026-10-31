import { useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, View } from 'react-native';
import type { TabTriggerSlotProps } from 'expo-router/ui';

import { colors, radius, shadow, spacing } from '../theme/tokens';

// `ref` is omitted: expo-router's slot ref type doesn't match RN 0.88's View instance type.
type TabButtonProps = Omit<TabTriggerSlotProps, 'ref'> & {
  label: string;
  icon: (color: string) => ReactNode;
  // Small dot for something new, e.g. pending tasks.
  badge?: boolean;
};

const BAR_HEIGHT = 76;
const CIRCLE = 52;
const HALO = 62;

// "Organic" navigation item: icon only; the selected destination grows into a
// raised petrol circle with a soft halo. The label stays for screen readers.
// Used as the asChild of an expo-router/ui TabTrigger, which supplies isFocused/onPress.
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

  const grow = (from: number) => ({
    opacity: progress,
    transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [from, 1] }) }],
  });

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={badge ? `${label}, new items` : label}
      style={styles.item}
    >
      <Animated.View style={[styles.halo, grow(0.6)]} pointerEvents="none" />
      <Animated.View style={[styles.circle, grow(0.5)]} pointerEvents="none" />
      <View>
        {icon(isFocused ? colors.textOnPetrol : colors.textPrimary)}
        {badge && <View style={[styles.badge, isFocused && styles.badgeOnActive]} />}
      </View>
      <Animated.View style={[styles.indicator, { opacity: progress }]} pointerEvents="none" />
    </Pressable>
  );
}

export const tabBarStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: BAR_HEIGHT,
    marginHorizontal: spacing.xl,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
});

const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: HALO,
    height: HALO,
    borderRadius: radius.pill,
    backgroundColor: colors.petrolHalo,
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
    backgroundColor: colors.pinkStrong,
  },
  badgeOnActive: {
    borderColor: colors.petrol,
  },
  indicator: {
    position: 'absolute',
    bottom: 3,
    width: 18,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.borderStrong,
  },
});
