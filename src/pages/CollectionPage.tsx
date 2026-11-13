import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowUpRight, Plus, Trash2 } from 'lucide-react';
import { curatedCollections } from '@/data/collections';
import { destinationBySlug, destinations } from '@/data/destinations';
import { stories, storyBySlug } from '@/data/stories';
import { useAtlas } from '@/store/AtlasProvider';
import { useToast } from '@/components/ui/Toast';
import { usePageMeta } from '@/hooks/usePageMeta';
import { collectionRouteMeta, userCollectionMeta } from '@/seo/routes';
import { SmartImage } from '@/components/media/SmartImage';
import { DestinationCard } from '@/components/atlas/DestinationCard';
import { StoryCard } from '@/components/atlas/StoryCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { LayerMark } from '@/components/ui/LayerMark';
import { pluralize } from '@/lib/format';

export const CollectionPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const atlas = useAtlas();
  const { push } = useToast();
  const curated = curatedCollections.find((collection) => collection.slug === slug);
  const mine = atlas.collections.find((collection) => collection.id === slug);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [title, setTitle] = useState(mine?.title ?? '');
  const [description, setDescription] = useState(mine?.description ?? '');
  const [placeToAdd, setPlaceToAdd] = useState('');
  const [storyToAdd, setStoryToAdd] = useState('');
  const [error, setError] = useState('');

  const collection = mine ?? curated;
  const isMine = Boolean(mine);

  usePageMeta(
    mine
      ? userCollectionMeta(mine.title, mine.description, mine.id)
      : collectionRouteMeta(slug),
  );

  if (!collection) {
    return (
      <section className="shell flex min-h-[70svh] flex-col justify-center py-32">
        <p className="text-[0.75rem] text-ink/45">Collections</p>
        <h1 className="display-lg mt-4">This collection is not here.</h1>
        <p className="mt-5 max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink/65">
          It may have been deleted, or it may belong to someone else. Your own collections are
          waiting in the list.
        </p>
        <Button as={Link} to="/collections" variant="primary" className="mt-8 w-fit">
          All collections
        </Button>
      </section>
    );
  }

  const collectionDestinations = collection.destinationSlugs
    .map((destinationSlug) => destinationBySlug[destinationSlug])
    .filter(Boolean);
  const collectionStories = collection.storySlugs
    .map((storySlug) => storyBySlug[storySlug])
    .filter(Boolean);
  const coverDestination = collectionDestinations[0];
  const cover = isMine
    ? coverDestination?.image
    : curated?.image;
  const availableDestinations = destinations.filter(
    (destination) => !collection.destinationSlugs.includes(destination.slug),
  );
  const availableStories = stories.filter((story) => !collection.storySlugs.includes(story.slug));

  const rename = () => {
    if (!mine) return;
    if (!title.trim()) {
      setError('Give the collection a name.');
      return;
    }
    atlas.updateCollection(mine.id, { title: title.trim(), description: description.trim() });
    push({ title: 'Collection updated' });
    setRenameOpen(false);
  };

  const addPlace = () => {
    if (!mine || !placeToAdd) return;
    atlas.addToCollection(mine.id, { destinationSlug: placeToAdd });
    const destination = destinationBySlug[placeToAdd];
    push({ title: `${destination?.name ?? 'Place'} added to ${mine.title}` });
    setPlaceToAdd('');
  };

  const addStory = () => {
    if (!mine || !storyToAdd) return;
    atlas.addToCollection(mine.id, { storySlug: storyToAdd });
    const story = storyBySlug[storyToAdd];
    push({ title: `${story?.title ?? 'Story'} added to ${mine.title}` });
    setStoryToAdd('');
  };

  return (
    <>
      <section className="border-b border-ink/10 bg-paper pb-12 pt-[calc(var(--nav-h)+2.5rem)]">
        <div className="shell">
          <div className="flex items-center gap-2 text-[0.75rem] text-ink/45">
            <Link to="/collections" className="hover:text-ink">
              Collections
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink/60">{isMine ? 'Yours' : 'Curated'}</span>
          </div>

          <div className="mt-8 grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <div className="flex items-center gap-3 text-[0.75rem] text-ink/45">
                <LayerMark className="text-olive" />
                <span>
                  {pluralize(
                    collection.destinationSlugs.length + collection.storySlugs.length,
                    'entry',
                    'entries',
                  )}
                </span>
              </div>
              <h1 className="display-lg mt-5 max-w-[18ch]">{collection.title}</h1>
              {collection.description ? (
                <p className="mt-5 max-w-[52ch] text-[1rem] leading-relaxed text-ink/65">
                  {collection.description}
                </p>
              ) : null}

              <div className="mt-7 flex flex-wrap gap-3">
                {isMine ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setAddOpen(true)}
                      className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[0.8125rem] font-medium text-ivory transition-colors hover:bg-forest"
                    >
                      <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                      Add places or stories
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTitle(mine?.title ?? '');
                        setDescription(mine?.description ?? '');
                        setRenameOpen(true);
                      }}
                      className="h-11 rounded-full border border-ink/20 px-5 text-[0.8125rem] transition-colors hover:border-ink/40"
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteOpen(true)}
                      className="flex h-11 items-center gap-2 rounded-full px-4 text-[0.8125rem] text-ink/50 transition-colors hover:text-[#8a3a2c]"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                      Delete
                    </button>
                  </>
                ) : (
                  <Button as={Link} to="/explore" variant="primary">
                    Explore the atlas
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  </Button>
                )}
              </div>
            </div>

            <div className="md:col-span-5">
              {cover ? (
                <div className="aspect-[4/3] overflow-hidden bg-stone">
                  <SmartImage name={cover.src} alt={cover.alt} sizes="(min-width: 768px) 38vw, 100vw" />
                </div>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center border border-ink/12 bg-cream">
                  <LayerMark className="scale-150 text-ink/30" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell">
          {collectionDestinations.length || collectionStories.length ? (
            <div className="flex flex-col gap-16">
              {collectionDestinations.length ? (
                <div>
                  <div className="flex items-baseline justify-between border-b border-ink/12 pb-4">
                    <h2 className="display-sm">Places</h2>
                    <span className="text-[0.75rem] text-ink/40">
                      {collectionDestinations.length}
                    </span>
                  </div>
                  <div className="mt-8 grid gap-x-6 gap-y-12 md:grid-cols-2">
                    {collectionDestinations.map((destination) =>
                      destination ? (
                        <div key={destination.slug}>
                          <DestinationCard
                            destination={destination}
                            ratio="4 / 3"
                            sizes="(min-width: 768px) 46vw, 100vw"
                          />
                          {isMine && mine ? (
                            <button
                              type="button"
                              onClick={() => {
                                atlas.removeFromCollection(mine.id, {
                                  destinationSlug: destination.slug,
                                });
                                push({ title: `${destination.name} removed` });
                              }}
                              className="mt-3 text-[0.75rem] text-ink/40 underline decoration-ink/20 underline-offset-4 hover:text-ink"
                            >
                              Remove from collection
                            </button>
                          ) : null}
                        </div>
                      ) : null,
                    )}
                  </div>
                </div>
              ) : null}

              {collectionStories.length ? (
                <div>
                  <div className="flex items-baseline justify-between border-b border-ink/12 pb-4">
                    <h2 className="display-sm">Stories</h2>
                    <span className="text-[0.75rem] text-ink/40">{collectionStories.length}</span>
                  </div>
                  <div className="mt-8 grid gap-x-6 gap-y-12 md:grid-cols-2">
                    {collectionStories.map((story) =>
                      story ? (
                        <div key={story.slug}>
                          <StoryCard story={story} sizes="(min-width: 768px) 46vw, 100vw" />
                          {isMine && mine ? (
                            <button
                              type="button"
                              onClick={() => {
                                atlas.removeFromCollection(mine.id, { storySlug: story.slug });
                                push({ title: 'Story removed' });
                              }}
                              className="mt-3 text-[0.75rem] text-ink/40 underline decoration-ink/20 underline-offset-4 hover:text-ink"
                            >
                              Remove from collection
                            </button>
                          ) : null}
                        </div>
                      ) : null,
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="border border-ink/12 bg-cream px-6 py-16 text-center">
              <LayerMark className="mx-auto text-olive" />
              <p className="mt-5 font-display text-[2rem]">This collection is waiting.</p>
              <p className="mx-auto mt-3 max-w-[42ch] text-[0.9375rem] leading-relaxed text-ink/60">
                Add a place from the atlas, or save a story as you read. A collection can hold
                both.
              </p>
              {isMine ? (
                <button
                  type="button"
                  onClick={() => setAddOpen(true)}
                  className="mt-6 h-11 rounded-full bg-ink px-5 text-[0.8125rem] font-medium text-ivory"
                >
                  Add something
                </button>
              ) : (
                <Button as={Link} to="/explore" variant="primary" className="mt-6">
                  Explore the atlas
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {isMine && mine ? (
        <>
          <Modal
            open={addOpen}
            onOpenChange={setAddOpen}
            title="Add to this collection"
            description="Choose a place or a story already in the atlas."
            footer={
              <p className="text-[0.75rem] text-ink/45">
                You can also add to a collection from any destination or story page.
              </p>
            }
          >
            <div className="flex flex-col gap-8">
              <div>
                <label htmlFor="add-place" className="text-[0.8125rem] font-medium text-ink/70">
                  A place
                </label>
                <div className="mt-2 flex items-end gap-3">
                  <Select
                    id="add-place"
                    value={placeToAdd}
                    onChange={(event) => setPlaceToAdd(event.target.value)}
                  >
                    <option value="">Choose a destination</option>
                    {availableDestinations.map((destination) => (
                      <option key={destination.slug} value={destination.slug}>
                        {destination.name}, {destination.country}
                      </option>
                    ))}
                  </Select>
                  <button
                    type="button"
                    onClick={addPlace}
                    disabled={!placeToAdd}
                    className="h-10 shrink-0 rounded-full bg-ink px-5 text-[0.8125rem] text-ivory disabled:opacity-40"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="add-story" className="text-[0.8125rem] font-medium text-ink/70">
                  A story
                </label>
                <div className="mt-2 flex items-end gap-3">
                  <Select
                    id="add-story"
                    value={storyToAdd}
                    onChange={(event) => setStoryToAdd(event.target.value)}
                  >
                    <option value="">Choose a story</option>
                    {availableStories.map((story) => (
                      <option key={story.slug} value={story.slug}>
                        {story.title}
                      </option>
                    ))}
                  </Select>
                  <button
                    type="button"
                    onClick={addStory}
                    disabled={!storyToAdd}
                    className="h-10 shrink-0 rounded-full bg-ink px-5 text-[0.8125rem] text-ivory disabled:opacity-40"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </Modal>

          <Modal
            open={renameOpen}
            onOpenChange={setRenameOpen}
            title="Edit collection"
            footer={
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRenameOpen(false)}
                  className="h-11 px-4 text-[0.8125rem] text-ink/60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={rename}
                  className="h-11 rounded-full bg-ink px-6 text-[0.8125rem] font-medium text-ivory"
                >
                  Save changes
                </button>
              </div>
            }
          >
            <div className="flex flex-col gap-6">
              <Field id="edit-collection-title" label="Name" error={error}>
                <Input
                  id="edit-collection-title"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    setError('');
                  }}
                  maxLength={60}
                  aria-invalid={Boolean(error)}
                />
              </Field>
              <Field id="edit-collection-description" label="Description" optional>
                <Textarea
                  id="edit-collection-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  maxLength={180}
                />
              </Field>
            </div>
          </Modal>

          <Modal
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            title={`Delete “${mine.title}”?`}
            description="The collection will be removed. The places and stories themselves stay in the atlas."
            footer={
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteOpen(false)}
                  className="h-11 px-4 text-[0.8125rem] text-ink/60"
                >
                  Keep it
                </button>
                <button
                  type="button"
                  onClick={() => {
                    atlas.deleteCollection(mine.id);
                    push({ title: 'Collection deleted' });
                    navigate('/collections');
                  }}
                  className="h-11 rounded-full bg-[#8a3a2c] px-6 text-[0.8125rem] font-medium text-ivory"
                >
                  Delete collection
                </button>
              </div>
            }
          >
            <p className="text-[0.875rem] leading-relaxed text-ink/60">
              This cannot be undone. You can always build a new one.
            </p>
          </Modal>
        </>
      ) : null}
    </>
  );
};
