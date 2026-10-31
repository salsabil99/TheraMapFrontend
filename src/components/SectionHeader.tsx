import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing, type } from '../theme/tokens';
import { ArrowRightIcon } from './icons';

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
          <ArrowRightIcon size={16} color={colors.petrol} strokeWidth={2} />
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
    backgroundColor: colors.tealSoft,
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.petrol,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    ...type.label,
    fontSize: 14,
    color: colors.petrol,
  },
});
