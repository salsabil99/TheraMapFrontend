import { colors } from '../theme/tokens';

// Accent colour per emotion, shared by chips, map nodes and entry metadata.
export const EMOTION_COLORS: Record<string, string> = {
  Anxious: colors.pinkStrong,
  Sad: colors.skyStrong,
  Angry: colors.coral,
  Overwhelmed: colors.lavenderStrong,
  Neutral: colors.textMuted,
  Hopeful: colors.amber,
  Calm: colors.greenStrong,
  Content: colors.greenStrong,
};

// Soft fill used behind a selected emotion.
export const EMOTION_TINTS: Record<string, string> = {
  Anxious: colors.pinkSoft,
  Sad: colors.skySoft,
  Angry: colors.coralSoft,
  Overwhelmed: colors.lavenderSoft,
  Neutral: colors.background,
  Hopeful: colors.amberSoft,
  Calm: colors.greenSoft,
  Content: colors.greenSoft,
};

export function emotionColor(label: string) {
  return EMOTION_COLORS[label] ?? colors.textMuted;
}

export function emotionTint(label: string) {
  return EMOTION_TINTS[label] ?? colors.background;
}

// Wording for a 1–10 intensity rating.
export function intensityBand(value: number) {
  if (value <= 3) return { label: 'Mild · Gently present', color: colors.greenText, tint: colors.greenSoft };
  if (value <= 6) return { label: 'Moderate · Noticeably present', color: colors.amberText, tint: colors.amberSoft };
  if (value <= 8) return { label: 'Strong · Hard to ignore', color: colors.coralText, tint: colors.coralSoft };
  return { label: 'Intense · Overwhelming', color: colors.danger, tint: colors.coralSoft };
}
