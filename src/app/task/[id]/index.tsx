import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OutlineButton, PrimaryButton } from '../../../components/Button';
import { CheckIcon, ClockIcon, LockIcon } from '../../../components/icons';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useTasks } from '../../../state/TasksContext';
import { colors, fonts, radius, spacing, type } from '../../../theme/tokens';

export default function TaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTask, startTask, completeTask } = useTasks();
  const task = getTask(id);
  if (!task) return <Redirect href="/tasks" />;

  const done = task.status === 'done';
  const guided = task.kind === 'breathing';
  const tone = guided ? colors.paleGreen : colors.lavender;

  const begin = () => {
    startTask(task.id);
    if (guided) {
      router.push(`/task/${task.id}/session`);
    } else {
      // No guided flow for written exercises yet: the client does it on paper or in the journal.
      completeTask(task.id);
      router.push(`/task/${task.id}/complete`);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <ScreenHeader title="Assigned task" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!!task.reminder && !done && (
          <View style={styles.reminder}>
            <ClockIcon size={14} color={colors.lavenderStrong} strokeWidth={2} />
            <Text style={styles.reminderText}>{task.reminder}</Text>
          </View>
        )}

        <Text style={styles.headline} accessibilityRole="header">
          {task.headline}
        </Text>

        <View style={[styles.exercise, { backgroundColor: tone }]}>
          <Text style={styles.exerciseTitle}>{task.title}</Text>
          <Text style={styles.exerciseMeta}>
            {task.minutes} minutes · Assigned by your therapist
          </Text>
          <Text style={styles.exerciseBody}>
            {task.description.map((seg, i) => (
              <Text key={i} style={seg.bold && styles.bold}>
                {seg.text}
              </Text>
            ))}
          </Text>
          <View style={styles.assigned}>
            <View style={styles.initials}>
              <Text style={styles.initialsText}>{task.assignedBy.initials}</Text>
            </View>
            <Text style={styles.exerciseMeta}>
              {task.assignedBy.name} · {done ? `Completed ${task.completedAt}` : `Due ${task.due}`}
            </Text>
          </View>
        </View>

        {done ? (
          <View style={styles.doneCard}>
            <CheckIcon size={20} color={colors.greenText} strokeWidth={2.5} />
            <View style={styles.flex}>
              <Text style={styles.cardTitle}>Task completed</Text>
              {!!task.checkIn && (
                <Text style={styles.cardBody}>
                  Felt {task.checkIn.feeling.toLowerCase()} · intensity {task.checkIn.intensity}/10
                </Text>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Before you begin</Text>
            <Text style={styles.cardBody}>{task.beforeYouBegin}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {done ? (
          <OutlineButton title="View check-in" onPress={() => router.push(`/task/${task.id}/complete`)} />
        ) : (
          <PrimaryButton
            title={guided ? `Begin · ${task.minutes} minutes` : 'Mark as done'}
            onPress={begin}
          />
        )}
        <Text style={styles.note}>
          <LockIcon size={12} color={colors.textMuted} />
          {'  '}Completing this task does not share your private journal entries.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
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
  reminder: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.lavenderSoft,
  },
  reminderText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.lavenderStrong,
  },
  headline: {
    ...type.title,
    fontSize: 30,
    lineHeight: 36,
    color: colors.textPrimary,
  },
  exercise: {
    padding: spacing.lg,
    gap: spacing.sm,
    borderRadius: radius.lg,
  },
  exerciseTitle: {
    ...type.heading,
    color: colors.textPrimary,
  },
  exerciseMeta: {
    ...type.caption,
    fontSize: 13,
    flexShrink: 1,
    color: colors.textSecondary,
  },
  exerciseBody: {
    ...type.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  bold: {
    fontFamily: fonts.semibold,
  },
  assigned: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  initials: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    color: colors.greenText,
  },
  card: {
    padding: spacing.lg,
    gap: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  doneCard: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.greenSoft,
  },
  cardTitle: {
    ...type.button,
    color: colors.textPrimary,
  },
  cardBody: {
    ...type.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  footer: {
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  note: {
    ...type.caption,
    textAlign: 'center',
    color: colors.textMuted,
  },
});
