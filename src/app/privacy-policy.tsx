import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '../components/ScreenHeader';
import { PRIVACY_POLICY_VERSION } from '../lib/privacy';
import { colors, radius, spacing, type } from '../theme/tokens';

// Full policy text is supplied by legal; this screen only frames it.
export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <ScreenHeader title="Privacy Policy" badge={`v${PRIVACY_POLICY_VERSION}`} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Full policy coming soon</Text>
          <Text style={styles.body}>
            The complete Privacy Policy v{PRIVACY_POLICY_VERSION} will appear here. Until then, the three principles on
            the previous screen summarise how your records are kept private.
          </Text>
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
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  content: {
    padding: spacing.xl,
  },
  card: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  title: {
    ...type.button,
    color: colors.textPrimary,
  },
  body: {
    ...type.body,
    color: colors.textSecondary,
  },
});
