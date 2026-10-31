import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandBar } from '../../components/BrandBar';
import {
  ArrowRightIcon,
  BrainIcon,
  CalendarIcon,
  ChevronDownIcon,
  HeartIcon,
  LockIcon,
  ShareIcon,
  ShieldIcon,
  SparkleIcon,
} from '../../components/icons';
import { BrainMap } from '../../components/illustrations/BrainMap';
import { SectionHeader } from '../../components/SectionHeader';
import { journalEntryCount, recentEntries, weeklySummary, type JournalEntry, type ThoughtPattern } from '../../data/mock';
import { comingSoon } from '../../lib/comingSoon';
import { colors, fonts, radius, shadow, spacing, type } from '../../theme/tokens';

const PAGE_PADDING = spacing.xl;
const CARD_PADDING = spacing.lg;
const MAP_CARD_PADDING = spacing.xl;

const totalOf = (t: ThoughtPattern) => Object.values(t.links).reduce((a, b) => a + b, 0);

export default function JournalScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const mapWidth = Math.min(screenWidth - 2 * PAGE_PADDING - 2 * MAP_CARD_PADDING + 8, 380);

  const { thoughts, records, range, period } = weeklySummary;
  const sortedThoughts = useMemo(() => [...thoughts].sort((a, b) => totalOf(b) - totalOf(a)), [thoughts]);
  const [selectedId, setSelectedId] = useState<string | null>(sortedThoughts[0]?.id ?? null);

  const emotionTotals = useMemo(() => {
    const totals = new Map<string, number>();
    for (const t of thoughts) {
      for (const [emotion, n] of Object.entries(t.links)) totals.set(emotion, (totals.get(emotion) ?? 0) + n);
    }
    return [...totals.entries()].sort((a, b) => b[1] - a[1]);
  }, [thoughts]);
  const [topEmotion, topCount] = emotionTotals[0] ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BrandBar />

        <View style={styles.intro}>
          <Text style={styles.title} accessibilityRole="header">
            Mindmap
          </Text>
          <Text style={styles.subtitle}>The feelings and thoughts in your journal.</Text>
        </View>

        <View style={styles.periodRow}>
          <Pressable
            onPress={() => comingSoon('Change period')}
            accessibilityRole="button"
            accessibilityLabel={`Period: ${period}. Change`}
            style={({ pressed }) => [styles.period, pressed && { opacity: 0.8 }]}
          >
            <CalendarIcon size={18} color={colors.petrol} />
            <Text style={styles.periodText}>{period}</Text>
            <ChevronDownIcon size={16} strokeWidth={2} />
          </Pressable>
          <Text style={styles.rangeText}>{range}</Text>
        </View>

        {/* Weekly brain summary */}
        <View style={styles.mapCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} accessibilityRole="header">
              Weekly brain summary
            </Text>
            <Text style={styles.rangeText}>{records} records</Text>
          </View>
          <View style={styles.columns}>
            <View style={styles.column}>
              <View style={[styles.columnIcon, { backgroundColor: colors.lavenderSoft }]}>
                <BrainIcon size={20} color={colors.lavenderStrong} />
              </View>
              <View style={styles.columnText}>
                <Text style={styles.columnLabel}>Thoughts</Text>
                <Text style={styles.columnHint}>Patterns in your thinking</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={[styles.columnIcon, { backgroundColor: colors.skySoft }]}>
                <HeartIcon size={20} color={colors.skyStrong} />
              </View>
              <View style={styles.columnText}>
                <Text style={styles.columnLabel}>Emotions</Text>
                <Text style={styles.columnHint}>How you’ve been feeling</Text>
              </View>
            </View>
          </View>
          <View style={styles.map}>
            <BrainMap width={mapWidth} thoughts={thoughts} selectedId={selectedId} onSelect={setSelectedId} />
          </View>
        </View>

        {topEmotion && (
          <View style={styles.insight}>
            <View style={styles.insightIcon}>
              <SparkleIcon size={22} color={colors.lavenderStrong} />
            </View>
            <View style={styles.insightDivider} />
            <Text style={styles.insightText}>
              <Text style={styles.insightStrong}>{topEmotion}</Text> was your most recorded emotion: {topCount} of{' '}
              {records} records.
            </Text>
          </View>
        )}

        <View style={[styles.card, styles.stats]}>
          <Stat value={records} label="Records" />
          <Stat value={emotionTotals.length} label="Emotions" />
          <Stat value={thoughts.length} label="Patterns" />
        </View>

        {/* Connected thoughts */}
        <View style={styles.section}>
          <View style={styles.sectionIntro}>
            <SectionHeader title="Connected thoughts" />
            <Text style={styles.muted}>Patterns you tagged in your records. Select one to see it on the map.</Text>
          </View>
          <View style={styles.rows} accessibilityRole="radiogroup">
            {sortedThoughts.map((t) => (
              <ThoughtRow key={t.id} thought={t} selected={t.id === selectedId} onPress={() => setSelectedId(t.id)} />
            ))}
          </View>
        </View>

        {/* Entries */}
        <View style={styles.section}>
          <SectionHeader
            title="From your journal"
            action={{ title: `View all (${journalEntryCount})`, onPress: () => comingSoon('All journal entries') }}
          />
          <View style={styles.card}>
            {recentEntries.map((entry, i) => (
              <EntryRow key={entry.id} entry={entry} first={i === 0} />
            ))}
          </View>
        </View>

        <Text style={styles.noteText}>
          <ShieldIcon size={12} color={colors.textMuted} />
          {'  '}Records are private by default. Only entries you choose are shared.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

