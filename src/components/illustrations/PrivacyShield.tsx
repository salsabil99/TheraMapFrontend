import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { colors } from '../../theme/tokens';

// Onboarding "Strict Privacy" hero: a shield holding a padlock, with two leaves.
export function PrivacyShield({ size = 150 }: { size?: number }) {
  const stroke = {
    stroke: colors.petrol,
    strokeWidth: 3,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      accessibilityLabel="A shield with a padlock"
    >
      {/* Shield */}
      <Path d="M60 10 18 26v32c0 25 18 42 42 52 24-10 42-27 42-52V26L60 10Z" fill={colors.greenSoft} {...stroke} />
      {/* Leaves */}
      <Ellipse cx={31} cy={66} rx={5} ry={8} transform="rotate(-25 31 66)" fill={colors.paleGreen} />
      <Ellipse cx={89} cy={66} rx={5} ry={8} transform="rotate(25 89 66)" fill={colors.paleGreen} />
      {/* Padlock */}
      <Path d="M48 56V46a12 12 0 0 1 24 0v10" {...stroke} />
      <Rect x={42} y={56} width={36} height={30} rx={6} fill={colors.surface} {...stroke} />
      <Circle cx={60} cy={68} r={3.5} fill={colors.greenText} />
      <Path d="M60 70v7" stroke={colors.greenText} strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
}
