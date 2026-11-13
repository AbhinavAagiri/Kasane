import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus } from 'lucide-react';
import { curatedCollections } from '@/data/collections';
import { destinationBySlug } from '@/data/destinations';
import { useAtlas } from '@/store/AtlasProvider';
import { useToast } from '@/components/ui/Toast';
import { usePageMeta } from '@/hooks/usePageMeta';
import { collectionsMeta } from '@/seo/routes';
import { SmartImage } from '@/components/media/SmartImage';
import { Modal } from '@/components/ui/Modal';
import { Field, Input, Textarea } from '@/components/ui/field';
import { LayerMark } from '@/components/ui/LayerMark';
import type { UserCollection } from '@/data/types';
import { pluralize } from '@/lib/format';

const UserCollectionCard = ({ collection }: { collection: UserCollection }) => {
  const first = destinationBySlug[collection.destinationSlugs[0] ?? ''];
  const count = collection.destinationSlugs.length + collection.storySlugs.length;

  return (
    <Link to={`/collections/${collection.id}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-paper">
        {first ? (
          <div className="h-full w-full transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.025]">
            <SmartImage
              name={first.image.src}
              alt={first.image.alt}
              sizes="(min-width: 768px) 30vw, 100vw"
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-stone/60">
            <LayerMark className="scale-150 text-ink/35" />
          </div>
        )}
      </div>
      <h3 className="mt-4 font-display text-[1.55rem] leading-tight">{collection.title}</h3>
      <p className="mt-1.5 text-[0.75rem] text-ink/45">
        {count} {count === 1 ? 'entry' : 'entries'} · Yours
      </p>
    </Link>
  );
};

export const CollectionsPage = () => {
  const atlas = useAtlas();
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  usePageMeta(collectionsMeta);

  const create = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Give the collection a name.');
      return;
    }
    atlas.createCollection({ title: trimmed, description: description.trim() });
    push({ title: `Created ${trimmed}`, description: 'Add places from any destination page.' });
    setTitle('');
    setDescription('');
    setError('');
    setOpen(false);
  };

  return (
    <>
      <section className="pb-12 pt-[calc(var(--nav-h)+3.5rem)] md:pt-[calc(var(--nav-h)+5rem)]">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="text-[0.75rem] text-ink/45">Collections</p>
              <h1 className="display-xl mt-3 max-w-[15ch]">A place for what stays with you.</h1>
            </div>
            <div className="max-w-[36ch] pb-2">
              <p className="text-[0.9375rem] leading-relaxed text-ink/60">
                Gather places and stories around an idea. Start with one of ours, or make a
                collection that only makes sense to you.
              </p>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[0.8125rem] font-medium text-ivory transition-colors hover:bg-forest"
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                New collection
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper py-12">
        <div className="shell">
          <div className="flex items-baseline justify-between border-b border-ink/12 pb-5">
            <h2 className="display-md">Yours</h2>
            <span className="text-[0.75rem] text-ink/45">
              {atlas.collections.length} {atlas.collections.length === 1 ? 'collection' : 'collections'}
            </span>
          </div>

          {atlas.collections.length ? (
            <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {atlas.collections.map((collection) => (
                <UserCollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-start gap-5 border border-ink/12 bg-cream p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="flex items-start gap-4">
                <LayerMark className="mt-2 text-olive" />
                <div>
                  <p className="font-display text-[1.65rem] leading-tight">No collections yet.</p>
                  <p className="mt-1.5 max-w-[46ch] text-[0.875rem] leading-relaxed text-ink/60">
                    A collection can be a shortlist, an argument, or a trip you are not ready to
                    plan. Give it a name and add places from anywhere in the atlas.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-ink/20 px-5 text-[0.8125rem]"
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                Start one
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="pb-[var(--spacing-section)] pt-16">
        <div className="shell">
          <div className="flex items-baseline justify-between border-b border-ink/12 pb-5">
            <h2 className="display-md">Curated by KASANE</h2>
            <span className="text-[0.75rem] text-ink/45">{curatedCollections.length} collections</span>
          </div>

          <div className="mt-10 grid gap-x-6 gap-y-14 md:grid-cols-12">
            {curatedCollections.map((collection, index) => (
              <article
                key={collection.slug}
                className={
                  index % 4 === 0
                    ? 'md:col-span-7'
                    : index % 4 === 1
                      ? 'md:col-span-4 md:col-start-9 md:mt-16'
                      : index % 4 === 2
                        ? 'md:col-span-4'
                        : 'md:col-span-4 md:mt-12'
                }
              >
                <Link to={`/collections/${collection.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-paper">
                    <div className="h-full w-full transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.02]">
                      <SmartImage
                        name={collection.image.src}
                        alt={collection.image.alt}
                        sizes="(min-width: 768px) 40vw, 100vw"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-5">
                    <div>
                      <h3 className="display-sm">{collection.title}</h3>
                      <p className="mt-2 max-w-[42ch] text-[0.875rem] leading-relaxed text-ink/60">
                        {collection.description}
                      </p>
                    </div>
                    <ArrowUpRight
                      className="mt-1 h-4 w-4 shrink-0 text-ink/35 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-2 text-[0.75rem] text-ink/40">
                    {pluralize(collection.destinationSlugs.length, 'place')},{' '}
                    {pluralize(collection.storySlugs.length, 'story', 'stories')}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="New collection"
        description="A name and a sentence are enough. You can add places and stories later."
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-11 rounded-full px-4 text-[0.8125rem] text-ink/60 hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={create}
              className="h-11 rounded-full bg-ink px-6 text-[0.8125rem] font-medium text-ivory"
            >
              Create collection
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          <Field id="collection-title" label="Name" error={error}>
            <Input
              id="collection-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError('');
              }}
              placeholder="Somewhere quiet"
              maxLength={60}
              autoFocus
              aria-invalid={Boolean(error)}
            />
          </Field>
          <Field id="collection-description" label="Description" optional>
            <Textarea
              id="collection-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What holds these places together?"
              rows={3}
              maxLength={180}
            />
          </Field>
        </div>
      </Modal>
    </>
  );
};
