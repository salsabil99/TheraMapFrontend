import { Fragment } from 'react';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';

import { EMOTION_WHEEL, type EmotionChoice } from '../lib/emotionWheel';
import { colors, fonts } from '../theme/tokens';

type Props = {
  size: number;
  value: EmotionChoice | null;
  onChange: (choice: EmotionChoice) => void;
};

const OUTER_SPAN = 360 / (EMOTION_WHEEL.length * 2);
const CORE_SPAN = 360 / EMOTION_WHEEL.length;

// Angle 0 is 12 o'clock, growing clockwise.
function point(cx: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cx + r * Math.sin(rad) };
}

function ringSegment(cx: number, r0: number, r1: number, a0: number, a1: number) {
  const p0 = point(cx, r1, a0);
  const p1 = point(cx, r1, a1);
  const p2 = point(cx, r0, a1);
  const p3 = point(cx, r0, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return [
    `M${p0.x} ${p0.y}`,
    `A${r1} ${r1} 0 ${large} 1 ${p1.x} ${p1.y}`,
    `L${p2.x} ${p2.y}`,
    `A${r0} ${r0} 0 ${large} 0 ${p3.x} ${p3.y}`,
    'Z',
  ].join(' ');
}

// Tap a core feeling (inner ring) or a specific one (outer ring).
export function EmotionWheel({ size, value, onChange }: Props) {
  const cx = size / 2;
  const rOuter = cx - 3; // leaves room for the selection stroke
  const rCore = size * 0.31;
  const rCenter = size * 0.12;
  const outerFont = Math.max(10, size / 34);
  const coreFont = Math.max(12, size / 27);

  // Outer segment that's selected, drawn last so its outline sits on top.
  const selected = (() => {
    if (!value?.feeling) return null;
    const i = EMOTION_WHEEL.findIndex((c) => c.id === value.core);
    const j = EMOTION_WHEEL[i]?.children.indexOf(value.feeling) ?? -1;
    if (i < 0 || j < 0) return null;
    const s0 = i * CORE_SPAN + j * OUTER_SPAN;
    return {
      d: ringSegment(cx, rCore, rOuter, s0, s0 + OUTER_SPAN),
      check: point(cx, (rCore + rOuter) / 2 + 4, s0 + OUTER_SPAN / 2),
    };
  })();

  const segments = EMOTION_WHEEL.map((core, i) => {
    const a0 = i * CORE_SPAN;
    const coreLabel = point(cx, (rCore + rCenter) / 2 + 2, a0 + CORE_SPAN / 2);
    const coreSelected = value?.core === core.id && !value.feeling;

    return (
      <Fragment key={core.id}>
        {core.children.map((feeling, j) => {
          const s0 = a0 + j * OUTER_SPAN;
          const s1 = s0 + OUTER_SPAN;
          const d = ringSegment(cx, rCore, rOuter, s0, s1);
          const label = point(cx, (rCore + rOuter) / 2 + 4, s0 + OUTER_SPAN / 2);
          return (
            <G key={feeling} onPress={() => onChange({ core: core.id, feeling })}>
              <Path d={d} fill={core.softFill} stroke={colors.surface} strokeWidth={2} />
              <SvgText
                x={label.x}
                y={label.y + outerFont / 3}
                fontSize={outerFont}
                fontFamily={fonts.medium}
                fill={colors.textPrimary}
                textAnchor="middle"
              >
                {feeling}
              </SvgText>
            </G>
          );
        })}
        <G onPress={() => onChange({ core: core.id, feeling: null })}>
          <Path
            d={ringSegment(cx, rCenter, rCore, a0, a0 + CORE_SPAN)}
            fill={core.fill}
            stroke={colors.surface}
            strokeWidth={2}
          />
          <SvgText
            x={coreLabel.x}
            y={coreLabel.y + coreFont / 3}
            fontSize={coreFont}
            fontFamily={fonts.bold}
            fill={colors.textPrimary}
            textAnchor="middle"
          >
            {core.id}
          </SvgText>
        </G>
        {coreSelected && (
          <Path
            d={ringSegment(cx, rCenter, rCore, a0, a0 + CORE_SPAN)}
            fill="none"
            stroke={colors.petrol}
            strokeWidth={3}
          />
        )}
      </Fragment>
    );
  });

  const centerTitle = value ? (value.feeling ?? value.core) : 'Tap';
  // Shrink long words ("Uncomfortable") so they stay inside the centre circle.
  const centerFont = Math.min(size / 22, (rCenter * 2 - 10) / (centerTitle.length * 0.58));
  const centerSub = value?.feeling ? value.core : value ? 'Core feeling' : 'a feeling';

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments}
      {selected && (
        <>
          <Path d={selected.d} fill="none" stroke={colors.petrol} strokeWidth={3} strokeLinejoin="round" />
          <CheckBadge x={selected.check.x} y={selected.check.y + outerFont + 4} />
        </>
      )}
      <Circle cx={cx} cy={cx} r={rCenter} fill={colors.surface} />
      <SvgText
        x={cx}
        y={cx + 2}
        fontSize={centerFont}
        fontFamily={fonts.bold}
        fill={colors.textPrimary}
        textAnchor="middle"
      >
        {centerTitle}
      </SvgText>
      <SvgText
        x={cx}
        y={cx + 14}
        fontSize={Math.max(10, size / 30)}
        fontFamily={fonts.regular}
        fill={colors.textSecondary}
        textAnchor="middle"
      >
        {centerSub}
      </SvgText>
    </Svg>
  );
}

function CheckBadge({ x, y }: { x: number; y: number }) {
  return (
    <G>
      <Circle cx={x} cy={y} r={8} fill={colors.petrol} />
      <Path
        d={`M${x - 3.5} ${y} l2.5 2.5 l4.5 -5`}
        stroke={colors.surface}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </G>
  );
}
