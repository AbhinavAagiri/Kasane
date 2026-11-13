import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  title: string;
  aside?: ReactNode;
  intro?: string;
  className?: string;
  dark?: boolean;
  id?: string;
};

export const SectionHeading = ({
  title,
  aside,
  intro,
  className,
  dark = false,
  id,
}: SectionHeadingProps) => (
  <div className={cn('border-t pt-5', dark ? 'border-ivory/18' : 'border-ink/14', className)}>
    <div className="flex flex-col gap-5 md:flex-row md:items-baseline md:justify-between md:gap-10">
      <h2 id={id} className={cn('display-md', dark ? 'text-ivory' : 'text-ink')}>
        {title}
      </h2>
      {aside ? (
        <div className={cn('shrink-0 text-[0.8125rem] leading-relaxed', dark ? 'text-ivory/74' : 'text-ink/65')}>
          {aside}
        </div>
      ) : null}
    </div>
    {intro ? (
      <p className={cn('measure mt-5 text-[0.9375rem] leading-relaxed', dark ? 'text-ivory/78' : 'text-ink/70')}>
        {intro}
      </p>
    ) : null}
  </div>
);
