import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import type { ThoughtPattern } from '../../data/mock';
import { emotionColor } from '../../lib/emotions';
import { colors, fonts, radius } from '../../theme/tokens';
import { Brain, BRAIN_ASPECT } from './Brain';

// Weekly map: thought patterns on the left hemisphere, emotions on the right.
// Node size grows with frequency. The selected thought is linked to the
// emotions it was recorded with; unrelated emotions fade back.

// Slots as fractions of the map box, filled in order of frequency.
const THOUGHT_SLOTS = [
  { x: 0.3, y: 0.24 },
  { x: 0.27, y: 0.5 },
  { x: 0.31, y: 0.76 },
];
const EMOTION_SLOTS: Record<string, { x: number; y: number }> = {
  Anxious: { x: 0.7, y: 0.2 },
  Sad: { x: 0.81, y: 0.43 },
  Hopeful: { x: 0.65, y: 0.6 },
  Calm: { x: 0.79, y: 0.77 },
};

const nodeSize = (count: number) => 26 + count * 2;

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
  const at = (slot: { x: number; y: number }) => ({ x: slot.x * width, y: slot.y * height });

  return (
    <View style={{ width, height }}>
      <Brain
        width={width}
        leftFill={colors.lavenderSoft}
        rightFill={colors.skySoft}
        strokeColor={colors.borderStrong}
      />

      {/* Links from the selected thought to its emotions */}
      {selected && (
        <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
          {Object.entries(selected.links).map(([emotion, n]) => {
            const slot = EMOTION_SLOTS[emotion];
            const index = sortedThoughts.findIndex((t) => t.id === selected.id);
            if (!slot || index < 0) return null;
            const from = at(THOUGHT_SLOTS[index]);
            const to = at(slot);
            const midX = (from.x + to.x) / 2;
            const midY = Math.min(from.y, to.y) - 24;
            return (
              <Path
                key={emotion}
                d={`M${from.x} ${from.y} Q${midX} ${midY} ${to.x} ${to.y}`}
                stroke={colors.petrol}
                strokeWidth={1 + n * 0.5}
                strokeDasharray="4 4"
                strokeLinecap="round"
                fill="none"
              />
            );
          })}
        </Svg>
      )}

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
            fill={isSelected ? colors.petrol : colors.surface}
            border={colors.petrol}
            textColor={isSelected ? colors.textOnPetrol : colors.textPrimary}
            onPress={() => onSelect(t.id)}
            accessibilityLabel={`${t.label}, ${count} records${isSelected ? ', selected' : ''}`}
          />
        );
      })}

      {[...emotionTotals.entries()].map(([emotion, count]) => {
        const slot = EMOTION_SLOTS[emotion];
        if (!slot) return null;
        const linked = !selected || emotion in selected.links;
        return (
          <Node
            key={emotion}
            center={at(slot)}
            size={nodeSize(count)}
            count={count}
            label={emotion}
            fill={colors.surface}
            border={emotionColor(emotion)}
            textColor={colors.textPrimary}
            dimmed={!linked}
            accessibilityLabel={`${emotion}, ${count} records`}
          />
        );
      })}
    </View>
  );
}

const total = (t: ThoughtPattern) => Object.values(t.links).reduce((a, b) => a + b, 0);

type NodeProps = {
  center: { x: number; y: number };
  size: number;
  count: number;
  label: string;
  fill: string;
  border: string;
  textColor: string;
  dimmed?: boolean;
  onPress?: () => void;
  accessibilityLabel: string;
};

const LABEL_WIDTH = 110;

function Node({ center, size, count, label, fill, border, textColor, dimmed, onPress, accessibilityLabel }: NodeProps) {
  const content = (
    <>
      <View
        style={[
          styles.circle,
          { width: size, height: size, backgroundColor: fill, borderColor: border },
        ]}
      >
        <Text style={[styles.count, { color: textColor }]}>{count}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </>
  );

  const position = {
    left: center.x - LABEL_WIDTH / 2,
    top: center.y - size / 2,
    opacity: dimmed ? 0.35 : 1,
  };

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
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      style={[styles.node, position]}
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
    gap: 3,
  },
  circle: {
    borderRadius: radius.pill,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.textPrimary,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.85)',
    overflow: 'hidden',
  },
});
