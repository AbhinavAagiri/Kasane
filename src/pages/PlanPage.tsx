import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useAtlas } from '@/store/AtlasProvider';
import { useToast } from '@/components/ui/Toast';
import { usePageMeta } from '@/hooks/usePageMeta';
import { planMeta } from '@/seo/routes';
import { Modal } from '@/components/ui/Modal';
import { Field, Input, Textarea } from '@/components/ui/field';
import { SmartImage } from '@/components/media/SmartImage';
import { destinationBySlug } from '@/data/destinations';
import { formatCurrency, formatDateRange, pluralize, tripCost } from '@/lib/format';

const today = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().slice(0, 10);
};

export const PlanPage = () => {
  const atlas = useAtlas();
  const navigate = useNavigate();
  const { push } = useToast();
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(() => params.get('new') === '1');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(today());
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 36);
    return date.toISOString().slice(0, 10);
  });
  const [error, setError] = useState('');

  usePageMeta(planMeta);

  useEffect(() => {
    if (params.get('new') !== '1') return;
    const next = new URLSearchParams(params);
    next.delete('new');
    setParams(next, { replace: true });
    navigate('/plan/new', { replace: true });
  }, [params, setParams, navigate]);

  const create = () => {
    if (!title.trim()) {
      setError('Give the trip a name.');
      return;
    }
    if (!startDate || !endDate) {
      setError('Choose a start and end date.');
      return;
    }
    if (endDate < startDate) {
      setError('The end date needs to come after the start.');
      return;
    }
    const id = atlas.createTrip({
      title: title.trim(),
      description: description.trim(),
      startDate,
      endDate,
    });
    push({ title: `Created ${title.trim()}`, description: 'Add places and start building the days.' });
    setOpen(false);
    navigate(`/plan/${id}`);
  };

  return (
    <>
      <section className="pb-10 pt-[calc(var(--nav-h)+3.5rem)] md:pt-[calc(var(--nav-h)+5rem)]">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="text-[0.75rem] uppercase tracking-[0.12em] text-ink/45">Plan</p>
              <h1 className="display-xl mt-3 max-w-[15ch]">Journeys, in progress.</h1>
            </div>
            <div className="max-w-[38ch] pb-2">
              <p className="text-[0.9375rem] leading-relaxed text-ink/60">
                Begin with the itinerary studio, or return to a journey you have already started.
                Every day is editable; nothing is booked.
              </p>
              <Link
                to="/plan/new"
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[0.8125rem] font-medium text-ivory transition-colors hover:bg-forest"
              >
                Compose a journey
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <Link
            to="/plan/new"
            className="group mt-10 grid overflow-hidden border border-ink/14 bg-cream md:grid-cols-12"
          >
            <div className="relative min-h-[220px] overflow-hidden bg-paper md:col-span-5">
              <SmartImage
                name="dest-paris"
                alt="Paris rooftops in the evening"
                sizes="(min-width: 768px) 40vw, 100vw"
                className="transition-transform duration-[900ms] group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(16,18,15,0.46))]" />
              <p className="absolute bottom-4 left-5 text-[0.625rem] uppercase tracking-[0.12em] text-ivory/60">
                The itinerary studio
              </p>
            </div>
            <div className="flex flex-col justify-center p-6 md:col-span-7 md:p-9">
              <p className="flex items-center gap-3 text-[0.625rem] uppercase tracking-[0.13em] text-ink/45">
                <span className="seal-dot" aria-hidden="true" />
                A few questions, then a draft
              </p>
              <h2 className="display-md mt-3 max-w-[18ch]">
                Build the shape before you book the rooms.
              </h2>
              <p className="mt-3 max-w-[52ch] text-[0.875rem] leading-relaxed text-ink/55">
                Choose up to three places, a pace and a base. The planner handles the scheduling
                locally, with room for the day to change.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-[0.8125rem] text-ink/70">
                Compose a journey
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      <section className="border-t border-ink/12 pb-[var(--spacing-section)] pt-10">
        <div className="shell">
          {atlas.trips.length ? (
            <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2">
              {atlas.trips.map((trip) => {
                const first = destinationBySlug[trip.destinationSlugs[0] ?? ''];
                const count = trip.destinationSlugs
                  .map((slug) => destinationBySlug[slug])
                  .filter(Boolean).length;
                return (
                  <li key={trip.id}>
                    <Link to={`/plan/${trip.id}`} className="group block">
                      <div className="relative aspect-[16/9] overflow-hidden bg-paper">
                        {first ? (
                          <div className="h-full w-full transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.02]">
                            <SmartImage
                              name={first.image.src}
                              alt={first.image.alt}
                              sizes="(min-width: 768px) 46vw, 100vw"
                            />
                          </div>
                        ) : (
                          <div className="flex h-full items-center justify-center text-[0.8125rem] text-ink/40">
                            A journey without a place yet
                          </div>
                        )}
                        {trip.sample ? (
                          <span className="absolute left-3 top-3 border border-ink/10 bg-cream/95 px-2.5 py-1 text-[0.625rem] text-ink/55">
                            Sample
                          </span>
                        ) : trip.planning?.generated ? (
                          <span className="absolute left-3 top-3 flex items-center gap-1.5 border border-ink/10 bg-cream/95 px-2.5 py-1 text-[0.625rem] text-ink/55">
                            <span className="seal-dot" aria-hidden="true" />
                            Composed
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-4 flex items-start justify-between gap-5">
                        <div>
                          <h2 className="display-sm">{trip.title}</h2>
                          <p className="mt-1.5 text-[0.8125rem] text-ink/55">
                            {formatDateRange(trip.startDate, trip.endDate)} ·{' '}
                            {pluralize(trip.days.length, 'day')}
                            {count ? ` · ${count} ${count === 1 ? 'place' : 'places'}` : ''}
                          </p>
                          {trip.description ? (
                            <p className="mt-2 max-w-[46ch] text-[0.875rem] leading-relaxed text-ink/60">
                              {trip.description}
                            </p>
                          ) : null}
                        </div>
                        <ArrowUpRight
                          className="mt-1 h-4 w-4 shrink-0 text-ink/35 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </div>
                      <p className="mt-3 text-[0.75rem] text-ink/40">
                        {tripCost(trip) > 0
                          ? `Estimated ${formatCurrency(tripCost(trip))}`
                          : trip.planning?.generated
                            ? 'Draft itinerary · edit anything'
                            : 'No costed activities yet'}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="border border-ink/12 bg-cream px-6 py-16 text-center">
              <p className="font-display text-[2rem]">No journeys yet.</p>
              <p className="mx-auto mt-3 max-w-[42ch] text-[0.9375rem] leading-relaxed text-ink/60">
                Start with a name and two dates. You can add places and activities whenever you
                like.
              </p>
              <Link
                to="/plan/new"
                className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-5 text-[0.8125rem] font-medium text-ivory"
              >
                Compose a journey
              </Link>
            </div>
          )}

          {atlas.trips.length ? (
            <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-ink/12 pt-6">
              <p className="max-w-[52ch] text-[0.8125rem] leading-relaxed text-ink/50">
                Sample journeys are ordinary trips: edit them, add to them or delete them. Nothing
                is booked, and no prices are live.
              </p>
              <Link to="/explore" className="link-quiet text-[0.875rem] text-ink">
                Find places to add
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="New trip"
        description="A working title is enough. Dates can change later."
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-11 px-4 text-[0.8125rem] text-ink/60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={create}
              className="h-11 rounded-full bg-ink px-6 text-[0.8125rem] font-medium text-ivory"
            >
              Create trip
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          <Field id="trip-title" label="Name" error={error}>
            <Input
              id="trip-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError('');
              }}
              placeholder="A week in Kyoto"
              maxLength={70}
              autoFocus
              aria-invalid={Boolean(error)}
            />
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="trip-start" label="Start date">
              <Input
                id="trip-start"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </Field>
            <Field id="trip-end" label="End date">
              <Input
                id="trip-end"
                type="date"
                value={endDate}
                min={startDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </Field>
          </div>
          <Field id="trip-description" label="Description" optional>
            <Textarea
              id="trip-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What kind of journey is this?"
              rows={3}
              maxLength={180}
            />
          </Field>
        </div>
      </Modal>
    </>
  );
};
