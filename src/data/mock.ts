// Sample data until the API exists. Shapes are what the screens expect.

export type Homework = {
  id: string;
  priority: 'highest' | 'normal';
  due: string;
  title: string;
  assignedBy: { name: string; initials: string };
  // Description as segments so the key instruction can be bold.
  description: { text: string; bold?: boolean }[];
};

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
};

export const homework: Homework[] = [
  {
    id: 'hw-1',
    priority: 'highest',
    due: 'Due tomorrow, 5:00 PM',
    title: 'Cognitive Reframing for Team Presentation',
    assignedBy: { name: 'Dr. Elena Vance (LCSW)', initials: 'EV' },
    description: [
      { text: 'Identify 1', bold: true },
      {
        text: ' automatic catastrophizing thought before Thursday’s presentation and write 2 balanced alternative outcomes.',
      },
    ],
  },
];

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
];

export const journalEntryCount = 12;
