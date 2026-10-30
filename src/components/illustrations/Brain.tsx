import Svg, { Path } from 'react-native-svg';

import { colors } from '../../theme/tokens';

// Split-brain illustration (from the supplied Split_brain_illustration.svg).
// The source stacked two copies at 24% opacity; this draws a single layer at
// full strength and crops the viewBox to the artwork. Pass `opacity` to fade it.

const LEFT_HEMISPHERE =
  'M158.994 104.4C158.994 70.7996 120.594 61.1996 96.5938 75.5996C77.3938 85.1996 67.7938 99.5996 67.7938 118.8C38.9939 123.6 29.3939 147.6 38.9939 171.6C14.9939 190.8 14.9939 224.4 34.1939 243.6C19.7939 272.4 38.9939 306 67.7938 306C82.1938 339.6 134.994 344.4 158.994 306V104.4Z';
const RIGHT_HEMISPHERE =
  'M159 104.4C159 70.7996 197.4 61.1996 221.4 75.5996C240.6 85.1996 250.2 99.5996 250.2 118.8C279 123.6 288.6 147.6 279 171.6C303 190.8 303 224.4 283.8 243.6C298.2 272.4 279 306 250.2 306C235.8 339.6 183 344.4 159 306V104.4Z';
const FOLDS =
  'M67.8012 118.801C91.8012 114.001 111.001 128.401 111.001 152.401M39.0012 171.601C67.8012 157.201 91.8012 176.401 91.8012 200.401M63.0012 200.401C63.0012 229.201 91.8012 248.401 115.801 229.201M101.401 238.801C101.401 262.801 87.0012 272.401 72.6012 272.401M34.2012 243.601C43.8012 258.001 58.2012 262.801 72.6012 262.801M72.6012 301.201C101.401 286.801 125.401 301.201 125.401 320.401M125.401 171.601C135.001 166.801 149.401 171.601 159.001 190.801C168.601 171.601 183.001 166.801 192.601 171.601M115.801 258.001C130.201 258.001 144.601 262.801 159.001 286.801C173.401 262.801 187.801 258.001 202.201 258.001M250.201 118.801C226.201 114.001 207.001 128.401 207.001 152.401M279.001 171.601C250.201 157.201 226.201 176.401 226.201 200.401M255.001 200.401C255.001 229.201 226.201 248.401 202.201 229.201M216.601 238.801C216.601 262.801 231.001 272.401 245.401 272.401M283.801 243.601C274.201 258.001 259.801 262.801 245.401 262.801M245.401 301.201C216.601 286.801 192.601 301.201 192.601 320.401';

// Artwork bounds inside the original 326×360 canvas, with room for the stroke.
export const BRAIN_VIEWBOX = { x: 12, y: 60, width: 294, height: 280 };
export const BRAIN_ASPECT = BRAIN_VIEWBOX.height / BRAIN_VIEWBOX.width;

type Props = {
  width: number;
  opacity?: number;
  leftFill?: string;
  rightFill?: string;
};

export function Brain({ width, opacity = 1, leftFill = '#DED9F8', rightFill = '#CEE9F5' }: Props) {
  const stroke = {
    stroke: colors.petrol,
    strokeWidth: 7.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const { x, y, width: w, height: h } = BRAIN_VIEWBOX;
  return (
    <Svg width={width} height={width * BRAIN_ASPECT} viewBox={`${x} ${y} ${w} ${h}`} opacity={opacity}>
      <Path d={LEFT_HEMISPHERE} fill={leftFill} {...stroke} />
      <Path d={RIGHT_HEMISPHERE} fill={rightFill} {...stroke} />
      <Path d={FOLDS} fill="none" {...stroke} />
    </Svg>
  );
}
