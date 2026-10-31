import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookIcon, ClipboardCheckIcon, SettingsIcon, SunIcon } from '../../components/icons';
import { TabButton, tabBarStyles } from '../../components/TabBar';
import { colors, spacing } from '../../theme/tokens';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  // TabSlot and TabList must be direct children of Tabs so the triggers are discovered.
  return (
    <Tabs style={styles.root}>
      <TabSlot style={styles.slot} />
      <TabList style={[tabBarStyles.bar, { marginBottom: insets.bottom + spacing.sm }]}>
        <TabTrigger name="home" href="/home" asChild>
          <TabButton label="Today" icon={(c) => <SunIcon size={20} color={c} />} />
        </TabTrigger>
        <TabTrigger name="journal" href="/journal" asChild>
          <TabButton label="Journal" icon={(c) => <BookIcon size={20} color={c} />} />
        </TabTrigger>
        <TabTrigger name="tasks" href="/tasks" asChild>
          <TabButton label="Tasks" icon={(c) => <ClipboardCheckIcon size={20} color={c} />} />
        </TabTrigger>
        <TabTrigger name="settings" href="/settings" asChild>
          <TabButton label="Settings" icon={(c) => <SettingsIcon size={20} color={c} />} />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Takes the remaining height so long screens scroll above the tab bar.
  slot: {
    flex: 1,
  },
});
