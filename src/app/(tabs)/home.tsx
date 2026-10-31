import { router, type Href } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { LayoutAnimation, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { ExpandableCard } from '../../components/ExpandableCard';
import {
  ArrowRightIcon,
  BoltIcon,
  BookIcon,
  ChevronRightIcon,
  ClipboardCheckIcon,
  ClockIcon,
  CloudIcon,
  DotsIcon,
  LeafIcon,
  LockIcon,
  PhoneIcon,
  ReframeIcon,
  SettingsIcon,
  SproutIcon,
  SunIcon,
  ToolsIcon,
} from '../../components/icons';
import { Brain } from '../../components/illustrations/Brain';
import { SectionHeader } from '../../components/SectionHeader';
import { currentUser, homework, journalEntryCount, recentEntries, type Homework, type JournalEntry } from '../../data/mock';
import { comingSoon } from '../../lib/comingSoon';
import { colors, fonts, radius, spacing, type } from '../../theme/tokens';

type CardId = 'emotion' | 'thought' | 'cbt';

// `logId` is the matching option in the Emotion Logger; "Other" opens it unselected.
const EMOTIONS: { label: string; logId?: string; icon: ReactNode }[] = [
  { label: 'Calm', logId: 'Content', icon: <LeafIcon size={15} color={colors.greenText} strokeWidth={2} /> },
  { label: 'Anxious', logId: 'Anxious', icon: <BoltIcon size={15} color={colors.pinkStrong} strokeWidth={2} /> },
  { label: 'Sad', logId: 'Sad', icon: <CloudIcon size={15} color={colors.skyStrong} strokeWidth={2} /> },
  { label: 'Hopeful', logId: 'Hopeful', icon: <SunIcon size={15} color={colors.amber} strokeWidth={2} /> },
  { label: 'Other', icon: <DotsIcon size={15} color={colors.textSecondary} /> },
];

const CBT_STEPS = ['Situation', 'Thought', 'Reframe'];

export default function HomeScreen() {
  // Only one card is expanded at a time; the others keep their closed anatomy.
  const [openCard, setOpenCard] = useState<CardId | null>('emotion');
  const [emotion, setEmotion] = useState<string | null>(null);

  const toggle = (id: CardId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenCard((current) => (current === id ? null : id));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Greeting name={currentUser.name} />

        {/* Today */}
        <View style={styles.cards}>
          <ExpandableCard
            title="Log current emotion"
            subtitle="Take a moment to check in."
            tone={colors.pink}
            glyph={<Brain width={44} />}
            open={openCard === 'emotion'}
            onToggle={() => toggle('emotion')}
          >
            <Text style={styles.prompt}>What are you noticing right now?</Text>
            <View style={styles.chips} accessibilityRole="radiogroup">
              {EMOTIONS.map((e) => (
                <Chip
                  key={e.label}
                  label={e.label}
                  icon={e.icon}
                  selected={emotion === e.label}
                  onPress={() => setEmotion(emotion === e.label ? null : e.label)}
                />
              ))}
            </View>
            <PrimaryButton
              title="Start"
              layout="spread"
              onPress={() => {
                const logId = EMOTIONS.find((e) => e.label === emotion)?.logId;
                router.push({ pathname: '/log-emotion', params: logId ? { emotion: logId } : {} });
              }}
            />
          </ExpandableCard>

          <ExpandableCard
            title="Log a thought"
            subtitle="What’s on your mind?"
            tone={colors.paleGreen}
            glyph={<GlyphCircle icon={<SproutIcon size={22} color={colors.greenText} />} />}
            open={openCard === 'thought'}
            onToggle={() => toggle('thought')}
          >
            <Text style={styles.description}>Map your thoughts, spot patterns and reframe.</Text>
            <PrimaryButton title="Start" layout="spread" onPress={() => comingSoon('Log a thought')} />
          </ExpandableCard>

          <ExpandableCard
            title="New CBT thought record"
            subtitle="Situation, thought, reframe."
            tone={colors.lavender}
            glyph={<GlyphCircle icon={<ReframeIcon size={22} color={colors.lavenderStrong} />} />}
            open={openCard === 'cbt'}
            onToggle={() => toggle('cbt')}
          >
            <Text style={styles.description}>
              Map an automatic thought, spot cognitive distortions, and write a rational reframe.
            </Text>
            <View style={styles.steps}>
              {CBT_STEPS.map((step, i) => (
                <View key={step} style={styles.stepItem}>
                  {i > 0 && <ArrowRightIcon size={14} color={colors.textSecondary} />}
                  <Chip label={step} />
                </View>
              ))}
            </View>
            <PrimaryButton title="Start" layout="spread" onPress={() => comingSoon('CBT thought record')} />
          </ExpandableCard>
        </View>

        {/* Homework */}
        <View style={styles.section}>
          <SectionHeader
            title="Assigned homework"
            badge={homework.length > 0 ? `${homework.length} pending` : undefined}
          />
          {homework.length > 0 ? (
            homework.map((hw) => <HomeworkCard key={hw.id} homework={hw} />)
          ) : (
            <EmptyCard text="No homework right now. Your therapist’s tasks will appear here." />
          )}
        </View>

        {/* Recent entries */}
        <View style={styles.section}>
          <SectionHeader
            title="Recent entries"
            action={{ title: `View all (${journalEntryCount})`, onPress: () => router.push('/journal') }}
          />
          {recentEntries.length > 0 ? (
            recentEntries.map((entry) => <EntryCard key={entry.id} entry={entry} />)
          ) : (
            <EmptyCard text="Your journal entries will appear here." />
          )}
        </View>

        {/* Shortcuts */}
        <View style={styles.grid}>
          <Shortcut
            title="Journal"
            subtitle="Write & process"
            tone={colors.paleGreen}
            icon={<BookIcon size={18} color={colors.greenText} />}
            href="/journal"
          />
          <Shortcut
            title="Tasks"
            subtitle="View homework"
            tone={colors.lavender}
            icon={<ClipboardCheckIcon size={18} color={colors.lavenderStrong} />}
            href="/tasks"
          />
          <Shortcut
            title="Tools"
            subtitle="Helpful resources"
            tone={colors.skyBlue}
            icon={<ToolsIcon size={18} color={colors.skyStrong} />}
            href="/tools"
          />
          <Shortcut
            title="Settings"
            subtitle="Your preferences"
            tone={colors.pink}
            icon={<SettingsIcon size={18} color={colors.pinkText} />}
            href="/settings"
          />
        </View>

        <View style={styles.quote}>
          <SproutIcon size={20} color={colors.greenText} />
          <Text style={styles.quoteText}>“Progress, not perfection.”</Text>
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
          Hello, {name}
        </Text>
        <Text style={styles.helloSub}>A softer space for today</Text>
      </View>
      <Pressable
        onPress={() => router.push('/crisis')}
        accessibilityRole="button"
        accessibilityLabel="Crisis support"
        accessibilityHint="Opens crisis lines and a grounding exercise"
        hitSlop={6}
        style={({ pressed }) => [styles.crisis, pressed && { opacity: 0.8 }]}
      >
        <PhoneIcon size={15} color={colors.pinkText} strokeWidth={2} />
        <Text style={styles.crisisText}>Crisis</Text>
      </Pressable>
    </View>
  );
}

function GlyphCircle({ icon }: { icon: ReactNode }) {
  return <View style={styles.glyphCircle}>{icon}</View>;
}

function HomeworkCard({ homework: hw }: { homework: Homework }) {
  return (
    <View style={styles.surfaceCard}>
      <View style={styles.hwTop}>
        {hw.priority === 'highest' && (
          <View style={styles.priority}>
            <Text style={styles.priorityText}>Highest priority</Text>
          </View>
        )}
        <View style={styles.due}>
          <ClockIcon size={13} color={colors.textSecondary} />
          <Text style={styles.meta}>{hw.due}</Text>
        </View>
      </View>

      <Text style={styles.cardTitle}>{hw.title}</Text>

      <View style={styles.assigned}>
        <View style={styles.initials}>
          <Text style={styles.initialsText}>{hw.assignedBy.initials}</Text>
        </View>
        <Text style={styles.meta}>Assigned by {hw.assignedBy.name}</Text>
      </View>

      <Text style={styles.cardBody}>
        {hw.description.map((seg, i) => (
          <Text key={i} style={seg.bold && styles.bold}>
            {seg.text}
          </Text>
        ))}
      </Text>

      <PrimaryButton title="Start task" compact onPress={() => comingSoon(hw.title)} />
    </View>
  );
}

function EntryCard({ entry }: { entry: JournalEntry }) {
  return (
    <Pressable
      onPress={() => comingSoon(entry.title)}
      accessibilityRole="button"
      style={({ pressed }) => [styles.surfaceCard, styles.entry, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.date}>
        <Text style={styles.dateText}>{entry.date}</Text>
      </View>
      <View style={styles.entryBody}>
        <View style={styles.entryMeta}>
          <BoltIcon size={13} color={colors.pinkStrong} strokeWidth={2} />
          <Text style={styles.meta} numberOfLines={1}>
            {entry.emotion.label} · {entry.emotion.intensity}/10
            {entry.thought ? ` · ${entry.thought}` : ''}
          </Text>
        </View>
        <Text style={styles.cardTitle}>{entry.title}</Text>
        <Text style={styles.cardBody} numberOfLines={2}>
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

type ShortcutProps = {
  title: string;
  subtitle: string;
  tone: string;
  icon: ReactNode;
  href?: Href;
  onPress?: () => void;
};

function Shortcut({ title, subtitle, tone, icon, href, onPress }: ShortcutProps) {
  return (
    <Pressable
      onPress={onPress ?? (() => href && router.push(href))}
      accessibilityRole="button"
      style={({ pressed }) => [styles.shortcut, pressed && { opacity: 0.85 }]}
    >
      <View style={[styles.shortcutIcon, { backgroundColor: tone }]}>{icon}</View>
      <View style={styles.shortcutText}>
        <Text style={styles.shortcutTitle}>{title}</Text>
        <Text style={styles.meta}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <View style={[styles.surfaceCard, styles.empty]}>
      <Text style={styles.cardBody}>{text}</Text>
    </View>
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

  // Greeting
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.paleGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  greetingText: {
    flex: 1,
  },
  hello: {
    ...type.heading,
    color: colors.textPrimary,
  },
  helloSub: {
    ...type.caption,
    fontSize: 13,
    color: colors.textSecondary,
  },
  crisis: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 36,
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

  // Today cards
  cards: {
    gap: spacing.md,
  },
  prompt: {
    ...type.label,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  description: {
    ...type.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  steps: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  glyphCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Sections
  section: {
    gap: spacing.md,
  },
  surfaceCard: {
    padding: spacing.lg,
    gap: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  empty: {
    alignItems: 'center',
  },
  cardTitle: {
    ...type.button,
    fontSize: 16,
    lineHeight: 21,
    color: colors.textPrimary,
  },
  cardBody: {
    ...type.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  bold: {
    fontFamily: fonts.semibold,
    color: colors.textPrimary,
  },
  meta: {
    ...type.caption,
    color: colors.textSecondary,
    flexShrink: 1,
  },

  // Homework
  hwTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  priority: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.pinkSoft,
  },
  priorityText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    letterSpacing: 0.3,
    color: colors.pinkText,
  },
  due: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  assigned: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  initials: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.paleGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    color: colors.greenText,
  },

  // Entries
  entry: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  date: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.lavenderSoft,
  },
  dateText: {
    ...type.label,
    fontSize: 12,
    color: colors.lavenderStrong,
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

  // Shortcuts
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  shortcut: {
    flexBasis: '47%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  shortcutIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutText: {
    flex: 1,
  },
  shortcutTitle: {
    ...type.label,
    fontSize: 14,
    color: colors.textPrimary,
  },

  // Quote
  quote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.greenSoft,
  },
  quoteText: {
    fontFamily: fonts.italic,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
