import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/Button';
import { EmotionWheel } from '../components/EmotionWheel';
import { CheckIcon, ChevronRightIcon, LockIcon } from '../components/icons';
import { IntensitySlider } from '../components/IntensitySlider';
import { ScreenHeader } from '../components/ScreenHeader';
import { comingSoon } from '../lib/comingSoon';
import { EMOTION_WHEEL, type EmotionChoice } from '../lib/emotionWheel';
import { colors, fonts, radius, spacing, type } from '../theme/tokens';

const DEFAULT_INTENSITY = 5;
const MAX_WHEEL = 380;

// Step 2 of "Write a thought": pick a feeling on the wheel (or list) and rate it.
export default function ChooseEmotionScreen() {
  const { width } = useWindowDimensions();
  const [view, setView] = useState<'wheel' | 'list'>('wheel');
  const [choice, setChoice] = useState<EmotionChoice | null>(null);
  const [intensity, setIntensity] = useState(DEFAULT_INTENSITY);

  const wheelSize = Math.min(width - spacing.xl * 2, MAX_WHEEL);

  const goNext = () => {
    // TODO: carry the choice into step 3 once it exists.
    comingSoon('Evidence');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <ScreenHeader
          title="Choose an emotion"
          action={{
            title: view === 'wheel' ? 'List view' : 'Wheel view',
            onPress: () => setView((v) => (v === 'wheel' ? 'list' : 'wheel')),
          }}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={styles.title} accessibilityRole="header">
            What are you feeling?
          </Text>
          <Text style={styles.subtitle}>
            {view === 'wheel' ? 'Tap a feeling to explore it.' : 'Pick the word that fits best.'}
          </Text>
        </View>

        {view === 'wheel' ? (
          <View style={styles.wheel}>
            <EmotionWheel size={wheelSize} value={choice} onChange={setChoice} />
          </View>
        ) : (
          <EmotionList value={choice} onChange={setChoice} />
        )}

        {choice && (
          <View style={styles.pill} accessibilityLabel={`Selected: ${choice.core}${choice.feeling ? `, ${choice.feeling}` : ''}`}>
            <Text style={styles.pillText}>{choice.core}</Text>
            {choice.feeling && (
              <>
                <ChevronRightIcon size={14} color={colors.textPrimary} strokeWidth={2.2} />
                <Text style={styles.pillText}>{choice.feeling}</Text>
              </>
            )}
            <View style={styles.pillCheck}>
              <CheckIcon size={11} color={colors.surface} strokeWidth={3} />
            </View>
          </View>
        )}

        <View style={styles.intensity}>
          <Text style={styles.intensityTitle}>How strong is this feeling?</Text>
          <Text style={styles.intensityValue}>{intensity} / 10</Text>
          <IntensitySlider
            value={intensity}
            onChange={setIntensity}
            accessibilityLabel="How strong is this feeling"
            variant="fill"
          />
          <View style={styles.scale}>
            <Text style={styles.scaleText}>1 · Mild</Text>
            <Text style={styles.scaleText}>10 · Very strong</Text>
          </View>
        </View>

        <Pressable onPress={goNext} hitSlop={8} accessibilityRole="button" style={styles.unsure}>
          <Text style={styles.unsureText}>I’m not sure</Text>
        </Pressable>

        <View style={styles.private}>
          <LockIcon size={14} color={colors.textSecondary} />
          <Text style={styles.privateText}>Private by default</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title="Use this emotion" onPress={goNext} disabled={!choice} showArrow={false} />
      </View>
    </SafeAreaView>
  );
}

function EmotionList({ value, onChange }: { value: EmotionChoice | null; onChange: (c: EmotionChoice) => void }) {
  return (
    <View style={styles.list}>
      {EMOTION_WHEEL.map((core) => (
        <View key={core.id} style={styles.group}>
          {[null, ...core.children].map((feeling) => {
            const selected = value?.core === core.id && value.feeling === feeling;
            const label = feeling ?? core.id;
            return (
              <Pressable
                key={label}
                onPress={() => onChange({ core: core.id, feeling })}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={feeling ? `${feeling}, a kind of ${core.id}` : core.id}
                style={({ pressed }) => [
                  styles.chip,
                  { backgroundColor: feeling ? core.softFill : core.fill },
                  selected && styles.chipSelected,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={[styles.chipText, !feeling && styles.chipCore]}>{label}</Text>
                {selected && <CheckIcon size={14} color={colors.petrol} strokeWidth={2.5} />}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },
  intro: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    ...type.title,
    fontSize: 26,
    lineHeight: 32,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  subtitle: {
    ...type.body,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  wheel: {
    alignItems: 'center',
  },
  pill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  pillText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  pillCheck: {
    width: 18,
    height: 18,
    marginLeft: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.petrol,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intensity: {
    gap: spacing.xs,
  },
  intensityTitle: {
    ...type.heading,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  intensityValue: {
    fontFamily: fonts.semibold,
    fontSize: 22,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleText: {
    ...type.caption,
    fontSize: 13,
    color: colors.textSecondary,
  },
  unsure: {
    alignSelf: 'center',
  },
  unsureText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
  private: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  privateText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  list: {
    gap: spacing.md,
  },
  group: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipSelected: {
    borderColor: colors.petrol,
  },
  chipText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  chipCore: {
    fontFamily: fonts.bold,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
});
