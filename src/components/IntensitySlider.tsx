import { useMemo, useState } from 'react';
import { PanResponder, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { colors, radius } from '../theme/tokens';

const MIN = 1;
const MAX = 10;
const THUMB = 28;
const TRACK_HEIGHT = 8;

function valueAt(x: number, width: number) {
  if (width <= 0) return MIN;
  const ratio = Math.min(Math.max(x / width, 0), 1);
  return Math.round(MIN + ratio * (MAX - MIN));
}

type Props = {
  value: number;
  onChange: (value: number) => void;
  accessibilityLabel: string;
};

// 1–10 slider on a calm-to-intense gradient. Drag or tap the track; screen
// readers adjust it with increment/decrement.
export function IntensitySlider({ value, onChange, accessibilityLabel }: Props) {
  const [width, setWidth] = useState(0);

  // Rebuilt when the width changes; the drag's start point lives in the closure.
  const responder = useMemo(() => {
    const drag = { startX: 0 };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // Keep the gesture when the parent ScrollView tries to take over.
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        drag.startX = e.nativeEvent.locationX;
        onChange(valueAt(drag.startX, width));
      },
      onPanResponderMove: (_, g) => onChange(valueAt(drag.startX + g.dx, width)),
    });
  }, [width, onChange]);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const thumbLeft = ((value - MIN) / (MAX - MIN)) * width - THUMB / 2;

  return (
    <View
      style={styles.hitArea}
      onLayout={onLayout}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: MIN, max: MAX, now: value, text: `${value} out of ${MAX}` }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === 'increment') onChange(Math.min(value + 1, MAX));
        if (e.nativeEvent.actionName === 'decrement') onChange(Math.max(value - 1, MIN));
      }}
      {...responder.panHandlers}
    >
      <View style={styles.track} pointerEvents="none">
        <Svg width="100%" height={TRACK_HEIGHT}>
          <Defs>
            <LinearGradient id="intensity" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={colors.greenStrong} />
              <Stop offset="0.5" stopColor={colors.amber} />
              <Stop offset="1" stopColor={colors.coral} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height={TRACK_HEIGHT} rx={TRACK_HEIGHT / 2} fill="url(#intensity)" />
        </Svg>
      </View>
      {width > 0 && <View style={[styles.thumb, { left: thumbLeft }]} pointerEvents="none" />}
    </View>
  );
}

const styles = StyleSheet.create({
  hitArea: {
    height: 44,
    justifyContent: 'center',
  },
  track: {
    height: TRACK_HEIGHT,
  },
  thumb: {
    position: 'absolute',
    top: (44 - THUMB) / 2,
    width: THUMB,
    height: THUMB,
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: colors.petrol,
    backgroundColor: colors.surface,
    shadowColor: colors.petrol,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
