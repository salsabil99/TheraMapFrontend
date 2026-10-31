// Therapist-assigned tasks (homework / CBT exercises). Sample data until the API exists.

export type TaskKind = 'breathing' | 'reframing';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type CheckIn = {
  feeling: string;
  intensity: number; // 0–10
  savedAt: string; // HH:MM
};

export type Task = {
  id: string;
  kind: TaskKind;
  title: string;
  minutes: number;
  headline: string; // shown large on the task screen
  description: { text: string; bold?: boolean }[];
  beforeYouBegin: string;
  assignedBy: { name: string; initials: string };
  due: string;
  dueDay?: 'today' | 'tomorrow' | 'later'; // drives ordering and emphasis on Today
  reminder?: string; // e.g. "Evening reminder · 20:00"
  priority?: 'highest';
  // The emotion the check-in compares against, from the client's last log.
  baseline?: { emotion: string; intensity: number; when: string };
  status: TaskStatus;
  completedAt?: string;
  checkIn?: CheckIn;
};

export const initialTasks: Task[] = [
  {
    id: 'box-breathing',
    kind: 'breathing',
    title: 'Box Breathing',
    minutes: 5,
    headline: 'Come back to your breath.',
    description: [{ text: 'Breathe in, hold, out and hold for four counts each. Repeat for five minutes.' }],
    beforeYouBegin: 'Find a comfortable position. Breathe gently, without forcing. You can pause or stop at any time.',
    assignedBy: { name: 'Dr. Elena Vance (LCSW)', initials: 'EV' },
    due: 'Today, 8:00 PM',
    dueDay: 'today',
    reminder: 'Evening reminder · 8:00 PM',
    baseline: { emotion: 'Anxiety', intensity: 7, when: 'this morning' },
    status: 'todo',
  },
  {
    id: 'reframing-presentation',
    kind: 'reframing',
    title: 'Cognitive Reframing for Team Presentation',
    minutes: 10,
    headline: 'Find a more balanced view.',
    description: [
      { text: 'Identify 1', bold: true },
      {
        text: ' automatic catastrophizing thought before Thursday’s presentation and write 2 balanced alternative outcomes.',
      },
    ],
    beforeYouBegin:
      'Pick a quiet moment. Write the thought as it came to you, then ask what a friend would say. There are no wrong answers.',
    assignedBy: { name: 'Dr. Elena Vance (LCSW)', initials: 'EV' },
    due: 'Tomorrow, 5:00 PM',
    dueDay: 'tomorrow',
    priority: 'highest',
    baseline: { emotion: 'Anxiety', intensity: 6, when: 'on Monday' },
    status: 'todo',
  },
  {
    id: 'grounding-walk',
    kind: 'breathing',
    title: 'Mindful Walk',
    minutes: 10,
    headline: 'Notice the world around you.',
    description: [{ text: 'Walk slowly and name what you see, hear and feel.' }],
    beforeYouBegin: 'Choose a safe, familiar route.',
    assignedBy: { name: 'Dr. Elena Vance (LCSW)', initials: 'EV' },
    due: 'Done on 3 Oct',
    status: 'done',
    completedAt: '3 Oct, 18:40',
    checkIn: { feeling: 'A bit calmer', intensity: 4, savedAt: '18:45' },
  },
];
