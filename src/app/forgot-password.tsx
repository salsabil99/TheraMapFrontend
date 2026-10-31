import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OutlineButton, PrimaryButton } from '../components/Button';
import { MailHeartIcon, MailIcon } from '../components/icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { TextField } from '../components/TextField';
import { colors, fonts, radius, spacing, type } from '../theme/tokens';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  // Pre-filled with whatever was typed on Sign In.
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email ?? '');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const send = () => {
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setLoading(true);
    // TODO: call the password-reset endpoint.
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
  };

  const backToSignIn = () => (router.canGoBack() ? router.back() : router.replace('/sign-in'));

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ScreenHeader title="Reset password" />

          {sent ? (
            <View style={styles.sent} accessibilityLiveRegion="polite">
              <View style={styles.illustration}>
                <MailHeartIcon size={40} />
              </View>
              <Text style={styles.title} accessibilityRole="header">
                Check your inbox
              </Text>
              <Text style={styles.body}>
                If an account exists for <Text style={styles.strong}>{email.trim()}</Text>, we’ve sent a link to reset
                your password. It may take a few minutes to arrive.
              </Text>
              <PrimaryButton title="Back to sign in" onPress={backToSignIn} />
              <OutlineButton title="Use a different email" onPress={() => setSent(false)} />
            </View>
          ) : (
            <>
              <View style={styles.intro}>
                <Text style={styles.title} accessibilityRole="header">
                  Forgot your password?
                </Text>
                <Text style={styles.body}>
                  Enter the email you signed up with and we’ll send you a link to choose a new one.
                </Text>
              </View>
              <TextField
                label="Email address"
                placeholder="you@example.com"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (error) setError(undefined);
                }}
                error={error}
                icon={(c) => <MailIcon size={18} color={c} />}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="send"
                onSubmitEditing={send}
              />
              <PrimaryButton title="Send reset link" onPress={send} loading={loading} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.xxl,
  },
  intro: {
    gap: spacing.sm,
  },
  title: {
    ...type.title,
    fontSize: 26,
    lineHeight: 32,
    color: colors.textPrimary,
  },
  body: {
    ...type.body,
    color: colors.textSecondary,
  },
  strong: {
    fontFamily: fonts.semibold,
    color: colors.textPrimary,
  },
  sent: {
    gap: spacing.lg,
  },
  illustration: {
    width: 80,
    height: 80,
    borderRadius: radius.pill,
    backgroundColor: colors.lavenderSoft,
    borderWidth: 4,
    borderColor: colors.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
