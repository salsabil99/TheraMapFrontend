import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing } from '../theme/tokens';
import { CheckIcon } from './icons';

type Props = {
  label: string;
  icon?: ReactNode;
  selected?: boolean;
  onPress?: () => void;
};

// White pill used for emotions and tags. Selected chips swap the icon for a check
// and take a petrol outline, so the state doesn't rely on colour alone.
export function Chip({ label, icon, selected, onPress }: Props) {
  const content = (
    <>
      {selected ? <CheckIcon size={14} color={colors.petrol} strokeWidth={2.5} /> : icon}
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </>
  );

  if (!onPress) return <View style={styles.chip}>{content}</View>;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: colors.surface,
  },
  chipSelected: {
    borderColor: colors.petrol,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textPrimary,
  },
  labelSelected: {
    fontFamily: fonts.semibold,
  },
});
