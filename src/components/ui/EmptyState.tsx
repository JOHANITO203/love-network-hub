import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actions,
  className,
}) => (
  <div
    className={cn(
      'rounded-3xl border border-white/40 bg-white/70 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]',
      'dark:border-white/5 dark:bg-gray-900/70 backdrop-blur-xl text-center space-y-6',
      className,
    )}
  >
    {icon && (
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg">
        {icon}
      </div>
    )}
    <div className="space-y-2">
      <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
    {actions && <div className="flex flex-col items-center gap-3">{actions}</div>}
  </div>
);
