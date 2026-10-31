import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ArrowRightIcon,
  BoltIcon,
  ChevronRightIcon,
  CloudIcon,
  LockIcon,
  PhoneIcon,
  ReframeIcon,
  SearchIcon,
  SparkleIcon,
  SproutIcon,
  SunIcon,
} from '../../components/icons';
import { Brain } from '../../components/illustrations/Brain';
import { SectionHeader } from '../../components/SectionHeader';
import { TaskCard } from '../../components/TaskCard';
import { currentUser, journalEntryCount, recentEntries, weeklySummary, type JournalEntry } from '../../data/mock';
import { comingSoon } from '../../lib/comingSoon';
import { emotionColor, emotionTint } from '../../lib/emotions';
import { partOfDay } from '../../lib/time';
import { useTasks } from '../../state/TasksContext';
import { colors, fonts, radius, spacing, type } from '../../theme/tokens';

// One-tap moods. `logId` is the option pre-selected in the Emotion Logger.
const MOODS: { label: string; logId: string; icon: (color: string) => ReactNode }[] = [
  { label: 'Low', logId: 'Sad', icon: (c) => <CloudIcon size={18} color={c} strokeWidth={2} /> },
  { label: 'Okay', logId: 'Neutral', icon: (c) => <SproutIcon size={18} color={c} strokeWidth={2} /> },
  { label: 'Good', logId: 'Content', icon: (c) => <SunIcon size={18} color={c} strokeWidth={2} /> },
  { label: 'Great', logId: 'Hopeful', icon: (c) => <SparkleIcon size={18} color={c} strokeWidth={2} /> },
];

