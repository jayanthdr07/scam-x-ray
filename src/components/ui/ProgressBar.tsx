import React from 'react';

export type ProgressVariant = 'primary' | 'success' | 'warning' | 'danger' | 'purple';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  valueDisplay?: string | number;
  variant?: ProgressVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles: Record<ProgressVariant, string> = {
  primary: 'bg-cyan-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  purple: 'bg-purple-500',
};

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  valueDisplay,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      {(label || valueDisplay !== undefined) && (
        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
          {label && <span className="text-slate-300 font-medium">{label}</span>}
          {valueDisplay !== undefined && (
            <span className="text-slate-400 font-semibold">{valueDisplay}</span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${variantStyles[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
