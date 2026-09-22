import React from 'react';

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  description,
  badge,
  action,
  align = 'left',
  className = '',
}) => {
  return (
    <div
      className={`mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 ${
        align === 'center' ? 'text-center items-center' : ''
      } ${className}`}
    >
      <div className={`space-y-1.5 ${align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-3xl'}`}>
        {label && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-cyan-400">
              {label}
            </span>
            {badge && <span>{badge}</span>}
          </div>
        )}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-slate-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
};
