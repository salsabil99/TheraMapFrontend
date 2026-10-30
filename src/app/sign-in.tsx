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
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandBar } from '../components/BrandBar';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { HeroCard } from '../components/HeroCard';
import {
  AppleIcon,
  FolderPlusIcon,
  GoogleIcon,
  LockIcon,
  MailIcon,
  ShieldIcon,
  UserIcon,
} from '../components/icons';
import { SegmentedControl } from '../components/SegmentedControl';
import { TextField } from '../components/TextField';
import { comingSoon } from '../lib/comingSoon';
import { colors, spacing, type } from '../theme/tokens';

type Role = 'client' | 'provider';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInScreen() {
  const [role, setRole] = useState<Role>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInputInstance>(null);

  const handleSignIn = () => {
    const next: typeof errors = {};
    if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Enter your password.';
    setErrors(next);
    if (next.email || next.password) return;

    setLoading(true);
    // TODO: replace with the real auth call.
    setTimeout(() => {
      setLoading(false);
      comingSoon(role === 'client' ? 'Client Space' : 'Provider Portal');
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <BrandBar />
          </View>

          <HeroCard
            overline="Welcome to TheraMap"
            title="A softer space for you."
            description="Mindful cognitive journaling & private therapeutic reflection."
          />

          <SegmentedControl<Role>
            value={role}
            onChange={setRole}
            segments={[
              { value: 'client', label: 'Client Space', icon: (c) => <UserIcon size={16} color={c} /> },
              { value: 'provider', label: 'Provider Portal', icon: (c) => <FolderPlusIcon size={16} color={c} /> },
            ]}
          />

          {/* Form */}
          <View style={styles.form}>
            <TextField
              label="Email address"
              placeholder="you@example.com"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
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
            <TextField
              ref={passwordRef}
              label="Password"
              placeholder="Your password"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
              }}
              error={errors.password}
              icon={(c) => <LockIcon size={18} color={c} />}
              labelAction={{ title: 'Forgot Password?', onPress: () => comingSoon('Forgot password') }}
              secure
              autoComplete="password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={handleSignIn}
            />
          </View>

          <PrimaryButton
            title={role === 'client' ? 'Sign In to your map' : 'Sign In to Provider Portal'}
            onPress={handleSignIn}
            loading={loading}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <SecondaryButton title="Apple" icon={<AppleIcon size={16} />} onPress={() => comingSoon('Sign in with Apple')} />
            <SecondaryButton title="Google" icon={<GoogleIcon size={16} />} onPress={() => comingSoon('Sign in with Google')} />
          </View>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don’t have an account? </Text>
            <Pressable onPress={() => router.push('/create-account')} hitSlop={8} accessibilityRole="link">
              <Text style={styles.signupLink}>Create account</Text>
            </Pressable>
          </View>

          <Text style={styles.footerText}>
            <ShieldIcon size={11} color={colors.textMuted} />
            {'  '}Private by default. Only entries you explicitly choose are shared.
          </Text>
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
    gap: spacing.xl,
  },
  topBar: {
    marginBottom: spacing.xs,
  },
  form: {
    gap: spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...type.caption,
    color: colors.textMuted,
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    ...type.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  signupLink: {
    ...type.label,
    fontSize: 14,
    color: colors.textPrimary,
  },
  footerText: {
    ...type.caption,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
