import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Task } from '../data/tasks';
import { colors, fonts, radius, spacing, type } from '../theme/tokens';
import { CheckIcon, ChevronRightIcon, ClockIcon, ReframeIcon, WaveIcon } from './icons';

const STATUS_LABEL = { todo: 'New', in_progress: 'In progress', done: 'Completed' } as const;

// One assigned task. Open tasks lead to the task screen; done ones show the check-in result.
export function TaskCard({ task }: { task: Task }) {
  const done = task.status === 'done';
  const Icon = task.kind === 'breathing' ? WaveIcon : ReframeIcon;
  const tone = task.kind === 'breathing' ? colors.paleGreen : colors.lavender;
  const iconColor = task.kind === 'breathing' ? colors.greenText : colors.lavenderStrong;

  return (
    <Pressable
      onPress={() => router.push(`/task/${task.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${task.title}, ${task.minutes} minutes, ${STATUS_LABEL[task.status]}`}
      style={({ pressed }) => [styles.card, done && styles.cardDone, pressed && { opacity: 0.85 }]}
    >
      <View style={[styles.icon, { backgroundColor: done ? colors.surface : tone }]}>
        {done ? (
          <CheckIcon size={20} color={colors.greenText} strokeWidth={2.5} />
        ) : (
          <Icon size={20} color={iconColor} strokeWidth={2} />
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.pills}>
          <View style={[styles.status, styles[task.status]]}>
            <Text style={[styles.statusText, styles[`${task.status}Text`]]}>{STATUS_LABEL[task.status]}</Text>
          </View>
          {task.priority === 'highest' && !done && (
            <View style={[styles.status, styles.priority]}>
              <Text style={[styles.statusText, styles.priorityText]}>Highest priority</Text>
            </View>
          )}
        </View>
        <Text style={styles.title}>{task.title}</Text>
        <View style={styles.metaRow}>
          <ClockIcon size={13} color={colors.textSecondary} />
          <Text style={styles.meta}>
            {done
              ? `Completed ${task.completedAt}${task.checkIn ? ` · ${task.checkIn.feeling}` : ''}`
              : `${task.minutes} min · ${task.due}`}
          </Text>
        </View>
      </View>

      <ChevronRightIcon size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  cardDone: {
    backgroundColor: colors.greenSoft,
    borderColor: colors.paleGreen,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 4,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  status: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  statusText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
  },
  todo: { backgroundColor: colors.lavenderSoft },
  todoText: { color: colors.lavenderStrong },
  in_progress: { backgroundColor: colors.amberSoft },
  in_progressText: { color: colors.amberText },
  done: { backgroundColor: colors.surface },
  doneText: { color: colors.greenText },
  priority: { backgroundColor: colors.pinkSoft },
  priorityText: { color: colors.pinkText },
  title: {
    ...type.button,
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  meta: {
    ...type.caption,
    flexShrink: 1,
    color: colors.textSecondary,
  },
});
