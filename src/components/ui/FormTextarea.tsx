import * as React from 'react';
import { Textarea as ShadTextarea } from './Textarea';
import { cn } from '@/lib/utils';

export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  icon?: string;
  helpText?: string;
  error?: string;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, icon, helpText, error, className, ...props }, ref) => {
    if (!label && !icon && !helpText && !error) {
      return <ShadTextarea className={className} ref={ref} {...props} />;
    }

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-foreground flex items-center gap-2">
            {icon && <span>{icon}</span>}
            {label}
          </label>
        )}
        <ShadTextarea
          className={cn(
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          {...props}
        />
        {helpText && (
          <p className="text-xs text-muted-foreground">{helpText}</p>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);
FormTextarea.displayName = 'FormTextarea';

export { FormTextarea };
// Also export as Textarea for compatibility
export const Textarea = FormTextarea;
