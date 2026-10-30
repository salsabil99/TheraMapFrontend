// TheraMap design tokens — "Pastel wellness" system.
// Quiet surfaces, petrol for primary actions, pastel accents for content.

export const colors = {
  // Surfaces
  background: '#EAF3F4', // icy blue app canvas
  surface: '#FFFFFF',
  surfaceMuted: '#DCE8EA', // segmented track, subtle fills
  border: '#DCE6E8',
  borderStrong: '#BFCFD2',

  // Brand
  petrol: '#12343B',
  petrolPressed: '#0C262B',
  petrolSoft: '#1E464E', // icon chip on petrol

  // Text
  textPrimary: '#12343B',
  textSecondary: '#5B7277',
  textMuted: '#8DA1A5',
  textOnPetrol: '#FFFFFF',
  textOnPetrolMuted: '#C7D7DA',

  // Pastel accents
  pink: '#F6D5E3',
  pinkStrong: '#D98AA5',
  lavender: '#DCD5F6',
  lavenderSoft: '#F4F1FD',
  lavenderStrong: '#6A57C2',
  paleGreen: '#E3F0D2',
  greenStrong: '#9DBF86',
  greenSoft: '#F3F8EA',
  greenText: '#4A6A2C',
  skyBlue: '#D3E8F2',

  // Feedback
  danger: '#B4474F',
  success: '#2F7D4F',
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 24,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const fonts = {
  regular: 'Inter_400Regular',
  italic: 'Inter_400Regular_Italic',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const type = {
  title: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.3 },
  heading: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 24, letterSpacing: -0.2 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18 },
  button: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20 },
  caption: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16 },
  overline: { fontFamily: fonts.bold, fontSize: 11, lineHeight: 14, letterSpacing: 1 },
} as const;

export const shadow = {
  card: {
    shadowColor: '#12343B',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
} as const;
