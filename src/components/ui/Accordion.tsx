import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  subtitle,
  icon,
  badge,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden transition-colors">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-800/30 transition-colors select-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0">
          {icon && <span className="shrink-0 flex items-center text-slate-400">{icon}</span>}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200 text-sm sm:text-base truncate">
                {title}
              </span>
              {badge && <span>{badge}</span>}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-400 truncate mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-cyan-400' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-800/60 animate-in fade-in duration-150">
          {children}
        </div>
      )}
    </div>
  );
};
