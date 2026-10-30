import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, type } from '../theme/tokens';
import { ChevronRightIcon } from './icons';

type Props = {
  title: string;
  subtitle: string;
  tone: string; // pastel fill
  glyph: ReactNode;
  open: boolean;
  onToggle: () => void;
  children?: ReactNode; // shown only when open
};

// "Today" card recipe: the title and summary stay in place; the disclosure
// reveals content and a clear next step below them.
export function ExpandableCard({ title, subtitle, tone, glyph, open, onToggle, children }: Props) {
  return (
    <View style={[styles.card, { backgroundColor: tone }]}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityHint={open ? 'Collapses this card' : 'Expands this card'}
        style={styles.header}
      >
        <View style={styles.text}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.glyph}>{glyph}</View>
        <View style={styles.toggle}>
          <View style={{ transform: [{ rotate: open ? '-90deg' : '0deg' }] }}>
            <ChevronRightIcon size={16} strokeWidth={2} />
          </View>
        </View>
      </Pressable>

      {open && <View style={styles.body}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...type.button,
    fontSize: 16,
    color: colors.textPrimary,
  },
  subtitle: {
    ...type.caption,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  glyph: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggle: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
});
