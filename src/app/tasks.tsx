import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '../components/ScreenHeader';
import { colors, spacing, type } from '../theme/tokens';

// Opened from the Today shortcut; not a tab. Placeholder until its design arrives.
export default function TasksScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <ScreenHeader title="Tasks" />
        <Text style={styles.body}>This screen is coming next.</Text>
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
    padding: spacing.xl,
    gap: spacing.xl,
  },
  body: {
    ...type.body,
    color: colors.textSecondary,
  },
});
