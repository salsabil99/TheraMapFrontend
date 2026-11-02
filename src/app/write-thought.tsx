import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/Button';
import { LightbulbIcon, LockIcon } from '../components/icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { comingSoon } from '../lib/comingSoon';
import { colors, fonts, radius, spacing, type } from '../theme/tokens';

const STEPS = ['Situation & thought', 'Emotions', 'Evidence', 'Reframe'] as const;
const CURRENT_STEP = 0;

export default function WriteThoughtScreen() {
  const [situation, setSituation] = useState('');
  const [thought, setThought] = useState('');
  const canContinue = situation.trim().length > 0 && thought.trim().length > 0;

  const handleSaveDraft = () => {
    // TODO: persist the draft once the API exists.
    Alert.alert('Draft saved', 'Kept private. You can finish it later.');
  };

  const handleContinue = () => {
    // TODO: route to step 2 once the Emotions screen exists.
    comingSoon(STEPS[CURRENT_STEP + 1]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <ScreenHeader
          title="Write a Thought"
          action={{ title: 'Save draft', onPress: handleSaveDraft }}
          onBack={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
        />
        <Text style={styles.stepLabel}>
          Step {CURRENT_STEP + 1} of {STEPS.length} · {STEPS[CURRENT_STEP]}
        </Text>
        <View
          style={styles.progress}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 1, max: STEPS.length, now: CURRENT_STEP + 1 }}
        >
          {STEPS.map((s, i) => (
            <View key={s} style={[styles.segment, i <= CURRENT_STEP && styles.segmentActive]} />
          ))}
        </View>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.intro}>
            <Text style={styles.title} accessibilityRole="header">
              What’s on your mind?
            </Text>
            <Text style={styles.subtitle}>Start with what happened and the thought that followed.</Text>
            <View style={styles.private}>
              <LockIcon size={14} color={colors.textSecondary} />
              <Text style={styles.privateText}>Private by default</Text>
            </View>
          </View>

          <TextArea
            label="What happened?"
            hint="Describe the situation briefly."
            placeholder="e.g. My friend hasn’t replied to my message."
            value={situation}
            onChangeText={setSituation}
          />

          <TextArea
            label="What went through your mind?"
            hint="Write the thought in your own words."
            placeholder="e.g. Maybe I did something wrong."
            value={thought}
            onChangeText={setThought}
          />

          <View style={styles.tip}>
            <LightbulbIcon size={20} color={colors.teal} />
            <Text style={styles.tipText}>You don’t need to solve it yet. Just notice the thought.</Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton title="Continue" onPress={handleContinue} disabled={!canContinue} showArrow={false} />
          <Text style={styles.footerHint}>Next: {STEPS[CURRENT_STEP + 1]}</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function TextArea({ label, hint, ...inputProps }: TextInputProps & { label: string; hint: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <View>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldHint}>{hint}</Text>
      </View>
      <TextInput
        multiline
        textAlignVertical="top"
        accessibilityLabel={label}
        accessibilityHint={hint}
        placeholderTextColor={colors.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, focused && styles.inputFocused]}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  stepLabel: {
    ...type.caption,
    fontSize: 13,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  progress: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  segmentActive: {
    backgroundColor: colors.petrol,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.xxl,
  },
  intro: {
    gap: spacing.sm,
  },
  title: {
    ...type.title,
    fontSize: 28,
    lineHeight: 34,
    color: colors.textPrimary,
  },
  subtitle: {
    ...type.body,
    color: colors.textSecondary,
  },
  private: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs,
  },
  privateText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  field: {
    gap: spacing.sm,
  },
  fieldLabel: {
    ...type.heading,
    fontSize: 17,
    color: colors.textPrimary,
  },
  fieldHint: {
    ...type.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  input: {
    minHeight: 96,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  inputFocused: {
    borderColor: colors.petrol,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.tealSoft,
  },
  tipText: {
    ...type.body,
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  footer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  footerHint: {
    ...type.caption,
    fontSize: 13,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});
