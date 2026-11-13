import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonStyles = cva(
  'group/btn relative inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-body text-[0.875rem] font-medium tracking-[-0.005em] transition-[background-color,color,border-color,transform] duration-200 ease-[var(--ease-out)] disabled:pointer-events-none disabled:opacity-45 active:scale-[0.985]',
  {
    variants: {
      variant: {
        primary: 'bg-ink text-ivory hover:bg-forest',
        light: 'bg-ivory text-ink hover:bg-cream',
        outline: 'border border-ink/22 text-ink hover:border-ink/45 hover:bg-ink/[0.035]',
        outlineLight: 'border border-ivory/35 text-ivory hover:border-ivory/70 hover:bg-white/[0.05]',
        ghost: 'px-0 text-ink hover:opacity-60',
        olive: 'bg-olive text-ivory hover:bg-[#4c5041]',
      },
      size: {
        sm: 'h-10 px-5 text-[0.8125rem]',
        md: 'h-12 px-6',
        lg: 'h-[3.25rem] px-7',
        icon: 'h-11 w-11 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type ButtonBaseProps = VariantProps<typeof buttonStyles> & {
  className?: string;
  children: ReactNode;
};

type ButtonProps<T extends ElementType> = ButtonBaseProps & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof ButtonBaseProps | 'as'>;

export const Button = <T extends ElementType = 'button'>({
  as,
  className,
  variant,
  size,
  children,
  ...rest
}: ButtonProps<T>) => {
  const Component = (as ?? 'button') as ElementType;
  return (
    <Component className={cn(buttonStyles({ variant, size }), className)} {...rest}>
      {children}
    </Component>
  );
};

export const ArrowCircle = ({ children }: { children: ReactNode }) => (
  <span aria-hidden="true" className="btn-icon shrink-0">
    {children}
  </span>
);
