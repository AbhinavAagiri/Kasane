import { cn } from '@/lib/utils';

export const LayerMark = ({ className }: { className?: string }) => (
  <span className={cn('layers-mark', className)} aria-hidden="true">
    <span />
    <span />
    <span />
  </span>
);
