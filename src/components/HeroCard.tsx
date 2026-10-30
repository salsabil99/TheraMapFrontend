import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadow, spacing, type } from '../theme/tokens';
import { MindIcon } from './icons';

type Props = {
  overline?: string;
  title: string;
  description?: string;
  illustration?: ReactNode;
};

// Petrol hero used at the top of entry screens.
export function HeroCard({ overline, title, description, illustration = <MindIcon /> }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.text}>
        {!!overline && <Text style={styles.overline}>{overline.toUpperCase()}</Text>}
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        {!!description && <Text style={styles.description}>{description}</Text>}
      </View>
      <View style={styles.illustration}>{illustration}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.petrol,
    ...shadow.card,
  },
  text: {
    flex: 1,
    gap: spacing.xs,
  },
  overline: {
    ...type.overline,
    color: colors.textOnPetrolMuted,
  },
  title: {
    ...type.heading,
    color: colors.textOnPetrol,
  },
  description: {
    ...type.caption,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textOnPetrolMuted,
  },
  illustration: {
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: colors.petrolSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
