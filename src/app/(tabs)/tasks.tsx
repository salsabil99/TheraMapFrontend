import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandBar } from '../../components/BrandBar';
import { LockIcon } from '../../components/icons';
import { SectionHeader } from '../../components/SectionHeader';
import { TaskCard } from '../../components/TaskCard';
import { useTasks } from '../../state/TasksContext';
import { colors, spacing, type } from '../../theme/tokens';

export default function TasksScreen() {
  const { tasks } = useTasks();
  const open = tasks.filter((t) => t.status !== 'done');
  const done = tasks.filter((t) => t.status === 'done');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BrandBar />

        <View style={styles.intro}>
          <Text style={styles.title} accessibilityRole="header">
            Tasks
          </Text>
          <Text style={styles.subtitle}>Exercises your therapist assigned between sessions.</Text>
        </View>

        <View style={styles.section}>
          <SectionHeader title="To do" badge={open.length > 0 ? `${open.length} pending` : undefined} />
          {open.length > 0 ? (
            open.map((t) => <TaskCard key={t.id} task={t} />)
          ) : (
            <View style={styles.empty}>
              <Text style={styles.subtitle}>You’re all caught up. New tasks from your therapist will appear here.</Text>
            </View>
          )}
        </View>

        {done.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Completed" />
            {done.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </View>
        )}

        <Text style={styles.note}>
          <LockIcon size={12} color={colors.textMuted} />
          {'  '}Your therapist sees that a task is complete. Your private journal entries are never shared.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  intro: {
    gap: spacing.xs,
  },
  title: {
    ...type.title,
    fontSize: 30,
    lineHeight: 36,
    color: colors.textPrimary,
  },
  subtitle: {
    ...type.body,
    color: colors.textSecondary,
  },
  section: {
    gap: spacing.md,
  },
  empty: {
    padding: spacing.lg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  note: {
    ...type.caption,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    color: colors.textMuted,
  },
});
