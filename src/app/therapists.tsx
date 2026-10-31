import { useMemo, useState } from 'react';
import { LayoutAnimation, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OutlineButton, PrimaryButton } from '../components/Button';
import { Chip } from '../components/Chip';
import { CheckIcon, SearchIcon, SlidersIcon, StarIcon, VerifiedIcon } from '../components/icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { MORE_SPECIALTIES, PRIMARY_SPECIALTIES, therapists, type Therapist } from '../data/therapists';
import { colors, fonts, radius, spacing, type } from '../theme/tokens';

const ALL = 'All';

export default function TherapistsScreen() {
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState(ALL);
  const [showMore, setShowMore] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [requested, setRequested] = useState<string[]>([]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return therapists.filter((t) => {
      if (specialty !== ALL && !t.specialties.includes(specialty)) return false;
      if (availableOnly && t.availability !== 'now') return false;
      if (!q) return true;
      return [t.name, t.focus, ...t.tags].some((s) => s.toLowerCase().includes(q));
    });
  }, [query, specialty, availableOnly]);

  const toggleOpen = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId((current) => (current === id ? null : id));
  };

  const chips = [ALL, ...PRIMARY_SPECIALTIES, ...(showMore ? MORE_SPECIALTIES : [])];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <ScreenHeader title="Find a therapist" />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.search}>
          <SearchIcon size={18} color={colors.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by specialty or name"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            accessibilityLabel="Search by specialty or name"
            returnKeyType="search"
            autoCorrect={false}
          />
          <Pressable
            onPress={() => setAvailableOnly((v) => !v)}
            accessibilityRole="switch"
            accessibilityState={{ checked: availableOnly }}
            accessibilityLabel="Show therapists available now only"
            hitSlop={8}
            style={[styles.filter, availableOnly && styles.filterOn]}
          >
            <SlidersIcon size={18} color={availableOnly ? colors.textOnPetrol : colors.textPrimary} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroller}
          contentContainerStyle={styles.chips}
        >
          {chips.map((c) => (
            <Chip key={c} label={c} selected={specialty === c} onPress={() => setSpecialty(c)} />
          ))}
          <Chip label={showMore ? 'Less' : 'More'} onPress={() => setShowMore((v) => !v)} />
        </ScrollView>

        {availableOnly && (
          <Text style={styles.muted} accessibilityLiveRegion="polite">
            Showing therapists available now
          </Text>
        )}

        {results.length > 0 ? (
          results.map((t) => (
            <TherapistCard
              key={t.id}
              therapist={t}
              open={openId === t.id}
              requested={requested.includes(t.id)}
              onToggle={() => toggleOpen(t.id)}
              onRequest={() => setRequested((r) => [...r, t.id])}
            />
          ))
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No therapists match</Text>
            <Text style={styles.muted}>Try another specialty or clear your search.</Text>
            <OutlineButton
              title="Clear filters"
              onPress={() => {
                setQuery('');
                setSpecialty(ALL);
                setAvailableOnly(false);
              }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

type CardProps = {
  therapist: Therapist;
  open: boolean;
  requested: boolean;
  onToggle: () => void;
  onRequest: () => void;
};

function TherapistCard({ therapist: t, open, requested, onToggle, onRequest }: CardProps) {
  const available = t.availability === 'now';
  return (
    <View style={styles.card}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${t.name}, verified. ${t.focus}. Rated ${t.rating} from ${t.reviews} reviews. ${
          available ? 'Available now' : 'Available next week'
        }`}
        style={styles.cardTop}
      >
        <View style={[styles.avatar, { backgroundColor: colors[t.tone] }]}>
          <Text style={styles.initials}>{t.initials}</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{t.name}</Text>
            <VerifiedIcon size={16} />
          </View>
          <Text style={styles.muted}>{t.focus}</Text>
          <View style={styles.metaRow}>
            <StarIcon size={14} />
            <Text style={styles.rating}>
              {t.rating} <Text style={styles.muted}>({t.reviews})</Text>
            </Text>
            <View style={[styles.availability, available ? styles.availNow : styles.availLater]}>
              <Text style={[styles.availText, { color: available ? colors.greenText : colors.amberText }]}>
                {available ? 'Available now' : 'Next week'}
              </Text>
            </View>
          </View>
          <View style={styles.tags}>
            {t.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </Pressable>

      {open && (
        <View style={styles.details}>
          <Text style={styles.bio}>{t.bio}</Text>
          {requested ? (
            <View style={styles.sent} accessibilityLiveRegion="polite">
              <CheckIcon size={18} color={colors.greenText} strokeWidth={2.5} />
              <Text style={styles.sentText}>
                Request sent. {t.name} will review it. Nothing from your journal is shared.
              </Text>
            </View>
          ) : (
            <PrimaryButton title="Request to connect" onPress={onRequest} />
          )}
        </View>
      )}
    </View>
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
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  muted: {
    ...type.caption,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },

  // Search
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 50,
    paddingLeft: spacing.lg,
    paddingRight: 6,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textPrimary,
  },
  filter: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterOn: {
    backgroundColor: colors.petrol,
  },
  // Bleeds to the screen edges so the row visibly scrolls.
  chipScroller: {
    marginHorizontal: -spacing.xl,
  },
  chips: {
    gap: spacing.sm,
    paddingVertical: 2,
    paddingHorizontal: spacing.xl,
  },

  // Card
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  cardTop: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    ...type.button,
    fontSize: 16,
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  rating: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  availability: {
    marginLeft: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  availNow: {
    backgroundColor: colors.greenSoft,
  },
  availLater: {
    backgroundColor: colors.amberSoft,
  },
  availText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
  },
  tagText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.textPrimary,
  },
  details: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  bio: {
    ...type.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  sent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.greenSoft,
  },
  sentText: {
    ...type.label,
    flex: 1,
    lineHeight: 19,
    color: colors.greenText,
  },

  // Empty
  empty: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    ...type.button,
    color: colors.textPrimary,
  },
});
