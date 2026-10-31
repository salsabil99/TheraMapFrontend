import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '../theme/tokens';

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

// Outline icons on a 24px grid, 1.75 stroke, rounded caps — matches the system's editable paths.
function base({ size = 20, color = colors.textPrimary, strokeWidth = 1.75 }: IconProps) {
  return {
    svg: { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' as const },
    stroke: { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const },
  };
}

export function LogoIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M9 18h6M10 21h4" {...stroke} />
      <Path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" {...stroke} />
      <Path d="M12 8v4M10 10h4" {...stroke} />
    </Svg>
  );
}

export function LockIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Rect x={5} y={11} width={14} height={10} rx={2.5} {...stroke} />
      <Path d="M8 11V8a4 4 0 0 1 8 0v3" {...stroke} />
    </Svg>
  );
}

export function UserIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Circle cx={12} cy={8} r={4} {...stroke} />
      <Path d="M4.5 20a7.5 7.5 0 0 1 15 0" {...stroke} />
    </Svg>
  );
}

export function FolderPlusIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-10Z" {...stroke} />
      <Path d="M12 11v5M9.5 13.5h5" {...stroke} />
    </Svg>
  );
}

export function MailIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Rect x={3} y={5} width={18} height={14} rx={2.5} {...stroke} />
      <Path d="m4 7 8 6 8-6" {...stroke} />
    </Svg>
  );
}

export function EyeIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" {...stroke} />
      <Circle cx={12} cy={12} r={3} {...stroke} />
    </Svg>
  );
}

export function EyeOffIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M10.6 5.6c.5-.1.9-.1 1.4-.1 6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4M6.6 6.6C4 8.3 2.5 12 2.5 12S6 18.5 12 18.5c1.8 0 3.3-.6 4.6-1.4" {...stroke} />
      <Path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18" {...stroke} />
    </Svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M5 12h14M13 6l6 6-6 6" {...stroke} />
    </Svg>
  );
}

export function ShieldIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6l-7-3Z" {...stroke} />
    </Svg>
  );
}

export function AppleIcon({ size = 18, color = colors.textPrimary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.6 1.3-.1 1.7-.8 3.3-.8 1.5 0 1.9.8 3.3.8 1.4 0 2.2-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.7-1-2.5-4.1ZM13.9 5c.7-.8 1.2-2 1-3.2-1 .1-2.2.7-3 1.5-.6.7-1.2 1.9-1 3.1 1.1.1 2.3-.6 3-1.4Z"
      />
    </Svg>
  );
}

export function GoogleIcon({ size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.3h6c-.3 1.4-1 2.5-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8.1Z" />
      <Path fill="#34A853" d="M12 23c3 0 5.5-1 7.4-2.7l-3.6-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.8A11 11 0 0 0 12 23Z" />
      <Path fill="#FBBC05" d="M5.7 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2a11 11 0 0 0 0 9.8l3.7-2.8Z" />
      <Path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2 7.1l3.7 2.8C6.6 7.3 9.1 5.4 12 5.4Z" />
    </Svg>
  );
}

// Two-hemisphere "mind" mark used on hero cards.
export function MindIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Path
        d="M15 6.5c-1.2-1.5-4-1.6-5.3 0-2.2-.3-3.9 1.6-3.4 3.7-1.9.9-2.4 3.4-1 5-1 1.7-.2 4 1.6 4.6.1 2.3 2.4 3.8 4.5 3.1 1.1 1.5 3 1.6 3.6.6V6.5Z"
        fill={colors.pink}
      />
      <Path
        d="M17 6.5c1.2-1.5 4-1.6 5.3 0 2.2-.3 3.9 1.6 3.4 3.7 1.9.9 2.4 3.4 1 5 1 1.7.2 4-1.6 4.6-.1 2.3-2.4 3.8-4.5 3.1-1.1 1.5-3 1.6-3.6.6V6.5Z"
        fill={colors.lavender}
      />
      <Path
        d="M11 11.5c1.2.2 2 1 2 2.2M9.5 16.5c1.3-.6 2.8-.3 3.5.8M21 11.5c-1.2.2-2 1-2 2.2M22.5 16.5c-1.3-.6-2.8-.3-3.5.8"
        stroke={colors.petrol}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="m15 5-7 7 7 7" {...stroke} />
    </Svg>
  );
}

export function CheckIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="m5 12.5 4.5 4.5L19 7.5" {...stroke} />
    </Svg>
  );
}