export default function TodayScreen() {
  const homework = useTasks().tasks.filter((t) => t.status !== 'done');
  const latestEntry = recentEntries[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Greeting name={currentUser.name} />

        {/* Check-in */}
        <View style={styles.checkIn}>
          <Text style={styles.eyebrow}>A moment for you</Text>
          <Text style={styles.checkInTitle} accessibilityRole="header">
            Check in with yourself.
          </Text>
          <Text style={styles.checkInBody}>There’s no right or wrong way to feel.</Text>
          <View style={styles.moods}>
            {MOODS.map((m) => (
              <Pressable
                key={m.label}
                onPress={() => router.push({ pathname: '/log-emotion', params: { emotion: m.logId } })}
                accessibilityRole="button"
                accessibilityLabel={`I feel ${m.label.toLowerCase()}`}
                accessibilityHint="Opens the emotion logger"
                style={({ pressed }) => [
                  styles.mood,
                  { backgroundColor: emotionTint(m.logId) },
                  pressed && { opacity: 0.8 },
                ]}
              >
                {m.icon(emotionColor(m.logId))}
                <Text style={styles.moodLabel}>{m.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Your space */}
        <View style={styles.section}>
          <SectionHeader title="Your space" />
          <View style={styles.spaceRow}>
            <SpaceCard
              title="Write a thought"
              subtitle="Capture what’s on your mind"
              tone={colors.paleGreen}
              icon={<SproutIcon size={18} color={colors.greenText} strokeWidth={2} />}
              onPress={() => comingSoon('Write a thought')}
            />
            <SpaceCard
              title="CBT thought record"
              subtitle="Explore and reframe a thought"
              tone={colors.lavender}
              icon={<ReframeIcon size={18} color={colors.lavenderStrong} strokeWidth={2} />}
              onPress={() => comingSoon('CBT thought record')}
            />
          </View>
          <Pressable
            onPress={() => router.push('/therapists')}
            accessibilityRole="button"
            accessibilityLabel="Find a therapist. Browse verified clinicians"
            style={({ pressed }) => [styles.findCard, pressed && { opacity: 0.85 }]}
          >
            <View style={[styles.spaceIcon, { backgroundColor: colors.skyBlue, marginBottom: 0 }]}>
              <SearchIcon size={18} color={colors.skyStrong} strokeWidth={2} />
            </View>
            <View style={styles.findText}>
              <Text style={styles.spaceTitle}>Find a therapist</Text>
              <Text style={styles.muted}>Browse verified clinicians</Text>
            </View>
            <ChevronRightIcon size={18} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Homework */}
        <View style={styles.section}>
          <SectionHeader
            title="Assigned homework"
            badge={homework.length > 0 ? `${homework.length} pending` : undefined}
            action={homework.length > 0 ? { title: 'See all', onPress: () => router.push('/tasks') } : undefined}
          />
          {homework.length > 0 ? (
            homework.map((t) => <TaskCard key={t.id} task={t} />)
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No tasks assigned right now.</Text>
              <Text style={styles.muted}>Your therapist’s activities will appear here.</Text>
            </View>
          )}
        </View>

        {/* Progress */}
        <View style={styles.section}>
          <SectionHeader title="Your progress" />
          <Pressable
            onPress={() => router.push('/journal')}
            accessibilityRole="button"
            accessibilityLabel={`Your mind this week, ${weeklySummary.records} records. Explore your mindmap`}
            style={({ pressed }) => [styles.progress, pressed && { opacity: 0.85 }]}
          >
            <View style={styles.progressTop}>
              <View style={styles.progressText}>
                <Text style={styles.progressTitle}>Your mind this week</Text>
                <View style={styles.records}>
                  <Text style={styles.recordsText}>{weeklySummary.records} records</Text>
                </View>
              </View>
              <Brain width={64} leftFill={colors.lavenderSoft} rightFill={colors.skySoft} />
            </View>
            <Text style={styles.progressBody}>
              You’ve been exploring your thoughts and emotions. See the patterns emerging.
            </Text>
            <View style={styles.progressLink}>
              <Text style={styles.progressLinkText}>Explore your mindmap</Text>
              <ArrowRightIcon size={16} color={colors.textPrimary} strokeWidth={2} />
            </View>
          </Pressable>
        </View>

        {/* Reflections */}
        <View style={styles.section}>
          <SectionHeader
            title="Recent reflections"
            action={{ title: `View all (${journalEntryCount})`, onPress: () => router.push('/journal') }}
          />
          {latestEntry ? (
            <EntryCard entry={latestEntry} />
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No reflections yet.</Text>
              <Text style={styles.muted}>Your check-ins and thoughts will appear here.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Greeting({ name }: { name: string }) {
  return (
    <View style={styles.greeting}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name.charAt(0)}</Text>
      </View>
      <View style={styles.greetingText}>
        <Text style={styles.hello} accessibilityRole="header">
          Good {partOfDay()}, {name}
        </Text>
        <Text style={styles.muted}>How are you feeling today?</Text>
      </View>
      <Pressable
        onPress={() => router.push('/crisis')}
        accessibilityRole="button"
        accessibilityLabel="Crisis support"
        accessibilityHint="Opens crisis lines and a grounding exercise"
        hitSlop={6}
        style={({ pressed }) => [styles.crisis, pressed && { opacity: 0.8 }]}
      >
        <PhoneIcon size={14} color={colors.pinkText} strokeWidth={2} />
        <Text style={styles.crisisText}>Crisis</Text>
      </Pressable>
    </View>
  );
}

type SpaceCardProps = {
  title: string;
  subtitle: string;
  tone: string;
  icon: ReactNode;
  onPress: () => void;
};

function SpaceCard({ title, subtitle, tone, icon, onPress }: SpaceCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      style={({ pressed }) => [styles.spaceCard, pressed && { opacity: 0.85 }]}
    >
      <View style={[styles.spaceIcon, { backgroundColor: tone }]}>{icon}</View>
      <Text style={styles.spaceTitle}>{title}</Text>
      <Text style={styles.muted}>{subtitle}</Text>
    </Pressable>
  );
}

function EntryCard({ entry }: { entry: JournalEntry }) {
  const [day] = entry.date.split(' ');
  return (
    <Pressable
      onPress={() => comingSoon(entry.title)}
      accessibilityRole="button"
      accessibilityLabel={`${entry.date}, ${entry.title}`}
      style={({ pressed }) => [styles.entry, pressed && { opacity: 0.85 }]}
    >
      <View style={[styles.date, { backgroundColor: emotionTint(entry.emotion.label) }]}>
        <Text style={styles.dateText}>{day}</Text>
      </View>
      <View style={styles.entryBody}>
        <View style={styles.entryMeta}>
          <BoltIcon size={13} color={emotionColor(entry.emotion.label)} strokeWidth={2} />
          <Text style={styles.muted} numberOfLines={1}>
            {entry.date} · {entry.emotion.label}
            {entry.thought ? ` · ${entry.thought}` : ''}
          </Text>
        </View>
        <Text style={styles.entryTitle}>{entry.title}</Text>
        <Text style={styles.entryPreview} numberOfLines={2}>
          {entry.preview}
        </Text>
        <View style={styles.entryFooter}>
          <View style={styles.privacy}>
            <LockIcon size={12} color={colors.textSecondary} />
            <Text style={styles.privacyText}>{entry.shared ? 'Shared' : 'Private'}</Text>
          </View>
          <ChevronRightIcon size={16} color={colors.textSecondary} />
        </View>
      </View>
    </Pressable>
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
    gap: spacing.xxl,
  },
  muted: {
    ...type.caption,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },

  // Greeting
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.paleGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.semibold,
    fontSize: 17,
    color: colors.textPrimary,
  },
  greetingText: {
    flex: 1,
  },
  hello: {
    ...type.heading,
    fontSize: 19,
    color: colors.textPrimary,
  },
  crisis: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 34,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.pink,
    backgroundColor: colors.pinkSoft,
  },
  crisisText: {
    ...type.label,
    color: colors.pinkText,
  },

  // Check-in
  checkIn: {
    gap: spacing.sm,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.pink,
  },
  eyebrow: {
    ...type.overline,
    textTransform: 'uppercase',
    color: colors.pinkText,
  },
  checkInTitle: {
    ...type.title,
    fontSize: 28,
    lineHeight: 34,
    color: colors.textPrimary,
  },
  checkInBody: {
    ...type.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  moods: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  mood: {
    flex: 1,
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  moodLabel: {
    ...type.label,
    color: colors.textPrimary,
  },

  // Sections
  section: {
    gap: spacing.md,
  },
  findCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  findText: {
    flex: 1,
    gap: 2,
  },
  spaceRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  spaceCard: {
    flex: 1,
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  spaceIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  spaceTitle: {
    ...type.button,
    fontSize: 15,
    color: colors.textPrimary,
  },
  empty: {
    gap: 2,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
  },
  emptyTitle: {
    ...type.label,
    fontSize: 14,
    color: colors.textPrimary,
  },

  // Progress
  progress: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.lavender,
  },
  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressText: {
    flex: 1,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  progressTitle: {
    ...type.heading,
    fontSize: 18,
    color: colors.textPrimary,
  },
  records: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  recordsText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.lavenderStrong,
  },
  progressBody: {
    ...type.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  progressLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  progressLinkText: {
    ...type.label,
    fontSize: 14,
    color: colors.textPrimary,
  },

  // Entry
  entry: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  date: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  entryBody: {
    flex: 1,
    gap: 4,
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  entryTitle: {
    ...type.button,
    fontSize: 16,
    color: colors.textPrimary,
  },
  entryPreview: {
    ...type.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  entryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
  },
  privacyText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.textSecondary,
  },
});
