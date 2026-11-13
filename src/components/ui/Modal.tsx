import { useEffect, type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useScrollApi } from '@/hooks/useScrollApi';
import { cn } from '@/lib/utils';

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  wide?: boolean;
};

export const Modal = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  wide = false,
}: ModalProps) => {
  const { stop, start } = useScrollApi();

  useEffect(() => {
    if (open) stop();
    else start();
    return () => start();
  }, [open, stop, start]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[110] bg-ink/45 backdrop-blur-[2px]" />
        <Dialog.Content
          className={cn(
            'fixed inset-x-0 bottom-0 z-[120] max-h-[92dvh] overflow-y-auto border border-ink/10 bg-ivory p-6 text-ink shadow-[0_30px_90px_-40px_rgba(16,18,15,0.6)] sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:-translate-x-1/2 sm:-translate-y-1/2 sm:p-8',
            wide ? 'sm:w-[min(46rem,calc(100vw-3rem))]' : 'sm:w-[min(31rem,calc(100vw-3rem))]',
            className,
          )}
          aria-describedby={description ? 'modal-description' : undefined}
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <Dialog.Title className="display-sm">{title}</Dialog.Title>
              {description ? (
                <Dialog.Description
                  id="modal-description"
                  className="mt-2 max-w-[42ch] text-[0.875rem] leading-relaxed text-ink/60"
                >
                  {description}
                </Dialog.Description>
              ) : null}
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="-mr-1 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <X className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <div className="mt-6">{children}</div>
          {footer ? <div className="mt-7 border-t border-ink/10 pt-5">{footer}</div> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
