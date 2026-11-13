import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/field';
import { useAtlas } from '@/store/AtlasProvider';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import { pluralize } from '@/lib/format';

type CollectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destinationSlug?: string;
  storySlug?: string;
  name: string;
};

export const CollectionDialog = ({
  open,
  onOpenChange,
  destinationSlug,
  storySlug,
  name,
}: CollectionDialogProps) => {
  const atlas = useAtlas();
  const { push } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const contains = (collection: (typeof atlas.collections)[number]) =>
    destinationSlug
      ? collection.destinationSlugs.includes(destinationSlug)
      : collection.storySlugs.includes(storySlug ?? '');

  const toggle = (collection: (typeof atlas.collections)[number]) => {
    const item = destinationSlug ? { destinationSlug } : { storySlug };
    if (contains(collection)) {
      atlas.removeFromCollection(collection.id, item);
      push({ title: `Removed from ${collection.title}` });
    } else {
      atlas.addToCollection(collection.id, item);
      push({ title: `Added to ${collection.title}` });
    }
  };

  const create = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Give the collection a name.');
      return;
    }
    const id = atlas.createCollection({ title: trimmed, destinationSlug, storySlug });
    push({
      title: `Created ${trimmed}`,
      description: destinationSlug || storySlug ? `${name} is the first entry.` : undefined,
    });
    setTitle('');
    setError('');
    setShowForm(false);
    onOpenChange(false);
    return id;
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Collect ${name}`}
      description="Collections are yours to shape. A place can sit in more than one."
      footer={
        <div className="flex items-center justify-between gap-4 text-[0.8125rem] text-ink/55">
          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            className="link-quiet text-ink"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            New collection
          </button>
          <span>{pluralize(atlas.collections.length, 'collection')}</span>
        </div>
      }
    >
      {atlas.collections.length ? (
        <ul className="flex flex-col">
          {atlas.collections.map((collection) => {
            const included = contains(collection);
            return (
              <li key={collection.id} className="border-b border-ink/8 last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggle(collection)}
                  aria-pressed={included}
                  className="flex w-full items-center justify-between gap-4 py-3.5 text-left transition-colors hover:text-olive"
                >
                  <span>
                    <span className="block text-[0.9375rem] leading-snug">{collection.title}</span>
                    <span className="mt-0.5 block text-[0.75rem] text-ink/50">
                      {collection.destinationSlugs.length + collection.storySlugs.length} saved
                    </span>
                  </span>
                  <span
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors',
                      included
                        ? 'border-ink bg-ink text-ivory'
                        : 'border-ink/25 text-transparent',
                    )}
                    aria-hidden="true"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {showForm || !atlas.collections.length ? (
        <form
          className="mt-5 border-t border-ink/10 pt-5"
          onSubmit={(event) => {
            event.preventDefault();
            create();
          }}
        >
          <label
            htmlFor="new-collection-title"
            className="text-[0.8125rem] font-medium text-ink/70"
          >
            Name a new collection
          </label>
          <div className="mt-2 flex items-end gap-3">
            <Input
              id="new-collection-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError('');
              }}
              placeholder="Places that stay with me"
              maxLength={60}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'new-collection-error' : undefined}
              autoFocus={!atlas.collections.length}
            />
            <button
              type="submit"
              className="h-10 shrink-0 rounded-full bg-ink px-5 text-[0.8125rem] font-medium text-ivory transition-colors hover:bg-forest"
            >
              Create
            </button>
          </div>
          {error ? (
            <p id="new-collection-error" role="alert" className="mt-2 text-[0.75rem] text-[#8a3a2c]">
              {error}
            </p>
          ) : (
            <p className="mt-2 text-[0.75rem] text-ink/50">
              {name} will be added straight away.
            </p>
          )}
        </form>
      ) : null}
    </Modal>
  );
};