function ThoughtRow({ thought, selected, onPress }: { thought: ThoughtPattern; selected: boolean; onPress: () => void }) {
  const breakdown = Object.entries(thought.links)
    .map(([emotion, n]) => `${n} ${emotion.toLowerCase()}`)
    .join(' · ');
  const count = totalOf(thought);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${thought.label}, ${count} records: ${breakdown}`}
      style={[styles.row, selected && styles.rowSelected]}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{thought.label}</Text>
        <Text style={styles.muted}>{breakdown}</Text>
      </View>
      <Text style={styles.rowCount}>{count}</Text>
    </Pressable>
  );
}

function EntryRow({ entry, first }: { entry: JournalEntry; first: boolean }) {
  return (
    <Pressable
      onPress={() => comingSoon(entry.title)}
      accessibilityRole="button"
      style={({ pressed }) => [styles.entry, !first && styles.entryDivider, pressed && { opacity: 0.8 }]}
    >
      <View style={styles.entryText}>
        <Text style={styles.muted}>
          {entry.date} · {entry.emotion.label}
          {entry.thought ? ` · ${entry.thought}` : ''}
        </Text>
        <Text style={styles.rowTitle}>{entry.title}</Text>
        <View style={[styles.privacy, entry.shared && styles.privacyShared]}>
          {entry.shared ? (
            <ShareIcon size={12} color={colors.lavenderStrong} />
          ) : (
            <LockIcon size={12} color={colors.textSecondary} />
          )}
          <Text style={[styles.privacyText, entry.shared && { color: colors.lavenderStrong }]}>
            {entry.shared ? 'Shared with therapist' : 'Private'}
          </Text>
        </View>
      </View>
      <View style={styles.arrow}>
        <ArrowRightIcon size={16} />
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
    paddingHorizontal: PAGE_PADDING,
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
  muted: {
    ...type.caption,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },

  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  period: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    ...shadow.card,
    shadowOpacity: 0.06,
    elevation: 2,
  },
  periodText: {
    ...type.label,
    fontSize: 15,
    marginRight: 2,
    color: colors.textPrimary,
  },
  rangeText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  mapCard: {
    paddingHorizontal: MAP_CARD_PADDING - 4,
    paddingTop: MAP_CARD_PADDING,
    paddingBottom: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadow.card,
    shadowOpacity: 0.06,
    elevation: 2,
  },

  card: {
    padding: CARD_PADDING,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    ...type.title,
    fontSize: 20,
    color: colors.textPrimary,
    paddingHorizontal: 4,
  },
  columns: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  column: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  columnIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnText: {
    flex: 1,
    gap: 1,
  },
  columnLabel: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  columnHint: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 15,
    color: colors.textSecondary,
  },
  map: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },

  insight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lavender,
    backgroundColor: colors.lavenderSoft,
  },
  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lavender,
  },
  insightDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.lavender,
  },
  insightText: {
    ...type.body,
    flex: 1,
    color: colors.textPrimary,
  },
  insightStrong: {
    fontFamily: fonts.bold,
  },

  stats: {
    flexDirection: 'row',
  },
  stat: {
    flex: 1,
    gap: 2,
  },
  statValue: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.textPrimary,
  },

  section: {
    gap: spacing.md,
  },
  sectionIntro: {
    gap: spacing.xs,
  },
  rows: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  rowSelected: {
    borderColor: colors.petrol,
    backgroundColor: colors.lavenderSoft,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.petrol,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.petrol,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    ...type.button,
    color: colors.textPrimary,
  },
  rowCount: {
    fontFamily: fonts.bold,
    fontSize: 26,
    color: colors.textPrimary,
  },

  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  entryDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  entryText: {
    flex: 1,
    gap: 6,
    alignItems: 'flex-start',
  },
  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
  },
  privacyShared: {
    backgroundColor: colors.lavenderSoft,
  },
  privacyText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  arrow: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  noteText: {
    ...type.caption,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    color: colors.textMuted,
  },
});
