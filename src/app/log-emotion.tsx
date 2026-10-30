import { router, useLocalSearchParams } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/Button';
import {
  BoltIcon,
  CheckIcon,
  CloudIcon,
  FlameIcon,
  LockIcon,
  SparkleIcon,
  SproutIcon,
  SunIcon,
  WaveIcon,
} from '../components/icons';
import { IntensitySlider } from '../components/IntensitySlider';
import { ScreenHeader } from '../components/ScreenHeader';
import { emotionColor, emotionTint, intensityBand } from '../lib/emotions';
import { colors, fonts, radius, spacing, type } from '../theme/tokens';

type Emotion = {
  id: string;
  label: string;
  hint: string;
  icon: (color: string) => ReactNode;
};

// `id` doubles as the key into the shared emotion colours.
const EMOTIONS: Emotion[] = [
  { id: 'Anxious', label: 'Anxious', hint: 'Worried, restless', icon: (c) => <BoltIcon size={18} color={c} strokeWidth={2} /> },
  { id: 'Sad', label: 'Sad', hint: 'Low, heavy', icon: (c) => <CloudIcon size={18} color={c} strokeWidth={2} /> },
  { id: 'Angry', label: 'Angry', hint: 'Frustrated, tense', icon: (c) => <FlameIcon size={18} color={c} strokeWidth={2} /> },
  { id: 'Overwhelmed', label: 'Overwhelmed', hint: 'Too much input', icon: (c) => <WaveIcon size={18} color={c} strokeWidth={2} /> },
  { id: 'Neutral', label: 'Neutral', hint: 'Just observing', icon: (c) => <SproutIcon size={18} color={c} strokeWidth={2} /> },
  { id: 'Hopeful', label: 'Hopeful', hint: 'Open, curious', icon: (c) => <SparkleIcon size={18} color={c} strokeWidth={2} /> },
  { id: 'Content', label: 'Content / Peaceful', hint: 'Grounded, steady', icon: (c) => <SunIcon size={18} color={c} strokeWidth={2} /> },
];

const DEFAULT_INTENSITY = 5;

export default function LogEmotionScreen() {
  // Pre-selected when opened from a Today chip.
  const params = useLocalSearchParams<{ emotion?: string }>();
  const initial = EMOTIONS.some((e) => e.id === params.emotion) ? params.emotion! : null;

  const [emotion, setEmotion] = useState<string | null>(initial);
  const [intensity, setIntensity] = useState(DEFAULT_INTENSITY);
  const band = intensityBand(intensity);

  const handleSave = () => {
    // TODO: persist the check-in once the API exists.
    Alert.alert('Check-in saved', 'Kept private in your journal.');
    if (router.canGoBack()) router.back();
    else router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <ScreenHeader
          title="Emotion Logger"
          badge="Private entry"
          badgeIcon={<LockIcon size={12} color={colors.textSecondary} />}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <View style={styles.tag}>
            <BoltIcon size={12} color={colors.coral} strokeWidth={2.2} />
            <Text style={styles.tagText}>Rapid check-in · under 30 sec</Text>
          </View>
          <Text style={styles.title} accessibilityRole="header">
            How are you feeling right now?
          </Text>
          <Text style={styles.subtitle}>
            Tune into your body and name what is present. There are no right or wrong answers.
          </Text>
        </View>

        {/* 1. Primary emotion */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>1. Primary emotion</Text>
          <View style={styles.grid} accessibilityRole="radiogroup">
            {EMOTIONS.map((e, i) => (
              <EmotionOption
                key={e.id}
                emotion={e}
                selected={emotion === e.id}
                fullWidth={i === EMOTIONS.length - 1 && EMOTIONS.length % 2 === 1}
                onPress={() => setEmotion(e.id)}
              />
            ))}
          </View>
        </View>

        {/* 2. Intensity */}
        <View style={styles.card}>
          <View style={styles.intensityHeader}>
            <Text style={styles.sectionLabel}>2. Intensity level</Text>
            <View style={styles.valueWrap}>
              <Text style={styles.value}>{intensity}</Text>
              <Text style={styles.valueMax}>/10</Text>
            </View>
          </View>
          <View style={[styles.band, { backgroundColor: band.tint }]}>
            <Text style={[styles.bandText, { color: band.color }]}>{band.label}</Text>
          </View>
          <IntensitySlider value={intensity} onChange={setIntensity} accessibilityLabel="Intensity level" />
          <View style={styles.scale}>
            <Text style={styles.scaleText}>1: Mild</Text>
            <Text style={styles.scaleText}>5: Moderate</Text>
            <Text style={styles.scaleText}>10: Overwhelming</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {!emotion && <Text style={styles.footerHint}>Choose an emotion to save your check-in.</Text>}
        <PrimaryButton title="Save check-in" onPress={handleSave} disabled={!emotion} />
      </View>
    </SafeAreaView>
  );
}

function EmotionOption({
  emotion,
  selected,
  fullWidth,
  onPress,
}: {
  emotion: Emotion;
  selected: boolean;
  fullWidth: boolean;
  onPress: () => void;
}) {
  const accent = emotionColor(emotion.id);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${emotion.label}: ${emotion.hint}`}
      style={({ pressed }) => [
        styles.option,
        fullWidth && styles.optionFull,
        selected && { backgroundColor: emotionTint(emotion.id), borderColor: accent },
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={styles.optionIcon}>{emotion.icon(accent)}</View>
      <View style={styles.optionText}>
        <Text style={styles.optionLabel} numberOfLines={1}>
          {emotion.label}
        </Text>
        <Text style={styles.optionHint}>{emotion.hint}</Text>
      </View>
      {selected && <CheckIcon size={16} color={colors.petrol} strokeWidth={2.5} />}
    </Pressable>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.xxl,
  },
  intro: {
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  tagText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textPrimary,
  },
  title: {
    ...type.title,
    fontSize: 26,
    lineHeight: 32,
    color: colors.textPrimary,
  },
  subtitle: {
    ...type.body,
    color: colors.textSecondary,
  },

  section: {
    gap: spacing.md,
  },
  sectionLabel: {
    ...type.label,
    fontSize: 14,
    color: colors.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    flexBasis: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionFull: {
    flexBasis: '100%',
  },
  optionIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    ...type.label,
    fontSize: 14,
    color: colors.textPrimary,
  },
  optionHint: {
    ...type.caption,
    fontSize: 11,
    color: colors.textSecondary,
  },

  card: {
    padding: spacing.lg,
    gap: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  intensityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valueWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.textPrimary,
  },
  valueMax: {
    ...type.caption,
    color: colors.textSecondary,
  },
  band: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  bandText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleText: {
    ...type.caption,
    fontSize: 11,
    color: colors.textSecondary,
  },

  footer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  footerHint: {
    ...type.caption,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});
