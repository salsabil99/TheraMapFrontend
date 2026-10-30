import { Alert } from 'react-native';

// Placeholder for actions whose screen or backend doesn't exist yet.
export function comingSoon(what: string) {
  Alert.alert(what, 'This screen is coming next.');
}