export function RefreshIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" {...stroke} />
      <Path d="M4 4v4h4" {...stroke} />
      <Path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" {...stroke} />
      <Path d="M20 20v-4h-4" {...stroke} />
    </Svg>
  );
}

// Envelope with a pastel heart — verification illustration.
export function MailHeartIcon({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Rect x={5} y={9} width={30} height={22} rx={4} stroke={colors.petrol} strokeWidth={2} />
      <Path d="m6.5 11 13.5 10 13.5-10" stroke={colors.petrol} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M20 29c-3.6-2.4-5.5-4.3-5.5-6.4 0-1.6 1.2-2.8 2.7-2.8.9 0 1.9.5 2.8 1.6.9-1.1 1.9-1.6 2.8-1.6 1.5 0 2.7 1.2 2.7 2.8 0 2.1-1.9 4-5.5 6.4Z"
        fill={colors.pink}
        stroke={colors.petrol}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="m9 5 7 7-7 7" {...stroke} />
    </Svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="m5 9 7 7 7-7" {...stroke} />
    </Svg>
  );
}

export function HomeIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19v-8.5Z" {...stroke} />
    </Svg>
  );
}

export function BookIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5Z" {...stroke} />
      <Path d="M12 6.5v13" {...stroke} />
    </Svg>
  );
}

export function ClipboardCheckIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Rect x={5} y={4.5} width={14} height={16} rx={2.5} {...stroke} />
      <Path d="M9 4.5V3.5h6v1M9 13l2 2 4-4" {...stroke} />
    </Svg>
  );
}

export function SettingsIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Circle cx={12} cy={12} r={3} {...stroke} />
      <Path
        d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"
        {...stroke}
      />
    </Svg>
  );
}

export function ToolsIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Rect x={4} y={4} width={7} height={7} rx={2} {...stroke} />
      <Rect x={13} y={4} width={7} height={7} rx={2} {...stroke} />
      <Rect x={4} y={13} width={7} height={7} rx={2} {...stroke} />
      <Circle cx={16.5} cy={16.5} r={3.5} {...stroke} />
    </Svg>
  );
}

export function PhoneIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a1.5 1.5 0 0 1-1.5 1.5A15.5 15.5 0 0 1 3.5 5.5 1.5 1.5 0 0 1 5 4Z" {...stroke} />
    </Svg>
  );
}

export function ClockIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Circle cx={12} cy={12} r={8.5} {...stroke} />
      <Path d="M12 7.5V12l3 2" {...stroke} />
    </Svg>
  );
}

export function SproutIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M12 21v-9" {...stroke} />
      <Path d="M12 12C12 7.5 9 5 4.5 5c0 4.5 3 7 7.5 7ZM12 10c0-3.5 2.5-6 7.5-6 0 4-2.5 6-7.5 6Z" {...stroke} />
    </Svg>
  );
}

export function ReframeIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M4 9h13l-3.5-3.5M20 15H7l3.5 3.5" {...stroke} />
    </Svg>
  );
}

export function LeafIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M5 19C5 10 10 5 19 5c0 9-5 14-14 14Z" {...stroke} />
      <Path d="M5 19 13 11" {...stroke} />
    </Svg>
  );
}

export function BoltIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" {...stroke} />
    </Svg>
  );
}

export function CloudIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M7 18.5a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.5 1.5 3.75 3.75 0 0 1-.5 7.5H7Z" {...stroke} />
    </Svg>
  );
}

export function SunIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Circle cx={12} cy={12} r={4} {...stroke} />
      <Path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" {...stroke} />
    </Svg>
  );
}

export function DotsIcon(props: IconProps) {
  const { svg } = base(props);
  const fill = props.color ?? colors.textPrimary;
  return (
    <Svg {...svg}>
      <Circle cx={6} cy={12} r={1.6} fill={fill} />
      <Circle cx={12} cy={12} r={1.6} fill={fill} />
      <Circle cx={18} cy={12} r={1.6} fill={fill} />
    </Svg>
  );
}

export function ChatIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M4 12a8 8 0 1 1 3.5 6.6L4 20l1.3-3.6A8 8 0 0 1 4 12Z" {...stroke} />
    </Svg>
  );
}

export function HeartIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M12 20s-7.5-4.4-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.6-7.5 10-7.5 10Z" {...stroke} />
    </Svg>
  );
}

