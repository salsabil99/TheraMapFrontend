import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OutlineButton, PrimaryButton } from '../../../components/Button';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useTasks } from '../../../state/TasksContext';
import { colors, fonts, radius, spacing, type } from '../../../theme/tokens';

// Box breathing: four phases of four seconds each.
const PHASE_SECONDS = 4;
const PHASES = [
  { label: 'Breathe in', scale: 1 },
  { label: 'Hold', scale: 1 },
  { label: 'Breathe out', scale: 0.6 },
  { label: 'Hold', scale: 0.6 },
];

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function SessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTask, completeTask } = useTasks();
  const task = getTask(id);
  const total = (task?.minutes ?? 5) * 60;

  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [scale] = useState(() => new Animated.Value(0.6));

  const phaseIndex = Math.floor(elapsed / PHASE_SECONDS) % PHASES.length;
  const phase = PHASES[phaseIndex];
  const count = PHASE_SECONDS - (elapsed % PHASE_SECONDS);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
  }, []);

  // One tick per second while running.
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setElapsed((e) => Math.min(e + 1, total)), 1000);
    return () => clearInterval(timer);
  }, [running, total]);

  // Grow on the in-breath, shrink on the out-breath.
  useEffect(() => {
    if (reduceMotion) return;
    Animated.timing(scale, {
      toValue: phase.scale,
      duration: PHASE_SECONDS * 1000,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [phaseIndex, phase.scale, reduceMotion, scale]);

  const finish = () => {
    if (!task) return;
    completeTask(task.id);
    router.replace(`/task/${task.id}/complete`);
  };

  // Finish automatically when the time is up.
  useEffect(() => {
    if (task && elapsed >= total) {
      completeTask(task.id);
      router.replace(`/task/${task.id}/complete`);
    }
  }, [elapsed, total, task, completeTask]);

  if (!task) return <Redirect href="/tasks" />;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <ScreenHeader title={task.title} />
      </View>

      <View style={styles.stage}>
        <View style={styles.ring}>
          <Animated.View style={[styles.circle, { transform: [{ scale: reduceMotion ? 0.8 : scale }] }]} />
          <View style={styles.center} accessible accessibilityLiveRegion="polite" accessibilityLabel={`${phase.label}, ${count}`}>
            <Text style={styles.phase}>{phase.label}</Text>
            <Text style={styles.count}>{count}</Text>
          </View>
        </View>
        <Text style={styles.remaining} accessibilityLabel={`${mmss(total - elapsed)} remaining`}>
          {mmss(total - elapsed)} remaining
        </Text>
        <Text style={styles.hint}>Breathe gently. Stop whenever you need to.</Text>
      </View>

      <View style={styles.footer}>
        <OutlineButton title={running ? 'Pause' : 'Resume'} onPress={() => setRunning((r) => !r)} />
        <PrimaryButton title="Finish exercise" onPress={finish} />
      </View>
    </SafeAreaView>
  );
}

const RING = 260;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  ring: {
    width: RING,
    height: RING,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.paleGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    width: RING - 16,
    height: RING - 16,
    borderRadius: radius.pill,
    backgroundColor: colors.paleGreen,
  },
  center: {
    alignItems: 'center',
  },
  phase: {
    ...type.heading,
    fontSize: 22,
    color: colors.textPrimary,
  },
  count: {
    fontFamily: fonts.bold,
    fontSize: 48,
    lineHeight: 56,
    color: colors.textPrimary,
  },
  remaining: {
    ...type.label,
    fontSize: 15,
    color: colors.textPrimary,
  },
  hint: {
    ...type.body,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  footer: {
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
});
