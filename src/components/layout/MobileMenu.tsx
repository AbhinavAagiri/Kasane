import { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { useScrollApi } from '@/hooks/useScrollApi';
import { useSearch } from '@/components/search/SearchProvider';
import { LayerMark } from '@/components/ui/LayerMark';
import { events } from '@/data/events';
import { destinations } from '@/data/destinations';

const links = [
  { label: 'Discover', href: '/', note: 'The world, edited' },
  { label: 'Explore', href: '/explore', note: `${destinations.length} places, one atlas` },
  { label: 'Journal', href: '/journal', note: 'Long-form field notes' },
  { label: 'Culture', href: '/culture', note: 'Belief, ritual, table, making' },
  { label: 'Events', href: '/events', note: `${events.length} festivals worth planning around` },
  { label: 'Plan', href: '/plan', note: 'Compose a journey, day by day' },
  { label: 'My World', href: '/my-world', note: 'Everything you have kept' },
];

export const MobileMenu = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { stop, start } = useScrollApi();
  const search = useSearch();

  useEffect(() => {
    if (open) stop();
    else start();
    return () => start();
  }, [open, stop, start]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/40 backdrop-blur-[2px] xl:hidden" />
        <Dialog.Content
          className="fixed inset-0 z-[100] flex h-[100dvh] w-full flex-col overflow-y-auto bg-forest text-ivory xl:hidden"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">KASANE navigation</Dialog.Title>
          <div className="flex items-center justify-between px-[var(--spacing-gutter)] pt-5">
            <Link to="/" onClick={() => onOpenChange(false)} className="flex items-center gap-3">
              <LayerMark className="text-ivory/70" />
              <span className="font-display text-[1.3rem] tracking-[0.14em]">KASANE</span>
            </Link>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors hover:bg-ivory/10"
              >
                <X className="h-4 w-4" strokeWidth={1.25} />
              </button>
            </Dialog.Close>
          </div>

          <nav
            aria-label="Primary"
            className="flex flex-1 flex-col justify-center px-[var(--spacing-gutter)] py-8"
          >
            {links.map((item, index) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => onOpenChange(false)}
                className="page-enter group flex items-baseline justify-between gap-6 border-b border-ivory/12 py-3.5"
                style={{ animationDelay: `${50 + index * 40}ms` }}
              >
                <span>
                  <span className="flex items-center gap-2.5">
                    {item.label === 'Events' ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-seal" aria-hidden="true" />
                    ) : null}
                    <span className="font-display text-[clamp(2rem,8vw,2.6rem)] leading-none tracking-[-0.02em]">
                      {item.label}
                    </span>
                  </span>
                  <span className="mt-1.5 block text-[0.75rem] text-ivory/50">{item.note}</span>
                </span>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-ivory/40 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          <div className="space-y-5 px-[var(--spacing-gutter)] pb-8">
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                window.setTimeout(search.open, 80);
              }}
              className="flex h-12 w-full items-center justify-between rounded-full border border-ivory/25 px-6 text-[0.875rem] transition-colors hover:bg-ivory/10"
            >
              Search the atlas
              <Search className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
            <div className="flex items-start justify-between gap-8">
              <p className="max-w-[28ch] text-[0.75rem] leading-relaxed text-ivory/45">
                An independent atlas of living culture. Built for slow looking.
              </p>
              <Link
                to="/collections"
                onClick={() => onOpenChange(false)}
                className="shrink-0 text-[0.75rem] text-ivory/60 underline decoration-ivory/25 underline-offset-4"
              >
                Collections
              </Link>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
