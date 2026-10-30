import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors, fonts, radius } from '../../theme/tokens';
import { Brain, BRAIN_ASPECT } from './Brain';

// Onboarding hero: the split brain with thought chips (left) linked to
// emotion chips (right). Numbers are intensity ratings.

const WIDTH = 290;
const BRAIN_WIDTH = 160;
const BRAIN_HEIGHT = BRAIN_WIDTH * BRAIN_ASPECT;
const HEIGHT = BRAIN_HEIGHT + 16;
const MID_X = WIDTH / 2;
const CHIP_GAP = 6; // space between a chip and the midline
const ROW_1 = HEIGHT * 0.28;
const ROW_2 = HEIGHT * 0.6;
const CHIP_HEIGHT = 28;

type Chip = { label: string; value: number; tone: string; side: 'left' | 'right'; row: number };

const CHIPS: Chip[] = [
  { label: 'Self-doubt', value: 5, tone: colors.petrol, side: 'left', row: ROW_1 },
  { label: 'Catastrophize', value: 4, tone: colors.petrol, side: 'left', row: ROW_2 },
  { label: 'Anxious', value: 6, tone: colors.pinkStrong, side: 'right', row: ROW_1 },
  { label: 'Calm', value: 2, tone: colors.greenStrong, side: 'right', row: ROW_2 },
];

export function ThoughtMap() {
  return (
    <View
      style={{ width: WIDTH, height: HEIGHT }}
      accessible
      accessibilityLabel="A brain map linking the thoughts self-doubt and catastrophizing to the feelings anxious and calm"
    >
      <View style={styles.brain}>
        <Brain width={BRAIN_WIDTH} />
      </View>

      {/* Dashed link: Self-doubt → Anxious, dipping below the chips */}
      <Svg width={WIDTH} height={HEIGHT} style={StyleSheet.absoluteFill}>
        <Path
          d={`M${MID_X - 34} ${ROW_1 + CHIP_HEIGHT / 2} Q${MID_X} ${ROW_1 + CHIP_HEIGHT + 8} ${MID_X + 34} ${ROW_1 + CHIP_HEIGHT / 2}`}
          stroke={colors.lavenderStrong}
          strokeWidth={1.75}
          strokeDasharray="3 4"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>

      {CHIPS.map((chip) => (
        <View
          key={chip.label}
          style={[
            styles.chip,
            { top: chip.row - CHIP_HEIGHT / 2 },
            chip.side === 'left'
              ? { right: WIDTH - MID_X + CHIP_GAP }
              : { left: MID_X + CHIP_GAP },
          ]}
        >
          <View style={[styles.badge, { backgroundColor: chip.tone }]}>
            <Text style={styles.badgeText}>{chip.value}</Text>
          </View>
          <Text style={styles.chipText}>{chip.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  brain: {
    position: 'absolute',
    top: 8,
    left: (WIDTH - BRAIN_WIDTH) / 2,
  },
  chip: {
    position: 'absolute',
    height: CHIP_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 4,
    paddingRight: 12,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.petrol,
    backgroundColor: colors.surface,
  },
  badge: {
    width: 18,
    height: 18,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.textOnPetrol,
  },
  chipText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.textPrimary,
  },
});
