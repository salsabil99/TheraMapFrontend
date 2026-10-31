import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OutlineButton, PrimaryButton } from '../components/Button';
import { ChevronLeftIcon } from '../components/icons';
import { PrivacyShield } from '../components/illustrations/PrivacyShield';
import { SessionBridge } from '../components/illustrations/SessionBridge';
import { ThoughtMap } from '../components/illustrations/ThoughtMap';
import { colors, fonts, radius, spacing, type } from '../theme/tokens';


// Pastel tone for each slide's tag pill.
const ACCENTS = {
  lavender: { background: colors.lavenderSoft, border: colors.lavender, text: colors.lavenderStrong },
  green: { background: colors.greenSoft, border: colors.paleGreen, text: colors.greenText },
  pink: { background: colors.pinkSoft, border: colors.pink, text: colors.pinkText },
} as const;

type Slide = {
  tag: string;
  accent: keyof typeof ACCENTS;
  title: string;
  // Body copy as segments so individual phrases can be italicised.
  body: { text: string; italic?: boolean }[];
  illustration: ReactNode;
};

const SLIDES: Slide[] = [
  {
    tag: 'Visual CBT',
    accent: 'lavender',
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
  {
    tag: 'Strict Privacy',
    accent: 'green',
    title: 'Private by default. Always.',
    body: [
      {
        text: 'Your vulnerability deserves absolute sanctity. Every record is stored with zero-knowledge encryption. No one—not even your therapist—can read your entries unless you explicitly choose to share them.',
      },
    ],
    illustration: <PrivacyShield />,
  },
  {
    tag: 'Collaborative Support',
    accent: 'pink',
    title: 'Bridge your sessions',
    body: [
      {
        text: 'Bring deeper clarity into your therapy appointments. Share high-level emotion patterns or specific thought logs with your clinician in a single tap to make sessions richer.',
      },
    ],
    illustration: <SessionBridge />,
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const accent = ACCENTS[slide.accent];

  const handleNext = () => {
    if (index < SLIDES.length - 1) setIndex(index + 1);
    // Getting started ends with the privacy consent.
    else router.push('/privacy-consent');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <ProgressDots total={SLIDES.length} current={index} />
        <Pressable onPress={() => router.push('/crisis')} hitSlop={10} accessibilityRole="link">
          <Text style={styles.skip}>Skip to Safety</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          {slide.illustration}
        </View>

        <View style={styles.text}>
          <View style={[styles.tag, { backgroundColor: accent.background, borderColor: accent.border }]}>
            <Text style={[styles.tagText, { color: accent.text }]}>{slide.tag}</Text>
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
        {index > 0 && (
          <View style={styles.back}>
            <OutlineButton
              title="Back"
              icon={<ChevronLeftIcon size={16} strokeWidth={2} />}
              onPress={() => setIndex(index - 1)}
            />
          </View>
        )}
        <View style={styles.next}>
          <PrimaryButton title="Next" onPress={handleNext} />
        </View>
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
  // Fixed height so the text below doesn't jump between slides.
  hero: {
    height: 200,
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
  },
  tagText: {
    ...type.caption,
    fontFamily: fonts.medium,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  back: {
    width: 104,
  },
  next: {
    flex: 1,
  },
});
