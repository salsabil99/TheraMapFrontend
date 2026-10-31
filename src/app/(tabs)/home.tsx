import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import {
  ArrowRightIcon,
  ChevronRightIcon,
  ClockIcon,
  HeartIcon,
  ReframeIcon,
  SproutIcon,
} from '../../components/icons';
import { Brain } from '../../components/illustrations/Brain';
import { currentUser, journalEntryCount, recentEntries, weeklySummary, type JournalEntry } from '../../data/mock';
import type { Task } from '../../data/tasks';
import { comingSoon } from '../../lib/comingSoon';
import { emotionColor } from '../../lib/emotions';
import { partOfDay } from '../../lib/time';
import { useTasks } from '../../state/TasksContext';
import { colors, fonts, radius, spacing, type } from '../../theme/tokens';

// One-tap moods on a low-to-great scale. `logId` is pre-selected in the Emotion Logger.
const MOODS = [
  { label: 'Low', logId: 'Sad', tone: colors.pink, dot: colors.pinkStrong },
  { label: 'Okay', logId: 'Neutral', tone: colors.lavender, dot: colors.lavenderStrong },
  { label: 'Good', logId: 'Content', tone: colors.paleGreen, dot: colors.greenStrong },
  { label: 'Great', logId: 'Hopeful', tone: colors.skyBlue, dot: colors.skyStrong },
];

