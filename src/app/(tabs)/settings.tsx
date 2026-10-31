import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandBar } from '../../components/BrandBar';
import {
  BellIcon,
  ChevronRightIcon,
  ClipboardCheckIcon,
  HeartIcon,
  LockIcon,
  LogOutIcon,
  SearchIcon,
  ShareIcon,
  ShieldIcon,
} from '../../components/icons';
import { currentUser } from '../../data/mock';
import { PRIVACY_POLICY_VERSION } from '../../lib/privacy';
import { colors, fonts, radius, spacing, type } from '../../theme/tokens';

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  // TODO: load and save these preferences with the account once the API exists.
  const [shareByDefault, setShareByDefault] = useState(false);
  const [sharePatterns, setSharePatterns] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [taskReminders, setTaskReminders] = useState(true);

  const signOut = () => {
    // TODO: clear the session once real auth exists.
    router.dismissAll();
    router.replace('/sign-in');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BrandBar />
        <Text style={styles.title} accessibilityRole="header">
          Settings
        </Text>

        {/* Profile */}
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{currentUser.name.charAt(0)}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.profileName}>{currentUser.name}</Text>
            <Text style={styles.muted}>{currentUser.email}</Text>
          </View>
        </View>

        <Group title="Account">
          <Row
            icon={<HeartIcon size={18} />}
            label="Your therapist"
            detail={`${currentUser.therapist.name} · ${currentUser.therapist.since}`}
          />
          <Row
            icon={<SearchIcon size={18} />}
            label="Find a therapist"
            detail="Browse verified clinicians"
            onPress={() => router.push('/therapists')}
          />
        </Group>

        <Group
          title="Privacy & sharing"
          note="Private by default. Nothing is shared automatically, and you can stop sharing at any time."
        >
          <Row
            icon={<ShareIcon size={18} />}
            label="Share new entries with my therapist"
            detail="Off: you choose per entry"
            toggle={{ value: shareByDefault, onChange: setShareByDefault }}
          />
          <Row
            icon={<LockIcon size={18} />}
            label="Show my emotion patterns"
            detail="Weekly mindmap summary only"
            toggle={{ value: sharePatterns, onChange: setSharePatterns }}
          />
          <Row
            icon={<ShieldIcon size={18} />}
            label="Privacy Policy"
            detail={`Version ${PRIVACY_POLICY_VERSION}`}
            onPress={() => router.push('/privacy-policy')}
          />
        </Group>

        <Group title="Notifications">
          <Row
            icon={<BellIcon size={18} />}
            label="Daily check-in reminder"
            detail={dailyReminder ? 'Every day at 8:00 PM' : 'Off'}
            toggle={{ value: dailyReminder, onChange: setDailyReminder }}
          />
          <Row
            icon={<ClipboardCheckIcon size={18} />}
            label="Task reminders"
            detail="When your therapist assigns or a task is due"
            toggle={{ value: taskReminders, onChange: setTaskReminders }}
          />
        </Group>

        <Group title="Support">
          <Row
            icon={<HeartIcon size={18} color={colors.pinkText} />}
            label="Crisis & safety"
            detail="Helplines and a grounding exercise"
            onPress={() => router.push('/crisis')}
          />
        </Group>

        <Pressable
          onPress={signOut}
          accessibilityRole="button"
          style={({ pressed }) => [styles.signOut, pressed && { backgroundColor: colors.pinkSoft }]}
        >
          <LogOutIcon size={18} color={colors.pinkText} strokeWidth={2} />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>

        <Text style={styles.version}>TheraMap {APP_VERSION}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle} accessibilityRole="header">
        {title}
      </Text>
      <View style={styles.card}>{children}</View>
      {!!note && <Text style={styles.note}>{note}</Text>}
    </View>
  );
}

type RowProps = {
  icon: ReactNode;
  label: string;
  detail?: string;
  value?: string;
  onPress?: () => void;
  toggle?: { value: boolean; onChange: (v: boolean) => void };
};

// One settings line: a link (chevron), a switch, or plain information.
function Row({ icon, label, detail, value, onPress, toggle }: RowProps) {
  const content = (
    <>
      <View style={styles.rowIcon}>{icon}</View>
      <View style={styles.flex}>
        <Text style={styles.rowLabel}>{label}</Text>
        {!!detail && <Text style={styles.muted}>{detail}</Text>}
      </View>
      {!!value && (
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
      )}
      {toggle && (
        <Switch
          value={toggle.value}
          onValueChange={toggle.onChange}
          trackColor={{ false: colors.borderStrong, true: colors.petrol }}
          thumbColor={colors.surface}
          // react-native-web uses its own prop for the "on" thumb.
          {...({ activeThumbColor: colors.surface } as object)}
          ios_backgroundColor={colors.borderStrong}
          accessibilityLabel={label}
        />
      )}
      {onPress && <ChevronRightIcon size={18} color={colors.textSecondary} />}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={detail ? `${label}. ${detail}` : label}
        style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.background }]}
      >
        {content}
      </Pressable>
    );
  }
  return <View style={styles.row}>{content}</View>;
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
  flex: {
    flex: 1,
  },
  title: {
    ...type.title,
    fontSize: 30,
    lineHeight: 36,
    color: colors.textPrimary,
  },
  muted: {
    ...type.caption,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },

  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.paleGreen,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.semibold,
    fontSize: 20,
    color: colors.textPrimary,
  },
  profileName: {
    ...type.heading,
    fontSize: 18,
    color: colors.textPrimary,
  },

  group: {
    gap: spacing.sm,
  },
  groupTitle: {
    ...type.overline,
    textTransform: 'uppercase',
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  note: {
    ...type.caption,
    color: colors.textSecondary,
    marginHorizontal: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 60,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    ...type.label,
    fontSize: 15,
    color: colors.textPrimary,
  },
  value: {
    ...type.caption,
    fontSize: 13,
    maxWidth: '45%',
    color: colors.textSecondary,
  },

  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.pink,
    backgroundColor: colors.surface,
  },
  signOutText: {
    ...type.button,
    color: colors.pinkText,
  },
  version: {
    ...type.caption,
    textAlign: 'center',
    color: colors.textMuted,
  },
});
