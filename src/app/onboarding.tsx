import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { PrimaryButton } from '../components/Button';
import { ThoughtMap } from '../components/illustrations/ThoughtMap';
import { comingSoon } from '../lib/comingSoon';
import { colors, fonts, radius, spacing, type } from '../theme/tokens';

// Total onboarding steps in the flow. Only the slides defined below are built so far.
const TOTAL_STEPS = 4;

type Slide = {
  tag: string;
  title: string;
  // Body copy as segments so individual phrases can be italicised.
  body: { text: string; italic?: boolean }[];
  illustration: ReactNode;
};

const SLIDES: Slide[] = [
  {
    tag: 'Visual CBT',
    title: 'Map your mind visually',
    body: [
      { text: 'Cognitive behavioral therapy made tangible. Unravel complex feelings by seeing how thoughts like ' },
      { text: 'self-doubt', italic: true },
      { text: ' and ' },
      { text: 'catastrophizing', italic: true },
      { text: ' connect directly to your daily emotions.' },
    ],
    illustration: <ThoughtMap />,
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  const handleNext = () => {
    if (index < SLIDES.length - 1) setIndex(index + 1);
    else comingSoon(`Onboarding step ${index + 2}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <ProgressDots total={TOTAL_STEPS} current={index} />
        <Pressable onPress={() => comingSoon('Safety')} hitSlop={10} accessibilityRole="link">
          <Text style={styles.skip}>Skip to Safety</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
            <Defs>
              <LinearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.surface} />
                <Stop offset="1" stopColor={colors.lavenderSoft} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#heroFill)" />
          </Svg>
          {slide.illustration}
        </View>

        <View style={styles.text}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{slide.tag}</Text>
          </View>
          <Text style={styles.title} accessibilityRole="header">
            {slide.title}
          </Text>
          <Text style={styles.body}>
            {slide.body.map((seg, i) => (
              <Text key={i} style={seg.italic && styles.italic}>
                {seg.text}
              </Text>
            ))}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title={index === TOTAL_STEPS - 1 ? 'Get started' : 'Next'} onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <View
      style={styles.dots}
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${current + 1} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.borderStrong,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.petrol,
  },
  skip: {
    ...type.label,
    fontSize: 14,
    color: colors.textSecondary,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.xxl,
  },
  hero: {
    height: 240,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lavender,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lavender,
    backgroundColor: colors.lavenderSoft,
  },
  tagText: {
    ...type.caption,
    fontFamily: fonts.medium,
    color: colors.lavenderStrong,
  },
  title: {
    ...type.title,
    fontSize: 24,
    lineHeight: 30,
    color: colors.textPrimary,
  },
  body: {
    ...type.body,
    color: colors.textSecondary,
  },
  italic: {
    fontFamily: fonts.italic,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
});
