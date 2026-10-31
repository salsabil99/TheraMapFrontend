import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

import type { ThoughtPattern } from '../../data/mock';
import { colors, fonts, radius } from '../../theme/tokens';
import { Brain, BRAIN_ASPECT } from './Brain';

// Weekly map: thought patterns on the left hemisphere, emotions on the right.
// Each node is a filled circle with its count and a label pill underneath.
// The selected thought is linked to the emotions it was recorded with.

// Slots as fractions of the map box, filled in order of frequency.
const THOUGHT_SLOTS = [
  { x: 0.33, y: 0.2 },
  { x: 0.27, y: 0.47 },
  { x: 0.33, y: 0.74 },
];
const EMOTION_SLOTS: Record<string, { x: number; y: number }> = {
  Anxious: { x: 0.69, y: 0.18 },
  Sad: { x: 0.8, y: 0.47 },
  Hopeful: { x: 0.62, y: 0.64 },
  Calm: { x: 0.8, y: 0.8 },
};

// Thought shades go from deepest (most frequent) to lightest.
const THOUGHT_COLORS = ['#563F78', '#8257B3', '#7E62AE'];
const EMOTION_NODE_COLORS: Record<string, { fill: string; text: string }> = {
  Anxious: { fill: '#D4607E', text: colors.textOnPetrol },
  Sad: { fill: '#5E93C4', text: colors.textOnPetrol },
  Hopeful: { fill: '#F2E2B3', text: colors.textPrimary },
  Calm: { fill: '#7FAA82', text: colors.textOnPetrol },
};
const fallbackEmotion = { fill: colors.textMuted, text: colors.textOnPetrol };
// Link and dot colour: the readable version of each emotion's fill.
const linkColor = (emotion: string) => (emotion === 'Hopeful' ? colors.amber : (EMOTION_NODE_COLORS[emotion] ?? fallbackEmotion).fill);

const nodeSize = (count: number) => 32 + count * 1.4;
const HALO = 8;

type Point = { x: number; y: number };

