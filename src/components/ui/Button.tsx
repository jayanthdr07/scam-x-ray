import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-2 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-xl font-semibold',
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold shadow-sm hover:shadow active:scale-[0.99] border border-transparent',
  secondary:
    'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 active:scale-[0.99]',
  ghost:
    'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent',
  danger:
    'bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-sm border border-transparent',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  rightIcon,
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium transition-all select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0 flex items-center">{icon}</span>
      )}
      {children && <span className="truncate">{children}</span>}
      {!isLoading && rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
    </button>
  );
};
