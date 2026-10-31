import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '../../../components/Button';
import { Chip } from '../../../components/Chip';
import { CheckIcon } from '../../../components/icons';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { partOfDay } from '../../../lib/time';
import { useTasks } from '../../../state/TasksContext';
import { colors, fonts, radius, spacing, type } from '../../../theme/tokens';

const FEELINGS = ['Much calmer', 'A bit calmer', 'About the same', 'More tense'];
const CALMER = new Set(['Much calmer', 'A bit calmer']);
const SEGMENTS = 10;

export default function CompleteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTask, saveCheckIn } = useTasks();
  const task = getTask(id);

  const [feeling, setFeeling] = useState<string | null>(task?.checkIn?.feeling ?? null);
  const [intensity, setIntensity] = useState(task?.checkIn?.intensity ?? task?.baseline?.intensity ?? 5);

  if (!task) return <Redirect href="/tasks" />;

  const save = (nextFeeling: string | null, nextIntensity: number) => {
    if (nextFeeling) saveCheckIn(task.id, { feeling: nextFeeling, intensity: nextIntensity });
  };
  const chooseFeeling = (f: string) => {
    setFeeling(f);
    save(f, intensity);
  };
  const chooseIntensity = (n: number) => {
    setIntensity(n);
    save(feeling, n);
  };

  const part = partOfDay();
  const title = feeling && CALMER.has(feeling) ? `A calmer ${part}` : `${part[0].toUpperCase()}${part.slice(1)} check-in`;
  const baseline = task.baseline;
  const delta = baseline ? intensity - baseline.intensity : 0;
  const trend = delta < 0 ? 'More calm' : delta > 0 ? 'More intense' : 'No change';
  const label = baseline?.emotion ?? 'Intensity';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <ScreenHeader title="Check-in" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          <Text style={styles.subtitle}>
            {task.title} · {task.minutes} minutes completed
          </Text>
        </View>

        <View style={styles.doneCard}>
          <View style={styles.doneRow}>
            <CheckIcon size={22} color={colors.greenText} strokeWidth={2.5} />
            <Text style={styles.doneTitle}>Task completed</Text>
          </View>
          <Text style={styles.doneMeta}>Assigned exercise finished · {task.completedAt}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.question}>How do you feel after the exercise?</Text>
          <View style={styles.chips} accessibilityRole="radiogroup">
            {FEELINGS.map((f) => (
              <Chip key={f} label={f} selected={feeling === f} onPress={() => chooseFeeling(f)} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.intensityHeader}>
            <Text style={styles.question}>{label} intensity</Text>
            <Text style={styles.value}>{intensity}/10</Text>
          </View>
          <View
            style={styles.segments}
            accessible
            accessibilityRole="adjustable"
            accessibilityLabel={`${label} intensity`}
            accessibilityValue={{ min: 0, max: 10, now: intensity }}
            accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
            onAccessibilityAction={(e) => {
              if (e.nativeEvent.actionName === 'increment') chooseIntensity(Math.min(intensity + 1, SEGMENTS));
              if (e.nativeEvent.actionName === 'decrement') chooseIntensity(Math.max(intensity - 1, 0));
            }}
          >
            {Array.from({ length: SEGMENTS }, (_, i) => (
              <Pressable
                key={i}
                onPress={() => chooseIntensity(intensity === i + 1 ? i : i + 1)}
                hitSlop={{ top: 12, bottom: 12 }}
                style={[styles.segment, i < intensity && styles.segmentOn]}
              />
            ))}
          </View>
          <View style={styles.scale}>
            <Text style={styles.scaleText}>Low · 0</Text>
            <Text style={styles.scaleText}>High · 10</Text>
          </View>
          {baseline && (
            <Text style={styles.compare}>
              {baseline.intensity}/10 {baseline.when} → {intensity}/10 now · {trend}
            </Text>
          )}
        </View>

        <Text style={styles.saved} accessibilityLiveRegion="polite">
          {task.checkIn
            ? `Post-exercise check-in saved at ${task.checkIn.savedAt}.`
            : 'Choose how you feel to save your check-in.'}
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title="Done for today" showArrow={false} onPress={() => router.dismissTo('/tasks')} />
      </View>
    </SafeAreaView>
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
    gap: spacing.xl,
  },
  intro: {
    gap: spacing.xs,
  },
  title: {
    ...type.title,
    fontSize: 28,
    lineHeight: 34,
    color: colors.textPrimary,
  },
  subtitle: {
    ...type.label,
    fontSize: 14,
    color: colors.greenText,
  },
  doneCard: {
    gap: spacing.sm,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.paleGreen,
  },
  doneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  doneTitle: {
    ...type.heading,
    color: colors.textPrimary,
  },
  doneMeta: {
    ...type.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  section: {
    gap: spacing.md,
  },
  question: {
    ...type.button,
    color: colors.textPrimary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  intensityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.greenText,
  },
  segments: {
    flexDirection: 'row',
    gap: 6,
  },
  segment: {
    flex: 1,
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  segmentOn: {
    backgroundColor: colors.petrol,
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleText: {
    ...type.caption,
    color: colors.textSecondary,
  },
  compare: {
    ...type.label,
    color: colors.greenText,
  },
  saved: {
    ...type.caption,
    fontSize: 13,
    color: colors.textSecondary,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
});
