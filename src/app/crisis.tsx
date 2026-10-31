import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, LayoutAnimation, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatIcon, CheckIcon, ChevronDownIcon, CloseIcon, GlobeIcon, PhoneIcon } from '../components/icons';
import { crisisCalls, crisisTexts, groundingSteps, helplineDirectory, type CrisisText } from '../data/crisis';
import { colors, fonts, radius, spacing, type } from '../theme/tokens';

// Minimum touch target for every action on this screen.
const TARGET = 56;

async function open(url: string, fallback: string) {
  try {
    await Linking.openURL(url);
  } catch {
    // e.g. a tablet without a phone or SMS app.
    Alert.alert('Couldn’t open this on your device', fallback);
  }
}

const call = (number: string) => open(`tel:${number}`, `Please dial ${number} from any phone.`);

function text({ number, body }: CrisisText) {
  // iOS uses "&body=", Android "?body=".
  const separator = Platform.OS === 'ios' ? '&' : '?';
  const url = body ? `sms:${number}${separator}body=${encodeURIComponent(body)}` : `sms:${number}`;
  return open(url, body ? `Text ${body} to ${number} from any phone.` : `Text ${number} from any phone.`);
}

function exit() {
  if (router.canGoBack()) router.back();
  else router.replace('/home');
}

