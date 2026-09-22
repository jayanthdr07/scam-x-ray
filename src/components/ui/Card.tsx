import React from 'react';

export type CardVariant = 'default' | 'subtle' | 'interactive' | 'danger' | 'warning' | 'success';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  className?: string;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    'bg-slate-900/60 border border-slate-800/80 shadow-lg shadow-black/20 backdrop-blur-sm',
  subtle:
    'bg-slate-900/30 border border-slate-800/50',
  interactive:
    'bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/90 hover:bg-slate-900/80 transition-all shadow-md shadow-black/10 cursor-pointer',
  danger:
    'bg-rose-950/20 border border-rose-500/30 shadow-lg shadow-rose-950/10',
  warning:
    'bg-amber-950/20 border border-amber-500/30 shadow-lg shadow-amber-950/10',
  success:
    'bg-emerald-950/20 border border-emerald-500/30 shadow-lg shadow-emerald-950/10',
};

const paddingStyles = {
  none: '',
  sm: 'p-4 sm:p-5',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  return (
    <div
      {...props}
      className={`rounded-2xl ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
};
