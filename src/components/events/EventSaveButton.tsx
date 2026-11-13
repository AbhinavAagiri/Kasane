import { Bookmark, Check } from 'lucide-react';
import { useAtlas } from '@/store/AtlasProvider';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

type EventSaveButtonProps = {
  slug: string;
  name: string;
  tone?: 'light' | 'dark';
  withLabel?: boolean;
  className?: string;
};

export const EventSaveButton = ({
  slug,
  name,
  tone = 'light',
  withLabel = false,
  className,
}: EventSaveButtonProps) => {
  const atlas = useAtlas();
  const { push } = useToast();
  const saved = atlas.isEventSaved(slug);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from saved events` : `Save ${name}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        atlas.toggleSavedEvent(slug);
        push({
          title: saved ? `${name} removed from saved events` : `${name} saved`,
          description: saved ? undefined : 'Find it in My World.',
        });
      }}
      className={cn(
        'inline-flex h-10 items-center gap-2 rounded-full border px-3.5 text-[0.75rem] transition-colors',
        tone === 'dark'
          ? saved
            ? 'border-ivory bg-ivory text-ink'
            : 'border-ivory/30 text-ivory hover:border-ivory/60 hover:bg-white/[0.06]'
          : saved
            ? 'border-ink bg-ink text-ivory'
            : 'border-ink/18 text-ink/65 hover:border-ink/40 hover:text-ink',
        className,
      )}
    >
      {saved ? (
        <Check className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <Bookmark className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
      )}
      {withLabel ? (saved ? 'Saved' : 'Save event') : null}
    </button>
  );
};
