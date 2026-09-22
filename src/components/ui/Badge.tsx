import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30',
  warning: 'bg-amber-950/70 text-amber-300 border-amber-500/30',
  danger: 'bg-rose-950/70 text-rose-300 border-rose-500/30',
  info: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/30',
  neutral: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-[11px] px-2 py-0.5 gap-1.5',
  md: 'text-xs px-2.5 py-1 gap-2',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center font-medium font-mono rounded-md border whitespace-nowrap leading-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
