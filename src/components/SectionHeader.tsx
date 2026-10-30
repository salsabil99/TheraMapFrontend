import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing, type } from '../theme/tokens';
import { ChevronRightIcon } from './icons';

type Props = {
  title: string;
  badge?: string;
  action?: { title: string; onPress: () => void };
};

export function SectionHeader({ title, badge, action }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        {!!badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      {action && (
        <Pressable onPress={action.onPress} hitSlop={8} accessibilityRole="link" style={styles.action}>
          <Text style={styles.actionText}>{action.title}</Text>
          <ChevronRightIcon size={14} color={colors.textSecondary} strokeWidth={2} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...type.heading,
    fontSize: 18,
    color: colors.textPrimary,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.lavender,
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.lavenderStrong,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionText: {
    ...type.label,
    color: colors.textSecondary,
  },
});
