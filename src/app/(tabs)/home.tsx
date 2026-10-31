import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import {
  ArrowRightIcon,
  ChevronRightIcon,
  ClipboardCheckIcon,
  CloudIcon,
  LockIcon,
  PhoneIcon,
  ReframeIcon,
  SearchIcon,
  SparkleIcon,
  SproutIcon,
  SunIcon,
  WaveIcon,
} from '../../components/icons';
import { Brain } from '../../components/illustrations/Brain';
import { SectionHeader } from '../../components/SectionHeader';
import { currentUser, journalEntryCount, recentEntries, weeklySummary, type JournalEntry } from '../../data/mock';
import type { Task } from '../../data/tasks';
import { comingSoon } from '../../lib/comingSoon';
import { partOfDay } from '../../lib/time';
import { useTasks } from '../../state/TasksContext';
import { colors, fonts, radius, spacing, type } from '../../theme/tokens';

// One-tap moods. `logId` is the option pre-selected in the Emotion Logger.
// Nothing is shown as selected here: a mood is only recorded after the user chooses it.
const MOODS: { label: string; logId: string; icon: (color: string) => ReactNode }[] = [
  { label: 'Low', logId: 'Sad', icon: (c) => <CloudIcon size={19} color={c} /> },
  { label: 'Okay', logId: 'Neutral', icon: (c) => <SproutIcon size={19} color={c} /> },
  { label: 'Good', logId: 'Content', icon: (c) => <SunIcon size={19} color={c} /> },
  { label: 'Great', logId: 'Hopeful', icon: (c) => <SparkleIcon size={19} color={c} /> },
];

const DUE_ORDER = { today: 0, tomorrow: 1, later: 2 } as const;

export default function TodayScreen() {
  const homework = useTasks()
    .tasks.filter((t) => t.status !== 'done')
    .sort((a, b) => DUE_ORDER[a.dueDay ?? 'later'] - DUE_ORDER[b.dueDay ?? 'later']);
  const dueToday = homework.filter((t) => t.dueDay === 'today');
  const upNext = homework.filter((t) => t.dueDay !== 'today');
  const latestEntry = recentEntries[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Greeting name={currentUser.name} />

        {/* Check-in */}
        <View style={styles.checkIn}>
          <Waves />
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
                style={({ pressed }) => [styles.mood, pressed && styles.moodPressed]}
              >
                {({ pressed }) => (
                  <>
                    {m.icon(pressed ? colors.textOnPetrol : colors.petrol)}
                    <Text style={[styles.moodLabel, pressed && { color: colors.textOnPetrol }]}>{m.label}</Text>
                  </>
                )}
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
              icon={<SproutIcon size={22} color={colors.petrol} />}
              onPress={() => comingSoon('Write a thought')}
            />
            <SpaceCard
              title="CBT thought record"
              subtitle="Explore and reframe a thought"
              icon={<ReframeIcon size={22} color={colors.petrol} />}
              onPress={() => comingSoon('CBT thought record')}
            />
          </View>
          <Pressable
            onPress={() => router.push('/therapists')}
            accessibilityRole="button"
            accessibilityLabel="Find a therapist. Browse verified clinicians"
            style={({ pressed }) => [styles.findRow, pressed && { opacity: 0.85 }]}
          >
            <View style={[styles.iconCircle, styles.iconCircleXs]}>
              <SearchIcon size={18} color={colors.petrol} />
            </View>
            <Text style={[styles.cardTitle, styles.flex]}>Find a therapist</Text>
            <Text style={styles.muted}>Verified clinicians</Text>
            <ChevronRightIcon size={18} color={colors.textPrimary} />
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
            <>
              {dueToday.length > 0 && <Text style={styles.groupLabel}>Due today</Text>}
              {dueToday.map((t) => (
                <HomeworkCard key={t.id} task={t} featured />
              ))}
              {upNext.length > 0 && <Text style={styles.groupLabel}>Up next</Text>}
              {upNext.map((t) => (
                <HomeworkCard key={t.id} task={t} />
              ))}
            </>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No tasks assigned right now.</Text>
              <Text style={styles.muted}>Your therapist’s activities will appear here.</Text>
            </View>
          )}
        </View>

        {/* Progress */}
        <View style={styles.section}>
          <View style={styles.sectionIntro}>
            <SectionHeader title="Your progress" />
            <Text style={styles.muted}>
              Based on {weeklySummary.records} private check-ins and thoughts · {weeklySummary.range}. Only you can see
              this.
            </Text>
          </View>
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
              <Brain width={64} leftFill={colors.surface} rightFill={colors.surface} strokeColor={colors.teal} />
            </View>
            <Text style={styles.body}>You’ve been exploring your thoughts and emotions. See the patterns emerging.</Text>
            <View style={styles.link}>
              <Text style={styles.linkText}>Explore your mindmap</Text>
              <ArrowRightIcon size={16} color={colors.petrol} strokeWidth={2} />
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
      <View style={styles.flex}>
        <Text
          style={styles.hello}
          accessibilityRole="header"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          Good {partOfDay()}, {name}
        </Text>
        <Text style={styles.helloSub} numberOfLines={1}>
          How are you feeling today?
        </Text>
      </View>
      <Pressable
        onPress={() => router.push('/crisis')}
        accessibilityRole="button"
        accessibilityLabel="Crisis support"
        accessibilityHint="Opens crisis lines and a grounding exercise"
        hitSlop={6}
        style={({ pressed }) => [styles.crisis, pressed && { opacity: 0.8 }]}
      >
        <PhoneIcon size={16} color={colors.pinkText} strokeWidth={2} />
        <Text style={styles.crisisText}>Crisis</Text>
      </Pressable>
    </View>
  );
}

