import { cn } from '@/lib/utils';

interface GlowOrbProps {
  className?: string;
  size?: string;
  opacity?: number;
}

export function GlowOrb({ className, size = '500px', opacity = 0.2 }: GlowOrbProps) {
  return (
    <div
      className={cn(
        'absolute rounded-full pointer-events-none blur-3xl animate-pulse-glow',
        className
      )}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(127, 232, 138, ${opacity}) 0%, transparent 70%)`,
      }}
    />
  );
}
