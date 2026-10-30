import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OutlineButton, PrimaryButton } from '../components/Button';
import { MailHeartIcon, RefreshIcon, ShieldIcon } from '../components/icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { colors, fonts, radius, spacing, type } from '../theme/tokens';

const RESEND_COOLDOWN_SECONDS = 30;

const STEPS = [
  'Open the confirmation email in your mail app',
  'Tap the secure link to confirm your ownership',
  'Return here to step into your visual mindmap',
];

export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [checking, setChecking] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const handleVerified = () => {
    setChecking(true);
    // TODO: ask the API whether the email is verified before continuing.
    setTimeout(() => {
      setChecking(false);
      router.replace('/onboarding');
    }, 800);
  };

  const handleResend = () => {
    // TODO: call the resend-verification endpoint.
    setCooldown(RESEND_COOLDOWN_SECONDS);
  };

  const changeEmail = () => (router.canGoBack() ? router.back() : router.replace('/create-account'));

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Verification"
          badge="Encrypted"
          badgeIcon={<ShieldIcon size={12} color={colors.textSecondary} />}
        />

        <View style={styles.intro}>
          <View style={styles.illustrationHalo}>
            <View style={styles.illustration}>
              <MailHeartIcon size={44} />
            </View>
          </View>
          <Text style={styles.title} accessibilityRole="header">
            Check your inbox
          </Text>
          <Text style={styles.subtitle}>
            We’ve sent a secure verification email to{'\n'}
            <Text style={styles.email}>{email || 'your email address'}</Text>
          </Text>
        </View>

        <View style={styles.steps}>
          {STEPS.map((step, i) => (
            <View key={step} style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <PrimaryButton title="I’ve verified my email" onPress={handleVerified} loading={checking} />

          <View style={styles.resend}>
            <Text style={styles.muted}>Didn’t receive the email?</Text>
            <OutlineButton
              title={cooldown > 0 ? `Resend in 0:${String(cooldown).padStart(2, '0')}` : 'Resend verification email'}
              icon={<RefreshIcon size={16} color={colors.textPrimary} strokeWidth={2} />}
              onPress={handleResend}
              disabled={cooldown > 0}
            />
            {cooldown > 0 && (
              <Text style={styles.sentNote} accessibilityLiveRegion="polite">
                A new email is on its way. Check your spam folder too.
              </Text>
            )}
          </View>

          <View style={styles.changeRow}>
            <Text style={styles.muted}>Wrong email address? </Text>
            <Pressable onPress={changeEmail} hitSlop={8} accessibilityRole="link">
              <Text style={styles.link}>Change email</Text>
            </Pressable>
          </View>
        </View>
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
    paddingBottom: spacing.xxxl,
    gap: spacing.xxl,
  },
  intro: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  illustrationHalo: {
    padding: 6,
    marginBottom: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.lavender,
  },
  illustration: {
    width: 92,
    height: 92,
    borderRadius: radius.pill,
    backgroundColor: colors.lavenderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...type.title,
    fontSize: 26,
    lineHeight: 32,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...type.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  email: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  steps: {
    gap: spacing.md,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    ...type.label,
    fontSize: 12,
    color: colors.textPrimary,
  },
  stepText: {
    ...type.body,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  actions: {
    gap: spacing.xl,
  },
  resend: {
    gap: spacing.sm,
    alignItems: 'stretch',
  },
  muted: {
    ...type.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sentNote: {
    ...type.caption,
    color: colors.success,
    textAlign: 'center',
  },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    ...type.label,
    fontSize: 14,
    color: colors.textPrimary,
  },
});
