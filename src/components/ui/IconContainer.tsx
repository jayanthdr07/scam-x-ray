import React from 'react';

export type IconContainerSize = 'sm' | 'md' | 'lg';
export type IconContainerVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

interface IconContainerProps {
  children: React.ReactNode;
  size?: IconContainerSize;
  variant?: IconContainerVariant;
  className?: string;
  title?: string;
}

const sizeClasses: Record<IconContainerSize, string> = {
  sm: 'w-6 h-6 rounded-md text-xs',
  md: 'w-8 h-8 rounded-lg text-sm',
  lg: 'w-10 h-10 rounded-xl text-base',
};

const variantClasses: Record<IconContainerVariant, string> = {
  neutral: 'bg-slate-800/80 text-slate-300 border border-slate-700/60',
  info: 'bg-cyan-950/70 text-cyan-400 border border-cyan-500/30',
  success: 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/30',
  warning: 'bg-amber-950/70 text-amber-400 border border-amber-500/30',
  danger: 'bg-rose-950/70 text-rose-400 border border-rose-500/30',
};

export const IconContainer: React.FC<IconContainerProps> = ({
  children,
  size = 'md',
  variant = 'neutral',
  className = '',
  title,
}) => {
  return (
    <div
      title={title}
      className={`inline-flex items-center justify-center shrink-0 transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
};
