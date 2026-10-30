import { colors } from '../theme/tokens';

// Accent colour per emotion, shared by chips, map nodes and entry metadata.
export const EMOTION_COLORS: Record<string, string> = {
  Anxious: colors.pinkStrong,
  Sad: colors.skyStrong,
  Calm: colors.greenStrong,
  Hopeful: colors.amber,
};

export function emotionColor(label: string) {
  return EMOTION_COLORS[label] ?? colors.textMuted;
}
