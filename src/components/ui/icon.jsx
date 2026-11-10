import {
  Wrench,
  Cog,
  Gauge,
  Snowflake,
  Zap,
  BatteryCharging,
  CircleDot,
  Droplets,
  Sparkles,
  Shield,
  Gem,
  Paintbrush,
  Plug,
  Car,
} from 'lucide-react';

const ICONS = {
  wrench: Wrench,
  cog: Cog,
  gauge: Gauge,
  snowflake: Snowflake,
  zap: Zap,
  'battery-charging': BatteryCharging,
  disc: CircleDot,
  droplets: Droplets,
  sparkles: Sparkles,
  shield: Shield,
  gem: Gem,
  paintbrush: Paintbrush,
  'plug-zap': Plug,
  car: Car,
};

export function CategoryIcon({ name, size = 20, strokeWidth = 1.6, ...rest }) {
  const Component = ICONS[name] || Wrench;
  return <Component size={size} strokeWidth={strokeWidth} aria-hidden="true" {...rest} />;
}