export default function TodayScreen() {
  const homework = useTasks().tasks.filter((t) => t.status !== 'done');
  const latestEntry = recentEntries[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Branches />
        <Header name={currentUser.name} />

        {/* Mood check-in */}
        <View style={styles.block}>
          <Text style={styles.overline}>How are you feeling?</Text>
          <MoodScale />
        </View>

        <Divider />

        {/* Your space */}
        <View style={styles.block}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Your space
          </Text>
          <View style={styles.spaceRow}>
            <SpaceItem
              title="Write a thought"
              subtitle="Capture what’s on your mind"
              icon={<SproutIcon size={22} />}
              onPress={() => comingSoon('Write a thought')}
            />
            <View style={styles.vDivider} />
            <SpaceItem
              title="CBT thought record"
              subtitle="Explore and reframe a thought"
              icon={<ReframeIcon size={22} />}
              onPress={() => comingSoon('CBT thought record')}
            />
          </View>
        </View>

        <Divider />

        {/* Homework */}
        <View style={styles.block}>
          <SectionTitle
            title="Assigned homework"
            action={homework.length > 0 ? { title: 'See all', onPress: () => router.push('/tasks') } : undefined}
          />
          {homework.length > 0 ? (
            homework.map((t, i) => <TaskRow key={t.id} task={t} first={i === 0} />)
          ) : (
            <Text style={styles.muted}>No tasks assigned right now. Your therapist’s activities will appear here.</Text>
          )}
        </View>

        <Divider />

        {/* Progress */}
        <Pressable
          onPress={() => router.push('/journal')}
          accessibilityRole="button"
          accessibilityLabel={`Your mind this week, ${weeklySummary.records} records. Explore your mindmap`}
          style={({ pressed }) => [styles.block, pressed && { opacity: 0.8 }]}
        >
          <Text style={styles.overline}>Your progress</Text>
          <View style={styles.progressRow}>
            <View style={styles.flex}>
              <Text style={styles.sectionTitle}>Your mind this week</Text>
              <Text style={styles.muted}>{weeklySummary.records} records</Text>
            </View>
            <Brain width={60} leftFill={colors.lavenderSoft} rightFill={colors.skySoft} strokeColor={colors.borderStrong} />
          </View>
          <Text style={styles.body}>You’ve been exploring your thoughts and emotions. See the patterns emerging.</Text>
          <View style={styles.link}>
            <Text style={styles.linkText}>Explore your mindmap</Text>
            <ArrowRightIcon size={16} strokeWidth={2} />
          </View>
        </Pressable>

        <Divider />

        {/* Reflections */}
        <View style={styles.block}>
          <SectionTitle
            title="Recent reflections"
            action={{ title: `View all (${journalEntryCount})`, onPress: () => router.push('/journal') }}
          />
          {latestEntry ? (
            <EntryRow entry={latestEntry} />
          ) : (
            <Text style={styles.muted}>Your check-ins and thoughts will appear here.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Header({ name }: { name: string }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0)}</Text>
        </View>
        <Pressable
          onPress={() => router.push('/crisis')}
          accessibilityRole="button"
          accessibilityLabel="Crisis support"
          accessibilityHint="Opens crisis lines and a grounding exercise"
          hitSlop={6}
          style={({ pressed }) => [styles.crisis, pressed && { backgroundColor: colors.pinkSoft }]}
        >
          <HeartIcon size={16} color={colors.pinkText} strokeWidth={2} />
          <Text style={styles.crisisText}>Crisis support</Text>
        </Pressable>
      </View>
      <Text style={styles.greeting} accessibilityRole="header">
        Good {partOfDay()}, {name}
      </Text>
      <Text style={styles.body}>How are you feeling today?</Text>
    </View>
  );
}

function MoodScale() {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  // Dot under the centre of each pill (pills share the width equally with GAP between).
  const GAP = spacing.sm;
  const pill = (width - GAP * (MOODS.length - 1)) / MOODS.length;
  const xs = MOODS.map((_, i) => i * (pill + GAP) + pill / 2);
  const H = 20;
  const mid = H / 2;
  // A gentle wave from edge to edge through every dot.
  const points = [0, ...xs, width];
  let d = `M0 ${mid}`;
  for (let i = 1; i < points.length; i++) {
    const x0 = points[i - 1];
    const x1 = points[i];
    d += ` Q${(x0 + x1) / 2} ${i % 2 ? mid - 5 : mid + 5} ${x1} ${mid}`;
  }

  return (
    <View onLayout={onLayout} style={styles.moodScale}>
      <View style={styles.moods}>
        {MOODS.map((m) => (
          <Pressable
            key={m.label}
            onPress={() => router.push({ pathname: '/log-emotion', params: { emotion: m.logId } })}
            accessibilityRole="button"
            accessibilityLabel={`I feel ${m.label.toLowerCase()}`}
            accessibilityHint="Opens the emotion logger"
            style={({ pressed }) => [styles.mood, { backgroundColor: m.tone }, pressed && { opacity: 0.75 }]}
          >
            <Text style={styles.moodLabel}>{m.label}</Text>
          </Pressable>
        ))}
      </View>
      {width > 0 && (
        <Svg width={width} height={H} pointerEvents="none">
          <Path d={d} stroke={colors.borderStrong} strokeWidth={1.5} fill="none" />
          <Circle cx={3} cy={mid} r={3} fill={colors.borderStrong} />
          <Circle cx={width - 3} cy={mid} r={3} fill={colors.borderStrong} />
          {xs.map((x, i) => (
            <Circle key={i} cx={x} cy={mid} r={4.5} fill={MOODS[i].dot} />
          ))}
        </Svg>
      )}
    </View>
  );
}

function SectionTitle({ title, action }: { title: string; action?: { title: string; onPress: () => void } }) {
  return (
    <View style={styles.sectionHead}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        {title}
      </Text>
      {action && (
        <Pressable onPress={action.onPress} hitSlop={8} accessibilityRole="link" style={styles.link}>
          <Text style={styles.actionText}>{action.title}</Text>
          <ArrowRightIcon size={14} color={colors.textSecondary} strokeWidth={2} />
        </Pressable>
      )}
    </View>
  );
}

function SpaceItem({
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
      style={({ pressed }) => [styles.spaceItem, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.ring}>{icon}</View>
      <View>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.muted}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

const STATUS = { todo: 'New', in_progress: 'In progress', done: 'Done' } as const;

function TaskRow({ task, first }: { task: Task; first: boolean }) {
  return (
    <Pressable
      onPress={() => router.push(`/task/${task.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${task.title}, ${task.minutes} minutes, ${STATUS[task.status]}`}
      style={({ pressed }) => [styles.row, !first && styles.rowDivider, pressed && { opacity: 0.7 }]}
    >
      <View style={[styles.accent, task.priority === 'highest' && { backgroundColor: colors.pinkText }]} />
      <View style={styles.statusPill}>
        <Text style={styles.statusText}>{STATUS[task.status]}</Text>
      </View>
      <View style={styles.flex}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {task.title}
        </Text>
        <View style={styles.meta}>
          <ClockIcon size={14} color={colors.textSecondary} />
          <Text style={styles.muted}>
            {task.minutes} min · {task.due}
          </Text>
        </View>
      </View>
      <ChevronRightIcon size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

function EntryRow({ entry }: { entry: JournalEntry }) {
  const [day] = entry.date.split(' ');
  return (
    <Pressable
      onPress={() => comingSoon(entry.title)}
      accessibilityRole="button"
      accessibilityLabel={`${entry.date}, ${entry.title}`}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
    >
      <View style={[styles.ring, { borderColor: emotionColor(entry.emotion.label) }]}>
        <Text style={styles.day}>{day}</Text>
      </View>
      <View style={styles.flex}>
        <Text style={styles.muted}>
          {entry.date} · {entry.emotion.label}
          {entry.thought ? ` · ${entry.thought}` : ''} · {entry.shared ? 'Shared' : 'Private'}
        </Text>
        <Text style={styles.itemTitle}>{entry.title}</Text>
        <Text style={styles.muted} numberOfLines={2}>
          {entry.preview}
        </Text>
      </View>
      <ChevronRightIcon size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

// Faint neuron-like branches behind the header, purely decorative.
function Branches() {
  return (
    <Svg width={240} height={260} viewBox="0 0 240 260" style={styles.branches} pointerEvents="none">
      <Path
        d="M240 20C200 40 170 60 150 100S120 170 80 190M150 100C170 120 200 125 230 120M150 100C140 70 150 40 175 15M80 190C60 200 40 220 30 250M80 190C95 210 100 230 98 255M118 152C100 140 80 140 55 150M190 60C205 70 220 70 238 64"
        stroke={colors.petrol}
        strokeOpacity={0.07}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Sits behind the header and scrolls away with it.
  branches: {
    position: 'absolute',
    top: 0,
    right: -spacing.xl,
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
  block: {
    gap: spacing.md,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderStrong,
  },
  vDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: colors.borderStrong,
  },
  overline: {
    ...type.overline,
    textTransform: 'uppercase',
    color: colors.textSecondary,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...type.heading,
    fontSize: 22,
    lineHeight: 28,
    color: colors.textPrimary,
  },
  body: {
    ...type.body,
    color: colors.textPrimary,
  },
  muted: {
    ...type.caption,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  itemTitle: {
    ...type.button,
    fontSize: 16,
    color: colors.textPrimary,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  linkText: {
    ...type.label,
    fontSize: 14,
    color: colors.textPrimary,
  },
  actionText: {
    ...type.label,
    color: colors.textSecondary,
  },

  // Header
  header: {
    gap: spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.semibold,
    fontSize: 20,
    color: colors.pinkText,
  },
  crisis: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 40,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.pinkText,
  },
  crisisText: {
    ...type.overline,
    fontSize: 12,
    textTransform: 'uppercase',
    color: colors.pinkText,
  },
  greeting: {
    ...type.title,
    fontSize: 30,
    lineHeight: 36,
    color: colors.textPrimary,
  },

  // Mood scale
  moodScale: {
    gap: spacing.sm,
  },
  moods: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  mood: {
    flex: 1,
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodLabel: {
    ...type.label,
    fontSize: 15,
    color: colors.textPrimary,
  },

  // Your space
  spaceRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  spaceItem: {
    flex: 1,
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  ring: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Rows
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderStrong,
  },
  accent: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: radius.pill,
    backgroundColor: colors.petrol,
  },
  statusPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  statusText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textPrimary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  day: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.textPrimary,
  },

  // Progress
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
});
