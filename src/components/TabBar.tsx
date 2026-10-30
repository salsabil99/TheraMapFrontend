import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TabTriggerSlotProps } from 'expo-router/ui';

import { colors, fonts, radius, shadow, spacing } from '../theme/tokens';

// `ref` is omitted: expo-router's slot ref type doesn't match RN 0.88's View instance type.
type TabButtonProps = Omit<TabTriggerSlotProps, 'ref'> & {
  label: string;
  icon: (color: string) => ReactNode;
};

// Bottom navigation item: the selected destination sits in a petrol circle.
// Used as the asChild of an expo-router/ui TabTrigger, which supplies isFocused/onPress.
export function TabButton({ label, icon, isFocused, ...props }: TabButtonProps) {
  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
      style={styles.item}
    >
      <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
        {icon(isFocused ? colors.textOnPetrol : colors.textSecondary)}
      </View>
      <Text style={[styles.label, isFocused && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

export const tabBarStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
});

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.petrol,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.textSecondary,
  },
  labelActive: {
    fontFamily: fonts.semibold,
    color: colors.textPrimary,
  },
});