// Soft overlapping curves in the top-right of the check-in card.
function Waves() {
  return (
    <Svg width={220} height={200} viewBox="0 0 220 200" style={styles.waves} pointerEvents="none">
      <Path d="M220 0H120C150 40 140 90 180 130C195 145 210 150 220 152V0Z" fill={colors.teal} opacity={0.55} />
      <Path d="M220 40C190 70 200 120 160 160C140 180 110 195 80 200H220V40Z" fill={colors.teal} opacity={0.35} />
    </Svg>
  );
}

function SpaceCard({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      style={({ pressed }) => [styles.spaceCard, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.spaceTop}>
        <View style={[styles.iconCircle, styles.iconCircleSmall]}>{icon}</View>
        <View style={styles.roundChevron}>
          <ChevronRightIcon size={16} color={colors.petrol} strokeWidth={2} />
        </View>
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.muted} numberOfLines={2}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

// Compact single row. Today's task is emphasised; later ones stay quiet.
function HomeworkCard({ task, featured }: { task: Task; featured?: boolean }) {
  const Icon = task.kind === 'breathing' ? WaveIcon : ClipboardCheckIcon;
  const action = task.status === 'in_progress' ? 'Continue' : 'Start';
  const when = featured ? task.due.replace(/^Today,\s*/, '') : task.due;
  return (
    <View style={[styles.homework, featured && styles.homeworkFeatured]}>
      <View style={[styles.iconCircle, styles.iconCircleSm, featured && { backgroundColor: colors.surface }]}>
        <Icon size={20} color={colors.petrol} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {task.title}
        </Text>
        <Text style={styles.muted} numberOfLines={1}>
          {when} · {task.minutes} min
        </Text>
      </View>
      <Pressable
        onPress={() => router.push(`/task/${task.id}`)}
        accessibilityRole="button"
        accessibilityLabel={`${action} ${task.title}, ${task.due}`}
        hitSlop={6}
        style={({ pressed }) => [
          styles.startButton,
          featured ? styles.startSolid : styles.startOutline,
          pressed && { opacity: 0.85 },
        ]}
      >
        <Text style={[styles.startText, featured && { color: colors.textOnPetrol }]}>{action}</Text>
      </Pressable>
    </View>
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
      <View style={styles.date}>
        <Text style={styles.dateText}>{day}</Text>
      </View>
      <View style={styles.flex}>
        <Text style={styles.muted} numberOfLines={1}>
          {entry.date} · {entry.emotion.label}
          {entry.thought ? ` · ${entry.thought}` : ''}
        </Text>
        <Text style={styles.cardTitle}>{entry.title}</Text>
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

const ICON_CIRCLE = 48;

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
  flex: {
    flex: 1,
  },
  muted: {
    ...type.caption,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  body: {
    ...type.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  cardTitle: {
    ...type.button,
    fontSize: 16,
    color: colors.textPrimary,
  },
  iconCircle: {
    width: ICON_CIRCLE,
    height: ICON_CIRCLE,
    borderRadius: radius.pill,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Greeting
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.semibold,
    fontSize: 20,
    color: colors.textOnPetrol,
  },
  hello: {
    ...type.heading,
    fontSize: 18,
    lineHeight: 23,
    color: colors.textPrimary,
  },
  helloSub: {
    ...type.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  crisis: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 38,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.pink,
    backgroundColor: colors.pinkSoft,
  },
  crisisText: {
    ...type.label,
    fontSize: 14,
    color: colors.pinkText,
  },

  // Check-in
  checkIn: {
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.petrol,
    overflow: 'hidden',
  },
  waves: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  eyebrow: {
    ...type.overline,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.textOnPetrolMuted,
  },
  checkInTitle: {
    ...type.title,
    fontSize: 26,
    lineHeight: 31,
    color: colors.textOnPetrol,
  },
  checkInBody: {
    ...type.body,
    fontSize: 15,
    color: colors.textOnPetrolMuted,
  },
  moods: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  mood: {
    flex: 1,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  // Shown only while pressed; nothing is pre-selected.
  moodPressed: {
    backgroundColor: colors.petrolSoft,
    borderColor: colors.accent,
  },
  moodLabel: {
    ...type.label,
    fontSize: 14,
    color: colors.textPrimary,
  },

  // Sections
  section: {
    gap: spacing.md,
  },
  spaceRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  spaceCard: {
    flex: 1,
    gap: 2,
    padding: spacing.md + 2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  spaceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  iconCircleSmall: {
    width: 40,
    height: 40,
  },
  roundChevron: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homework: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  homeworkFeatured: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.tealSoft,
  },
  groupLabel: {
    ...type.overline,
    textTransform: 'uppercase',
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  startButton: {
    height: 36,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startSolid: {
    backgroundColor: colors.petrol,
  },
  startOutline: {
    borderWidth: 1.5,
    borderColor: colors.petrol,
  },
  startText: {
    ...type.button,
    fontSize: 14,
    color: colors.petrol,
  },
  iconCircleSm: {
    width: 40,
    height: 40,
  },
  iconCircleXs: {
    width: 34,
    height: 34,
  },
  findRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md + 2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  sectionIntro: {
    gap: spacing.xs,
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
    backgroundColor: colors.tealSoft,
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
    color: colors.petrol,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  linkText: {
    ...type.label,
    fontSize: 14,
    color: colors.petrol,
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
    width: ICON_CIRCLE,
    height: ICON_CIRCLE,
    borderRadius: radius.pill,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontFamily: fonts.bold,
    fontSize: 18,
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
