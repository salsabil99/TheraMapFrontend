// Sample data until the API exists. Shapes are what the screens expect.

export type JournalEntry = {
  id: string;
  date: string;
  emotion: { label: string; intensity: number };
  thought?: string;
  title: string;
  preview: string;
  shared: boolean;
};

export const currentUser = {
  name: 'Sarah',
  email: 'sarah.m@example.com',
  therapist: { name: 'Dr. Elena Vance (LCSW)', since: 'Connected since Sep 2026' },
};

export const recentEntries: JournalEntry[] = [
  {
    id: 'je-1',
    date: '5 Oct',
    emotion: { label: 'Anxious', intensity: 6 },
    thought: 'Self-doubt',
    title: 'After the team meeting',
    preview: 'I noticed I was overthinking the feedback again. It triggered old fears, but I reminded myself that…',
    shared: false,
  },
  {
    id: 'je-2',
    date: '1 Oct',
    emotion: { label: 'Sad', intensity: 4 },
    thought: 'Self-doubt',
    title: 'A busy evening',
    preview: 'Too many things at once. I told myself I should be coping better…',
    shared: true,
  },
];

export const journalEntryCount = 12;

// Weekly mindmap: each thought pattern with how often it appeared alongside each emotion.
export type ThoughtPattern = {
  id: string;
  label: string;
  links: Record<string, number>; // emotion label → number of records
};

export const weeklySummary: {
  period: string;
  range: string;
  records: number;
  thoughts: ThoughtPattern[];
} = {
  period: 'This week',
  range: '29 Sep – 5 Oct',
  records: 12,
  thoughts: [
    { id: 'self-doubt', label: 'Self-doubt', links: { Anxious: 2, Sad: 3 } },
    { id: 'catastrophizing', label: 'Catastrophizing', links: { Anxious: 3, Hopeful: 1 } },
    { id: 'mind-reading', label: 'Mind reading', links: { Anxious: 1, Calm: 2 } },
  ],
};