export function ShareIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Circle cx={18} cy={5.5} r={2.5} {...stroke} />
      <Circle cx={6} cy={12} r={2.5} {...stroke} />
      <Circle cx={18} cy={18.5} r={2.5} {...stroke} />
      <Path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1" {...stroke} />
    </Svg>
  );
}

export function FlameIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.4 2.4-5.4 3.6-8.3.5 1.9 1.6 3 2.7 3.6.2-2.8 1.5-5 3.6-7.1.3 3.2 4.1 5.8 4.1 10.8 0 4.3-3 7.2-7.5 7.2Z" {...stroke} />
      <Path d="M12 21c-1.7 0-2.8-1.2-2.8-2.8 0-1.8 1.6-2.7 2.3-4.2 1.6 1.3 3.3 2.4 3.3 4.4 0 1.5-1.2 2.6-2.8 2.6Z" {...stroke} />
    </Svg>
  );
}

export function WaveIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M3 17c2 0 2-1.5 4.5-1.5S10 17 12 17s2-1.5 4.5-1.5S19 17 21 17" {...stroke} />
      <Path d="M4 13c0-4.4 3.6-8 8-8 2.8 0 5 2 5 4.5 0 2-1.6 3.5-3.5 3.5-1.4 0-2.5-1-2.5-2.3" {...stroke} />
    </Svg>
  );
}

export function SparkleIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M10 3.5 11.6 8.4 16.5 10l-4.9 1.6L10 16.5l-1.6-4.9L3.5 10l4.9-1.6L10 3.5Z" {...stroke} />
      <Path d="M18 14.5v5M15.5 17h5" {...stroke} />
    </Svg>
  );
}

export function CloseIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M6 6l12 12M18 6 6 18" {...stroke} />
    </Svg>
  );
}

export function GlobeIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Circle cx={12} cy={12} r={8.5} {...stroke} />
      <Path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5Z" {...stroke} />
    </Svg>
  );
}

export function SearchIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Circle cx={11} cy={11} r={6.5} {...stroke} />
      <Path d="m16 16 4 4" {...stroke} />
    </Svg>
  );
}

export function SlidersIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M4 7h10M18 7h2M4 17h4M12 17h8" {...stroke} />
      <Circle cx={16} cy={7} r={2} {...stroke} />
      <Circle cx={10} cy={17} r={2} {...stroke} />
    </Svg>
  );
}

export function StarIcon({ size = 14, color = colors.amber }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"
      />
    </Svg>
  );
}

// Filled seal with a check, for verified clinicians.
export function VerifiedIcon({ size = 16, color = colors.greenText }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 2.5 14.4 4l2.8-.2 1.1 2.6 2.5 1.4-.6 2.7 1.3 2.5-1.9 2 .1 2.8-2.7.8-1.4 2.4-2.7-.7-2.4 1.5-2.1-1.8-2.8.1-.8-2.7-2.4-1.4.7-2.7L1.7 9.5l2-1.9V4.8l2.7-.8L7.8 1.6l2.7.7L12 2.5Z"
      />
      <Path d="m8 12.5 2.8 2.7L16.5 9.5" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

export function BellIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z" {...stroke} />
      <Path d="M10 20.5a2 2 0 0 0 4 0" {...stroke} />
    </Svg>
  );
}

export function LogOutIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M14 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H14" {...stroke} />
      <Path d="M10 12h10M16.5 8.5 20 12l-3.5 3.5" {...stroke} />
    </Svg>
  );
}

export function CalendarIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Rect x={3.5} y={4.5} width={17} height={16} rx={2.5} {...stroke} />
      <Path d="M8 2.5v4M16 2.5v4M3.5 10h17M8 14h2M14 14h2M8 17.5h2" {...stroke} />
    </Svg>
  );
}

export function BrainIcon(props: IconProps) {
  const { svg, stroke } = base(props);
  return (
    <Svg {...svg}>
      <Path d="M12 5a3 3 0 1 0-6 .1 4 4 0 0 0-2.5 5.8 4 4 0 0 0 .6 6.6A4 4 0 1 0 12 18V5Z" {...stroke} />
      <Path d="M12 5a3 3 0 1 1 6 .1 4 4 0 0 1 2.5 5.8 4 4 0 0 1-.6 6.6A4 4 0 1 1 12 18V5Z" {...stroke} />
      <Path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4M3.5 10.9c.2-.2.4-.3.6-.4M20 10.5c.2.1.4.2.6.4" {...stroke} />
    </Svg>
  );
}
