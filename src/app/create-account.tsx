import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type TextInputInstance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/Button';
import { Checkbox, checkboxStyles } from '../components/Checkbox';
import { LockIcon, MailIcon, UserIcon } from '../components/icons';
import { isStrongPassword, PasswordRequirements } from '../components/PasswordRequirements';
import { ScreenHeader } from '../components/ScreenHeader';
import { TextField } from '../components/TextField';
import { comingSoon } from '../lib/comingSoon';
import { colors, spacing, type } from '../theme/tokens';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  terms?: string;
};

export default function CreateAccountScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedNotCrisis, setAcceptedNotCrisis] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<TextInputInstance>(null);
  const passwordRef = useRef<TextInputInstance>(null);

  const clearError = (key: keyof Errors) => {
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleContinue = () => {
    const next: Errors = {};
    if (!name.trim()) next.name = 'Tell us what to call you.';
    if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Enter a valid email address.';
    if (!isStrongPassword(password)) next.password = 'Your password doesn’t meet all the requirements yet.';
    if (!acceptedTerms || !acceptedNotCrisis) next.terms = 'Please confirm both statements to continue.';
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    setLoading(true);
    // TODO: create the account, then go to step 2 (verification).
    setTimeout(() => {
      setLoading(false);
      comingSoon('Verification');
    }, 800);
  };

  const goToSignIn = () => (router.canGoBack() ? router.back() : router.replace('/sign-in'));

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader badge="Step 1 of 2" />

          <View style={styles.intro}>
            <Text style={styles.title} accessibilityRole="header">
              Create your private space
            </Text>
            <Text style={styles.subtitle}>
              Set up your encrypted sanctuary for mindful thoughts and emotions.
            </Text>
          </View>

          <View style={styles.form}>
            <TextField
              label="Preferred name or nickname"
              placeholder="What should we call you?"
              value={name}
              onChangeText={(t) => {
                setName(t);
                clearError('name');
              }}
              error={errors.name}
              icon={(c) => <UserIcon size={18} color={c} />}
              autoCapitalize="words"
              autoComplete="nickname"
              textContentType="nickname"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
            <TextField
              ref={emailRef}
              label="Email address"
              placeholder="you@example.com"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                clearError('email');
              }}
              error={errors.email}
              icon={(c) => <MailIcon size={18} color={c} />}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            <View style={styles.passwordGroup}>
              <TextField
                ref={passwordRef}
                label="Create a strong password"
                placeholder="Choose a password"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  clearError('password');
                }}
                error={errors.password}
                icon={(c) => <LockIcon size={18} color={c} />}
                secure
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="done"
              />
              <PasswordRequirements password={password} />
            </View>
          </View>

          <View style={styles.consents}>
            <Checkbox
              checked={acceptedTerms}
              onChange={(v) => {
                setAcceptedTerms(v);
                clearError('terms');
              }}
              error={!!errors.terms}
            >
              I agree to the <Text style={checkboxStyles.strong}>Terms of Service</Text> and have reviewed the{' '}
              <Text style={checkboxStyles.strong}>Privacy Policy</Text>. My reflections remain encrypted and private.
            </Checkbox>
            <Checkbox
              checked={acceptedNotCrisis}
              onChange={(v) => {
                setAcceptedNotCrisis(v);
                clearError('terms');
              }}
              error={!!errors.terms}
            >
              I understand that theramap is a self-reflection journaling companion,{' '}
              <Text style={checkboxStyles.strong}>not an emergency crisis intervention service</Text>.
            </Checkbox>
            {!!errors.terms && <Text style={styles.error}>{errors.terms}</Text>}
          </View>

          <PrimaryButton title="Continue to Verification" onPress={handleContinue} loading={loading} />

          <View style={styles.signinRow}>
            <Text style={styles.signinText}>Already have an account? </Text>
            <Pressable onPress={goToSignIn} hitSlop={8} accessibilityRole="link">
              <Text style={styles.signinLink}>Sign In</Text>
            </Pressable>
          </View>
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
    paddingBottom: spacing.xxxl,
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
  subtitle: {
    ...type.body,
    color: colors.textSecondary,
  },
  form: {
    gap: spacing.lg,
  },
  passwordGroup: {
    gap: spacing.sm,
  },
  consents: {
    gap: spacing.lg,
  },
  error: {
    ...type.caption,
    color: colors.danger,
  },
  signinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinText: {
    ...type.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  signinLink: {
    ...type.label,
    fontSize: 14,
    color: colors.textPrimary,
  },
});
