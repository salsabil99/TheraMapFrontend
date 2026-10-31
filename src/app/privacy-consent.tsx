import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OutlineButton, PrimaryButton } from '../components/Button';
import { Checkbox, checkboxStyles } from '../components/Checkbox';
import { EyeOffIcon, LockIcon, ShareIcon } from '../components/icons';
import { PRIVACY_POLICY_VERSION } from '../lib/privacy';
import { colors, radius, spacing, type } from '../theme/tokens';

const PRINCIPLES = [
  {
    title: 'Private by default',
    body: 'New emotion and thought records are visible only to you. Connecting to a therapist never shares anything.',
    icon: <LockIcon size={18} color={colors.greenText} strokeWidth={2} />,
    tone: colors.paleGreen,
  },
  {
    title: 'Share only what you select',
    body: 'An accepted, verified therapist sees only the selected record’s fields, timestamp, your display name and sharing status. They cannot see other titles or private record counts.',
    icon: <ShareIcon size={18} color={colors.lavenderStrong} strokeWidth={2} />,
    tone: colors.lavender,
  },
  {
    title: 'You stay in control',
    body: 'Revoke an entry or disconnect anytime. Access stops immediately; only legally required minimal information may be retained, if applicable.',
    icon: <EyeOffIcon size={18} color={colors.skyStrong} strokeWidth={2} />,
    tone: colors.skyBlue,
  },
];

export default function PrivacyConsentScreen() {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    // TODO: record acceptance of PRIVACY_POLICY_VERSION with a timestamp on the account.
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={styles.eyebrow}>Getting started · Privacy</Text>
          <Text style={styles.title} accessibilityRole="header">
            Your words. Your choice.
          </Text>
        </View>

        <View style={styles.cards}>
          {PRINCIPLES.map((p) => (
            <View key={p.title} style={styles.card}>
              <View style={[styles.icon, { backgroundColor: p.tone }]}>{p.icon}</View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{p.title}</Text>
                <Text style={styles.cardBody}>{p.body}</Text>
              </View>
            </View>
          ))}
        </View>

        <Checkbox checked={accepted} onChange={setAccepted}>
          I understand and accept the <Text style={checkboxStyles.strong}>Privacy Policy v{PRIVACY_POLICY_VERSION}</Text>.
        </Checkbox>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title="Accept privacy & continue" showArrow={false} onPress={handleAccept} disabled={!accepted} />
        <OutlineButton title="Read full privacy policy" onPress={() => router.push('/privacy-policy')} />
        <Text style={styles.note}>Account administrators see metadata, never journal content.</Text>
      </View>
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },
  intro: {
    gap: spacing.xs,
  },
  eyebrow: {
    ...type.overline,
    textTransform: 'uppercase',
    color: colors.greenText,
  },
  title: {
    ...type.title,
    fontSize: 26,
    lineHeight: 32,
    color: colors.textPrimary,
  },
  cards: {
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
    gap: 4,
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
    color: colors.textSecondary,
  },
});
