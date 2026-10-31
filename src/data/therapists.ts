// Directory of verified therapists. Sample data until the API exists.

export type Therapist = {
  id: string;
  name: string;
  initials: string;
  tone: 'skyBlue' | 'paleGreen' | 'pink' | 'lavender';
  focus: string; // short specialty line
  specialties: string[]; // used by the filter chips
  tags: string[];
  rating: number;
  reviews: number;
  availability: 'now' | 'next-week';
  bio: string;
};

export const therapists: Therapist[] = [
  {
    id: 'amara-osei',
    name: 'Dr. Amara Osei',
    initials: 'AO',
    tone: 'skyBlue',
    focus: 'Anxiety · CBT · Accepting clients',
    specialties: ['Anxiety', 'CBT', 'Stress'],
    tags: ['Anxiety', 'Stress', 'Mindfulness'],
    rating: 4.9,
    reviews: 124,
    availability: 'now',
    bio: 'Clinical psychologist helping adults work through anxiety and stress with practical CBT tools.',
  },
  {
    id: 'leo-marchetti',
    name: 'Dr. Leo Marchetti',
    initials: 'LM',
    tone: 'paleGreen',
    focus: 'Couples therapy · CBT',
    specialties: ['Relationships', 'CBT'],
    tags: ['Relationships', 'Communication', 'CBT'],
    rating: 4.8,
    reviews: 96,
    availability: 'next-week',
    bio: 'Works with individuals and couples on communication, trust and rebuilding connection.',
  },
  {
    id: 'sara-el-masri',
    name: 'Dr. Sara El Masri',
    initials: 'SE',
    tone: 'pink',
    focus: 'Depression · CBT · Online',
    specialties: ['Depression', 'CBT', 'Self-esteem'],
    tags: ['Depression', 'Self-esteem', 'Life transitions'],
    rating: 4.7,
    reviews: 88,
    availability: 'now',
    bio: 'Supports people through low mood, self-criticism and big life changes, fully online.',
  },
];

// Chips shown first; the rest appear under "More".
export const PRIMARY_SPECIALTIES = ['Anxiety', 'Depression', 'CBT'];
export const MORE_SPECIALTIES = ['Relationships', 'Stress', 'Self-esteem'];
