import * as React from 'react';
import { Input as ShadInput } from './Input';
import { cn } from '@/lib/utils';

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  helpText?: string;
  error?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, icon, helpText, error, className, ...props }, ref) => {
    if (!label && !icon && !helpText && !error) {
      return <ShadInput className={className} ref={ref} {...props} />;
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
          <ShadInput
            className={cn(
              icon && 'pl-10',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {helpText && (
          <p className="text-xs text-muted-foreground">{helpText}</p>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);
FormInput.displayName = 'FormInput';

export { FormInput };
// Also export as Input for compatibility
export const Input = FormInput;