type Props = {
  width: number;
  thoughts: ThoughtPattern[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function BrainMap({ width, thoughts, selectedId, onSelect }: Props) {
  const height = width * BRAIN_ASPECT;

  const sortedThoughts = [...thoughts].sort((a, b) => total(b) - total(a)).slice(0, THOUGHT_SLOTS.length);
  const emotionTotals = new Map<string, number>();
  for (const t of thoughts) {
    for (const [emotion, n] of Object.entries(t.links)) {
      emotionTotals.set(emotion, (emotionTotals.get(emotion) ?? 0) + n);
    }
  }

  const selected = thoughts.find((t) => t.id === selectedId);
  const selectedIndex = sortedThoughts.findIndex((t) => t.id === selectedId);
  const at = (slot: Point) => ({ x: slot.x * width, y: slot.y * height });

  const links =
    selected && selectedIndex >= 0
      ? Object.keys(selected.links)
          .filter((emotion) => EMOTION_SLOTS[emotion])
          .map((emotion) => {
            const from = at(THOUGHT_SLOTS[selectedIndex]);
            const to = at(EMOTION_SLOTS[emotion]);
            // Level targets arc over the top; higher or lower ones bend away from the labels in between.
            const control =
              to.y > from.y + 30
                ? { x: (from.x + to.x) / 2, y: to.y - 10 }
                : to.y < from.y - 30
                  ? { x: from.x + (to.x - from.x) * 0.6, y: from.y - 10 }
                  : { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - 28 };
            const fromR = nodeSize(total(selected)) / 2 + HALO / 2 + 2;
            const toR = nodeSize(emotionTotals.get(emotion) ?? 0) / 2 + HALO / 2 + 2;
            const start = pointOutside(from, control, to, from, fromR, false);
            const end = pointOutside(from, control, to, to, toR, true);
            return { emotion, from, control, to, start, end };
          })
      : [];

  return (
    <View style={{ width, height }}>
      <Brain
        width={width}
        leftFill="#F1EDFB"
        rightFill="#E8F3F9"
        leftStroke="#DCD3F3"
        rightStroke="#CFE3EE"
        strokeWidth={4.5}
      />

      <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
        {links.map(({ emotion, start, control, end }) => (
          <Path
            key={emotion}
            d={`M${start.x} ${start.y} Q${control.x} ${control.y} ${end.x} ${end.y}`}
            stroke={linkColor(emotion)}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            strokeLinecap="round"
            fill="none"
          />
        ))}
        {links.map(({ emotion, start, end }) => (
          <G key={`${emotion}-dots`}>
            <Circle cx={start.x} cy={start.y} r={3.5} fill={THOUGHT_COLORS[selectedIndex]} />
            <Circle cx={end.x} cy={end.y} r={3.5} fill={linkColor(emotion)} />
          </G>
        ))}
      </Svg>

      {sortedThoughts.map((t, i) => {
        const count = total(t);
        const isSelected = t.id === selectedId;
        return (
          <Node
            key={t.id}
            center={at(THOUGHT_SLOTS[i])}
            size={nodeSize(count)}
            count={count}
            label={t.label}
            fill={THOUGHT_COLORS[i]}
            textColor={colors.textOnPetrol}
            selected={isSelected}
            onPress={() => onSelect(t.id)}
            accessibilityLabel={`${t.label}, ${count} records${isSelected ? ', selected' : ''}`}
          />
        );
      })}

      {[...emotionTotals.entries()].map(([emotion, count]) => {
        const slot = EMOTION_SLOTS[emotion];
        if (!slot) return null;
        const tone = EMOTION_NODE_COLORS[emotion] ?? fallbackEmotion;
        return (
          <Node
            key={emotion}
            center={at(slot)}
            size={nodeSize(count)}
            count={count}
            label={emotion}
            fill={tone.fill}
            textColor={tone.text}
            accessibilityLabel={`${emotion}, ${count} records`}
          />
        );
      })}
    </View>
  );
}

const total = (t: ThoughtPattern) => Object.values(t.links).reduce((a, b) => a + b, 0);

// First point on the curve that sits `r` away from `center`, walking from the
// start (or from the end when `fromEnd`), so links stop just outside a node.
function pointOutside(p0: Point, c: Point, p1: Point, center: Point, r: number, fromEnd: boolean): Point {
  for (let i = 0; i <= 100; i++) {
    const t = fromEnd ? 1 - i / 100 : i / 100;
    const x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * c.x + t ** 2 * p1.x;
    const y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * c.y + t ** 2 * p1.y;
    if (Math.hypot(x - center.x, y - center.y) >= r) return { x, y };
  }
  return center;
}

type NodeProps = {
  center: Point;
  size: number;
  count: number;
  label: string;
  fill: string;
  textColor: string;
  selected?: boolean;
  onPress?: () => void;
  accessibilityLabel: string;
};

const LABEL_WIDTH = 120;

function Node({ center, size, count, label, fill, textColor, selected, onPress, accessibilityLabel }: NodeProps) {
  const halo = size + HALO;
  const content = (
    <>
      <View
        style={[
          styles.halo,
          { width: halo, height: halo, backgroundColor: fill + (selected ? '40' : '26') },
        ]}
      >
        <View style={[styles.circle, { width: size, height: size, backgroundColor: fill }]}>
          <Text style={[styles.count, { color: textColor }]}>{count}</Text>
        </View>
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </>
  );

  const position = { left: center.x - LABEL_WIDTH / 2, top: center.y - halo / 2 };

  if (!onPress) {
    return (
      <View style={[styles.node, position]} accessible accessibilityLabel={accessibilityLabel}>
        {content}
      </View>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      style={({ pressed }) => [styles.node, position, pressed && { opacity: 0.85 }]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  node: {
    position: 'absolute',
    width: LABEL_WIDTH,
    alignItems: 'center',
    gap: 4,
  },
  halo: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.textPrimary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    shadowColor: colors.petrol,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
});
