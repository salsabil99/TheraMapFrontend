// Two-level feelings wheel: six core emotions, each with more specific feelings.
// Order is clockwise from 12 o'clock.

export type CoreEmotion = {
  id: string;
  fill: string; // inner ring
  softFill: string; // outer ring
  children: string[];
};

export const EMOTION_WHEEL: CoreEmotion[] = [
  { id: 'Happy', fill: '#FBE48C', softFill: '#FCF0BC', children: ['Hopeful', 'Grateful'] },
  { id: 'Sad', fill: '#9FCBF2', softFill: '#CBE3F8', children: ['Lonely', 'Disappointed'] },
  { id: 'Angry', fill: '#F5A39A', softFill: '#F9C9C3', children: ['Frustrated', 'Hurt'] },
  { id: 'Afraid', fill: '#D5C0F0', softFill: '#E8DCF8', children: ['Worried', 'Anxious'] },
  { id: 'Surprised', fill: '#F8C7A3', softFill: '#FBDDC6', children: ['Amazed', 'Confused'] },
  { id: 'Disgusted', fill: '#B5D29E', softFill: '#D4E6C5', children: ['Uncomfortable', 'Repelled'] },
];

export type EmotionChoice = { core: string; feeling: string | null };

export function coreOf(id: string) {
  return EMOTION_WHEEL.find((c) => c.id === id);
}