export default function CrisisScreen() {
  const [groundingOpen, setGroundingOpen] = useState(false);
  const [done, setDone] = useState<number[]>([]);

  const toggleGrounding = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setGroundingOpen((o) => !o);
  };

  const toggleStep = (count: number) =>
    setDone((d) => (d.includes(count) ? d.filter((c) => c !== count) : [...d, count]));

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']} accessibilityViewIsModal>
      <View style={styles.topBar}>
        <Text style={styles.eyebrow}>Crisis & safety</Text>
        <Pressable
          onPress={exit}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={8}
          style={({ pressed }) => [styles.close, pressed && styles.pressed]}
        >
          <CloseIcon size={20} strokeWidth={2.25} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={styles.title} accessibilityRole="header">
            You’re not alone.
          </Text>
          <Text style={styles.body}>
            If you’re in danger or thinking about harming yourself, reach out now. These lines are free,
            confidential and open 24/7.
          </Text>
        </View>

        {/* Calls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Talk to someone now
          </Text>
          {crisisCalls.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => call(c.number)}
              accessibilityRole="button"
              accessibilityLabel={`${c.label}. ${c.detail}`}
              accessibilityHint="Opens your phone app to place the call"
              style={({ pressed }) => [styles.callButton, c.urgent && styles.urgent, pressed && styles.pressed]}
            >
              <View style={styles.callIcon}>
                <PhoneIcon size={22} color={colors.textOnPetrol} strokeWidth={2.25} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.callLabel}>{c.label}</Text>
                <Text style={styles.callDetail}>{c.detail}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Texts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Prefer to text?
          </Text>
          {crisisTexts.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => text(t)}
              accessibilityRole="button"
              accessibilityLabel={`${t.label}. ${t.detail}`}
              accessibilityHint="Opens your messaging app"
              style={({ pressed }) => [styles.textButton, pressed && styles.pressedLight]}
            >
              <ChatIcon size={22} strokeWidth={2.25} />
              <View style={styles.actionText}>
                <Text style={styles.textLabel}>{t.label}</Text>
                <Text style={styles.textDetail}>{t.detail}</Text>
              </View>
            </Pressable>
          ))}
          <Pressable
            onPress={() => open(helplineDirectory.url, `Visit ${helplineDirectory.url}`)}
            accessibilityRole="link"
            style={({ pressed }) => [styles.link, pressed && { opacity: 0.7 }]}
          >
            <GlobeIcon size={18} strokeWidth={2} />
            <Text style={styles.linkText}>Outside the US? {helplineDirectory.label}</Text>
          </Pressable>
        </View>

        {/* Grounding */}
        <View style={styles.grounding}>
          <Pressable
            onPress={toggleGrounding}
            accessibilityRole="button"
            accessibilityState={{ expanded: groundingOpen }}
            style={styles.groundingHeader}
          >
            <View style={styles.actionText}>
              <Text style={styles.textLabel}>5-4-3-2-1 grounding</Text>
              <Text style={styles.textDetail}>A minute to come back to the present.</Text>
            </View>
            <View style={{ transform: [{ rotate: groundingOpen ? '180deg' : '0deg' }] }}>
              <ChevronDownIcon size={22} strokeWidth={2.25} />
            </View>
          </Pressable>

          {groundingOpen && (
            <View style={styles.steps}>
              <Text style={styles.body}>Breathe in slowly, then out. Tap each step when you’ve done it.</Text>
              {groundingSteps.map((s) => {
                const checked = done.includes(s.count);
                return (
                  <Pressable
                    key={s.count}
                    onPress={() => toggleStep(s.count)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked }}
                    accessibilityLabel={`${s.count} things you can ${s.sense}. ${s.prompt}`}
                    style={[styles.step, checked && styles.stepDone]}
                  >
                    <View style={[styles.stepBadge, checked && styles.stepBadgeDone]}>
                      {checked ? (
                        <CheckIcon size={18} color={colors.textOnPetrol} strokeWidth={2.75} />
                      ) : (
                        <Text style={styles.stepCount}>{s.count}</Text>
                      )}
                    </View>
                    <View style={styles.actionText}>
                      <Text style={styles.stepTitle}>
                        {s.count} {s.count === 1 ? 'thing' : 'things'} you can {s.sense}
                      </Text>
                      <Text style={styles.textDetail}>{s.prompt}</Text>
                    </View>
                  </Pressable>
                );
              })}
              {done.length === groundingSteps.length && (
                <Text style={styles.complete} accessibilityLiveRegion="polite">
                  Well done. Take one more slow breath.
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={exit}
          accessibilityRole="button"
          accessibilityLabel="Exit and return to the app"
          style={({ pressed }) => [styles.exit, pressed && styles.pressedLight]}
        >
          <Text style={styles.exitText}>Exit and return</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  eyebrow: {
    ...type.overline,
    fontSize: 12,
    color: colors.textPrimary,
    textTransform: 'uppercase',
  },
  close: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.petrol,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  pressedLight: {
    backgroundColor: colors.background,
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
  body: {
    ...type.body,
    fontSize: 16,
    lineHeight: 23,
    color: colors.textPrimary,
  },

  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.textPrimary,
  },
  actionText: {
    flex: 1,
    gap: 2,
  },

  // Calls: solid, high-contrast
  callButton: {
    minHeight: TARGET + 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.petrol,
  },
  urgent: {
    backgroundColor: colors.danger,
  },
  callIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callLabel: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textOnPetrol,
  },
  callDetail: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 19,
    color: colors.textOnPetrol,
  },

  // Texts: outlined
  textButton: {
    minHeight: TARGET + 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.petrol,
    backgroundColor: colors.surface,
  },
  textLabel: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.textPrimary,
  },
  textDetail: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 19,
    color: colors.textPrimary,
  },
  link: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  linkText: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.textPrimary,
    textDecorationLine: 'underline',
  },

  // Grounding
  grounding: {
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.petrol,
    overflow: 'hidden',
  },
  groundingHeader: {
    minHeight: TARGET + 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.lavenderSoft,
  },
  steps: {
    gap: spacing.sm,
    padding: spacing.lg,
  },
  step: {
    minHeight: TARGET,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
  },
  stepDone: {
    borderColor: colors.petrol,
    backgroundColor: colors.background,
  },
  stepBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.petrol,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeDone: {
    backgroundColor: colors.petrol,
  },
  stepCount: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  stepTitle: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  complete: {
    ...type.label,
    fontSize: 15,
    textAlign: 'center',
    color: colors.success,
    marginTop: spacing.xs,
  },

  // Exit
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  exit: {
    minHeight: TARGET,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.petrol,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitText: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.textPrimary,
  },
});
