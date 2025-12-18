import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: string;
  helpText?: string;
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, icon, helpText, error, className, children, ...props }, ref) => {
    if (!label && !icon && !helpText && !error) {
      return (
        <select
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
      );
    }

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-foreground flex items-center gap-2">
            {icon && <span>{icon}</span>}
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-muted-foreground">{icon}</span>
            </div>
          )}
          <select
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background appearance-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              icon && 'pl-10',
              error && 'border-destructive focus:ring-destructive',
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {helpText && (
          <p className="text-xs text-muted-foreground">{helpText}</p>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
