import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
};

export const Field = ({ id, label, error, hint, optional, className, children }: FieldProps) => (
  <div className={cn('flex flex-col gap-2', className)}>
    <div className="flex items-baseline justify-between gap-4">
      <label htmlFor={id} className="text-[0.8125rem] font-medium text-ink/70">
        {label}
        {optional ? <span className="ml-1.5 font-normal text-ink/45">optional</span> : null}
      </label>
      {error ? (
        <span id={`${id}-error`} className="text-[0.75rem] text-[#8a3a2c]">
          {error}
        </span>
      ) : null}
    </div>
    {children}
    {hint && !error ? (
      <p id={`${id}-hint`} className="text-[0.75rem] leading-relaxed text-ink/52">
        {hint}
      </p>
    ) : null}
  </div>
);

const controlStyles =
  'w-full rounded-none border-0 border-b border-ink/20 bg-transparent px-0 py-2.5 text-[1rem] text-ink placeholder:text-ink/40 transition-colors duration-200 focus:border-ink/60 focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-[#8a3a2c]';

export const Input = ({ className, ...props }: ComponentPropsWithoutRef<'input'>) => (
  <input className={cn(controlStyles, className)} {...props} />
);

export const Textarea = ({ className, ...props }: ComponentPropsWithoutRef<'textarea'>) => (
  <textarea className={cn(controlStyles, 'resize-y leading-relaxed', className)} rows={4} {...props} />
);

export const Select = ({ className, children, ...props }: ComponentPropsWithoutRef<'select'>) => (
  <div className="relative">
    <select className={cn(controlStyles, 'cursor-pointer appearance-none pr-8', className)} {...props}>
      {children}
    </select>
    <svg
      aria-hidden="true"
      viewBox="0 0 12 8"
      className="pointer-events-none absolute right-1 top-1/2 h-2 w-3 -translate-y-1/2 fill-none stroke-ink/45"
      strokeWidth="1"
    >
      <path d="M1 1.5 6 6.5l5-5" />
    </svg>
  </div>
);

export const FieldError = ({ id, message }: { id: string; message: string }) => (
  <p id={id} role="alert" className="text-[0.75rem] text-[#8a3a2c]">
    {message}
  </p>
);
