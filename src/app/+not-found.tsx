import { Redirect } from 'expo-router';

// Unknown addresses (old links, typos) start the user at Sign In.
export default function NotFound() {
  return <Redirect href="/sign-in" />;
}
