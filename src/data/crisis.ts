// Crisis contacts shown in the Safety modal. US defaults; localise per region.

export type CrisisCall = {
  id: string;
  label: string;
  detail: string;
  number: string;
  urgent?: boolean;
};

export type CrisisText = {
  id: string;
  label: string;
  detail: string;
  number: string;
  body?: string; // pre-filled message
};

export const crisisCalls: CrisisCall[] = [
  {
    id: 'lifeline',
    label: 'Call 988',
    detail: 'Suicide & Crisis Lifeline · free, 24/7',
    number: '988',
  },
  {
    id: 'emergency',
    label: 'Call 911',
    detail: 'Emergency services · if you’re in immediate danger',
    number: '911',
    urgent: true,
  },
];

export const crisisTexts: CrisisText[] = [
  {
    id: 'crisis-text-line',
    label: 'Text HOME to 741741',
    detail: 'Crisis Text Line · free, 24/7',
    number: '741741',
    body: 'HOME',
  },
  {
    id: 'lifeline-text',
    label: 'Text 988',
    detail: 'Suicide & Crisis Lifeline by text',
    number: '988',
  },
];

// International directory for people outside the US.
export const helplineDirectory = {
  label: 'Find a helpline in your country',
  url: 'https://findahelpline.com',
};

export const groundingSteps = [
  { count: 5, sense: 'see', prompt: 'Look around. Name five things you can see.' },
  { count: 4, sense: 'touch', prompt: 'Notice four things you can feel — your feet, a chair, your clothes.' },
  { count: 3, sense: 'hear', prompt: 'Listen for three sounds, near or far.' },
  { count: 2, sense: 'smell', prompt: 'Find two things you can smell, or two scents you like.' },
  { count: 1, sense: 'taste', prompt: 'Notice one thing you can taste, or take a sip of water.' },
];
