import { Bookmark } from 'lucide-react';
import { useAtlas } from '@/store/AtlasProvider';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

type SaveButtonProps = {
  kind: 'destination' | 'story';
  slug: string;
  name: string;
  className?: string;
  tone?: 'light' | 'dark';
  withLabel?: boolean;
};

export const SaveButton = ({
  kind,
  slug,
  name,
  className,
  tone = 'light',
  withLabel = false,
}: SaveButtonProps) => {
  const atlas = useAtlas();
  const { push } = useToast();
  const saved = kind === 'destination' ? atlas.isSaved(slug) : atlas.isStorySaved(slug);

  const toggle = () => {
    if (kind === 'destination') atlas.toggleSavedDestination(slug);
    else atlas.toggleSavedStory(slug);
    push({
      title: saved ? `Removed ${name}` : `Saved ${name}`,
      description: saved ? 'It is no longer in My World.' : 'Find it in My World, ready for a trip.',
    });
  };

  if (withLabel) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${name} from saved places` : `Save ${name}`}
        className={cn(
          'inline-flex h-11 items-center gap-2 rounded-full border px-5 text-[0.8125rem] font-medium transition-colors duration-200',
          tone === 'dark'
            ? 'border-ivory/30 text-ivory hover:bg-white/10'
            : 'border-ink/20 text-ink hover:bg-ink/5',
          className,
        )}
      >
        <Bookmark
          className="h-4 w-4"
          strokeWidth={1.5}
          fill={saved ? 'currentColor' : 'none'}
          aria-hidden="true"
        />
        {saved ? 'Saved' : 'Save'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from saved places` : `Save ${name}`}
      title={saved ? 'Remove from saved' : 'Save place'}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full border transition-[background-color,color,border-color,transform] duration-200 hover:scale-[1.04]',
        saved
          ? 'border-ink bg-ink text-ivory'
          : tone === 'dark'
            ? 'border-white/30 bg-ink/25 text-ivory hover:bg-ink/40'
            : 'border-ink/15 bg-cream/90 text-ink hover:bg-cream',
        className,
      )}
    >
      <Bookmark
        className="h-4 w-4"
        strokeWidth={1.5}
        fill={saved ? 'currentColor' : 'none'}
        aria-hidden="true"
      />
    </button>
  );
};
