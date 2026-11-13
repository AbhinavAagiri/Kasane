import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Printer,
  Trash2,
  X,
} from 'lucide-react';
import { useAtlas } from '@/store/AtlasProvider';
import { useToast } from '@/components/ui/Toast';
import { usePageMeta } from '@/hooks/usePageMeta';
import { tripRouteMeta } from '@/seo/routes';
import { destinations, destinationBySlug } from '@/data/destinations';
import { formatCurrency, formatDateRange, formatDayDate, pluralize, tripCost } from '@/lib/format';
import { AtlasMapLazy } from '@/components/map/AtlasMapLazy';
import type { MapPoint } from '@/components/map/AtlasMap';
import { ActivityDialog, type ActivityDraft } from '@/components/trip/ActivityDialog';
import { Modal } from '@/components/ui/Modal';
import { Field, Input, Select, Textarea } from '@/components/ui/field';

export const TripPage = () => {
  const { tripId } = useParams();
  const atlas = useAtlas();
  const { push } = useToast();
  const navigate = useNavigate();
  const trip = atlas.trips.find((entry) => entry.id === tripId);

  const [activeDestination, setActiveDestination] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [addPlaceOpen, setAddPlaceOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [dayDialog, setDayDialog] = useState<{ dayId: string; title: string } | null>(null);
  const [dayToDelete, setDayToDelete] = useState<{ dayId: string; title: string } | null>(null);
  const [activityDialog, setActivityDialog] = useState<{ dayId: string; activityId?: string } | null>(
    null,
  );
  const [placeToAdd, setPlaceToAdd] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  usePageMeta(tripRouteMeta(trip?.title, trip?.description, tripId));

  const points = useMemo<MapPoint[]>(
    () =>
      (trip?.destinationSlugs ?? [])
        .map((slug) => destinationBySlug[slug])
        .filter(Boolean)
        .map((destination) => ({
          id: destination!.slug,
          name: destination!.name,
          subtitle: destination!.country,
          coordinates: destination!.coordinates,
          href: `/destinations/${destination!.slug}`,
          kind: 'destination' as const,
        })),
    [trip],
  );

  if (!trip) {
    return (
      <section className="shell flex min-h-[70svh] flex-col justify-center py-32">
        <p className="text-[0.75rem] text-ink/45">Plan</p>
        <h1 className="display-lg mt-4">This trip is not here.</h1>
        <p className="mt-5 max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink/65">
          It may have been deleted. Your other journeys are still waiting.
        </p>
        <Link
          to="/plan"
          className="mt-8 inline-flex h-11 w-fit items-center rounded-full bg-ink px-5 text-[0.8125rem] font-medium text-ivory"
        >
          All trips
        </Link>
      </section>
    );
  }

  const tripDestinations = trip.destinationSlugs
    .map((slug) => destinationBySlug[slug])
    .filter(Boolean);
  const available = destinations.filter(
    (destination) => !trip.destinationSlugs.includes(destination.slug),
  );
  const activityCount = trip.days.reduce((total, day) => total + day.activities.length, 0);
  const total = tripCost(trip);

  const openEdit = () => {
    setTitle(trip.title);
    setDescription(trip.description);
    setStartDate(trip.startDate);
    setEndDate(trip.endDate);
    setError('');
    setEditOpen(true);
  };

  const saveTrip = () => {
    if (!title.trim()) {
      setError('Give the trip a name.');
      return;
    }
    if (!startDate || !endDate || endDate < startDate) {
      setError('Choose an end date after the start.');
      return;
    }
    atlas.updateTrip(trip.id, {
      title: title.trim(),
      description: description.trim(),
      startDate,
      endDate,
    });
    push({ title: 'Trip updated' });
    setEditOpen(false);
  };

  const editingActivity = activityDialog?.activityId
    ? trip.days
        .find((day) => day.id === activityDialog.dayId)
        ?.activities.find((activity) => activity.id === activityDialog.activityId) ?? null
    : null;
  const dialogDay = activityDialog
    ? trip.days.find((day) => day.id === activityDialog.dayId)
    : null;
  const dialogDayIndex = dialogDay ? trip.days.indexOf(dialogDay) : 0;

  const saveActivity = (draft: ActivityDraft) => {
    if (!activityDialog) return;
    if (editingActivity) {
      atlas.updateActivity(trip.id, activityDialog.dayId, { ...draft, id: editingActivity.id });
      push({ title: 'Activity updated' });
    } else {
      atlas.addActivity(trip.id, activityDialog.dayId, draft);
      push({ title: 'Activity added' });
    }
    setActivityDialog(null);
  };

  return (
    <>
      <header className="border-b border-ink/10 bg-paper pb-9 pt-[calc(var(--nav-h)+2rem)] print:pb-6 print:pt-6">
        <div className="shell">
          <Link
            to="/plan"
            className="inline-flex items-center gap-2 text-[0.8125rem] text-ink/50 transition-colors hover:text-ink print-hide"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            All trips
          </Link>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-8">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                {trip.sample ? (
                  <span className="border border-ink/15 px-2.5 py-1 text-[0.625rem] text-ink/50">
                    Sample journey
                  </span>
                ) : trip.planning?.generated ? (
                  <span className="flex items-center gap-1.5 border border-seal/25 px-2.5 py-1 text-[0.625rem] text-seal">
                    <span className="seal-dot" aria-hidden="true" />
                    Composed locally
                  </span>
                ) : null}
                <p className="text-[0.75rem] text-ink/45">
                  {formatDateRange(trip.startDate, trip.endDate)} ·{' '}
                  {pluralize(trip.days.length, 'day')} ·{' '}
                  {tripDestinations.length} {tripDestinations.length === 1 ? 'place' : 'places'}
                </p>
              </div>
              <h1 className="display-lg mt-3 max-w-[20ch]">{trip.title}</h1>
              {trip.description ? (
                <p className="mt-4 max-w-[54ch] text-[0.9375rem] leading-relaxed text-ink/60">
                  {trip.description}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2 print-hide">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[0.8125rem] font-medium text-ivory transition-colors hover:bg-forest"
              >
                <Printer className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                Print / save PDF
              </button>
              <button
                type="button"
                onClick={openEdit}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-ink/20 px-5 text-[0.8125rem] transition-colors hover:border-ink/40"
              >
                Edit trip
              </button>
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                aria-label="Delete trip"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink/50 transition-colors hover:border-[#8a3a2c]/40 hover:text-[#8a3a2c]"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {trip.planning ? (
        <section className="border-b border-ink/10 bg-cream print-break">
          <div className="shell grid gap-8 py-8 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="flex items-center gap-3 text-[0.625rem] uppercase tracking-[0.12em] text-ink/40">
                <span className="seal-dot" aria-hidden="true" />
                The shape of the trip
              </p>
              <p className="mt-2 font-display text-[1.85rem] leading-[1.05]">
                {trip.planning.pace} days, composed around a base.
              </p>
            </div>
            <div className="md:col-span-5">
              <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">A good base</dt>
                  <dd className="mt-1 text-[0.8125rem] leading-relaxed text-ink/65">
                    {trip.planning.accommodationArea}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">Room style</dt>
                  <dd className="mt-1 text-[0.8125rem] leading-relaxed text-ink/65">
                    {trip.planning.accommodation}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">Arriving</dt>
                  <dd className="mt-1 text-[0.8125rem] leading-relaxed text-ink/65">
                    {trip.planning.arrival}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">Moving</dt>
                  <dd className="mt-1 text-[0.8125rem] leading-relaxed text-ink/65">
                    {trip.planning.transport}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="md:col-span-4">
              <p className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">Planning notes</p>
              <ul className="mt-2 space-y-2">
                {trip.planning.practical?.map((note) => (
                  <li key={note} className="text-[0.75rem] leading-relaxed text-ink/55">
                    {note}
                  </li>
                ))}
              </ul>
              {trip.planning.notes ? (
                <p className="mt-3 border-l border-seal/30 pl-3 text-[0.75rem] italic leading-relaxed text-ink/50">
                  “{trip.planning.notes}”
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <div className="shell grid gap-12 py-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-8">
          <div className="flex items-end justify-between border-b border-ink/12 pb-4">
            <h2 className="display-md">Day by day</h2>
            <button
              type="button"
              onClick={() => {
                atlas.addDay(trip.id);
                push({ title: 'Day added' });
              }}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-ink/20 px-4 text-[0.75rem] transition-colors hover:border-ink/40 print-hide"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              Add day
            </button>
          </div>

          <div className="mt-2">
            {trip.days.map((day, dayIndex) => (
              <section key={day.id} className="border-b border-ink/12 py-7 print-break">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-[0.6875rem] font-medium tabular-nums text-ink/40">
                      Day {String(dayIndex + 1).padStart(2, '0')}
                      <span className="mx-2 inline-block h-px w-3 translate-y-[-3px] bg-ink/20" aria-hidden="true" />
                      {formatDayDate(trip.startDate, dayIndex)}
                    </p>
                    <h3 className="display-sm mt-2">{day.title}</h3>
                  </div>
                  <div className="flex gap-1 print-hide">
                    <button
                      type="button"
                      onClick={() => setDayDialog({ dayId: day.id, title: day.title })}
                      aria-label={`Rename ${day.title}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink sm:h-8 sm:w-8"
                    >
                      <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDayToDelete({ dayId: day.id, title: day.title })}
                      aria-label={`Delete ${day.title}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-ink/5 hover:text-[#8a3a2c] sm:h-8 sm:w-8"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                {day.activities.length ? (
                  <ul className="mt-5">
                    {day.activities.map((activity, activityIndex) => (
                      <li
                        key={activity.id}
                        className="grid grid-cols-[3rem_1fr] items-start gap-x-3 gap-y-2 border-t border-ink/8 py-3.5 sm:grid-cols-[3.5rem_1fr_auto]"
                      >
                        <span className="text-[0.75rem] tabular-nums text-ink/40">
                          {activity.time || '—'}
                        </span>
                        <div>
                          <p className="text-[0.9375rem] leading-snug">{activity.title}</p>
                          {activity.note ? (
                            <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink/55">
                              {activity.note}
                            </p>
                          ) : null}
                          {activity.link ? (
                            activity.link.startsWith('/') ? (
                              <Link
                                to={activity.link}
                                className="mt-1 inline-block text-[0.75rem] underline decoration-ink/25 underline-offset-4 text-ink/55 hover:text-ink"
                              >
                                Open reference
                              </Link>
                            ) : (
                              <a
                                href={activity.link}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="mt-1 inline-block text-[0.75rem] underline decoration-ink/25 underline-offset-4 text-ink/55 hover:text-ink"
                              >
                                Reference
                              </a>
                            )
                          ) : null}
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-3 sm:col-span-1 sm:items-start">
                          {typeof activity.cost === 'number' ? (
                            <span className="pt-0.5 text-[0.75rem] tabular-nums text-ink/50">
                              {formatCurrency(activity.cost)}
                            </span>
                          ) : null}
                          <div className="flex gap-0.5 print-hide">
                            <button
                              type="button"
                              onClick={() =>
                                atlas.moveActivity(trip.id, day.id, activity.id, -1)
                              }
                              disabled={activityIndex === 0}
                              aria-label={`Move ${activity.title} earlier`}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-ink/35 hover:bg-ink/5 hover:text-ink disabled:opacity-25 sm:h-7 sm:w-7"
                            >
                              <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                atlas.moveActivity(trip.id, day.id, activity.id, 1)
                              }
                              disabled={activityIndex === day.activities.length - 1}
                              aria-label={`Move ${activity.title} later`}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-ink/35 hover:bg-ink/5 hover:text-ink disabled:opacity-25 sm:h-7 sm:w-7"
                            >
                              <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setActivityDialog({ dayId: day.id, activityId: activity.id })
                              }
                              aria-label={`Edit ${activity.title}`}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-ink/35 hover:bg-ink/5 hover:text-ink sm:h-7 sm:w-7"
                            >
                              <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                atlas.removeActivity(trip.id, day.id, activity.id);
                                push({ title: 'Activity removed' });
                              }}
                              aria-label={`Remove ${activity.title}`}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-ink/35 hover:bg-ink/5 hover:text-[#8a3a2c] sm:h-7 sm:w-7"
                            >
                              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 border-t border-dashed border-ink/15 py-5 text-[0.875rem] text-ink/45">
                    Nothing planned yet. The day is yours.
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setActivityDialog({ dayId: day.id })}
                  className="mt-3 inline-flex h-9 items-center gap-2 rounded-full border border-ink/15 px-4 text-[0.75rem] text-ink/65 transition-colors hover:border-ink/35 hover:text-ink print-hide"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  Add activity
                </button>
              </section>
            ))}
          </div>
        </div>

        <aside className="md:col-span-4">
          <div className="sticky top-[calc(var(--nav-h)+1.5rem)] flex flex-col gap-5">
            <div className="border border-ink/12 bg-cream">
              <AtlasMapLazy
                points={points}
                activeId={activeDestination}
                onActiveChange={setActiveDestination}
                follow
                className="h-56 print-hide"
                label={`Map of ${trip.title}`}
              />
              <div className="p-5">
                <p className="text-[0.75rem] font-medium text-ink/45">Places on this trip</p>
                {tripDestinations.length ? (
                  <ul className="mt-3">
                    {tripDestinations.map((destination) =>
                      destination ? (
                        <li
                          key={destination.slug}
                          className="flex items-center justify-between gap-3 border-b border-ink/8 py-2 last:border-b-0"
                        >
                          <Link
                            to={`/destinations/${destination.slug}`}
                            onMouseEnter={() => setActiveDestination(destination.slug)}
                            className="font-display text-[1.2rem] leading-tight hover:opacity-70"
                          >
                            {destination.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              atlas.removeDestinationFromTrip(trip.id, destination.slug);
                              if (activeDestination === destination.slug)
                                setActiveDestination(null);
                              push({ title: `${destination.name} removed from trip` });
                            }}
                            aria-label={`Remove ${destination.name} from trip`}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-ink/35 transition-colors hover:bg-ink/5 hover:text-ink print-hide"
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                        </li>
                      ) : null,
                    )}
                  </ul>
                ) : (
                  <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink/50">
                    No places yet. Add one to pin the trip on the map.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setAddPlaceOpen(true)}
                  className="mt-4 inline-flex h-9 items-center gap-2 rounded-full border border-ink/15 px-4 text-[0.75rem] transition-colors hover:border-ink/35 print-hide"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  Add a place
                </button>
              </div>
            </div>

            <div className="border border-ink/12 p-5">
              <p className="text-[0.75rem] font-medium text-ink/45">The trip at a glance</p>
              <dl className="mt-3 space-y-2 text-[0.8125rem]">
                <div className="flex justify-between border-b border-ink/8 pb-2">
                  <dt className="text-ink/55">Days</dt>
                  <dd className="tabular-nums">{trip.days.length}</dd>
                </div>
                <div className="flex justify-between border-b border-ink/8 pb-2">
                  <dt className="text-ink/55">Activities</dt>
                  <dd className="tabular-nums">{activityCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/55">Estimated cost</dt>
                  <dd className="tabular-nums">{formatCurrency(total)}</dd>
                </div>
              </dl>
              <p className="mt-4 text-[0.6875rem] leading-relaxed text-ink/40">
                Costs are your own estimates. Nothing on this page is a booking.
              </p>
              <button
                type="button"
                onClick={() => window.print()}
                className="mt-4 inline-flex h-9 items-center gap-2 text-[0.75rem] underline decoration-ink/25 underline-offset-4 print-hide"
              >
                <Printer className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                Print this itinerary
              </button>
            </div>
          </div>
        </aside>
      </div>

      <Modal
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit trip"
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="h-11 px-4 text-[0.8125rem] text-ink/60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveTrip}
              className="h-11 rounded-full bg-ink px-6 text-[0.8125rem] font-medium text-ivory"
            >
              Save changes
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          <Field id="edit-trip-title" label="Name" error={error}>
            <Input
              id="edit-trip-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError('');
              }}
              maxLength={70}
              aria-invalid={Boolean(error)}
            />
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="edit-trip-start" label="Start date">
              <Input
                id="edit-trip-start"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </Field>
            <Field id="edit-trip-end" label="End date">
              <Input
                id="edit-trip-end"
                type="date"
                value={endDate}
                min={startDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </Field>
          </div>
          <Field id="edit-trip-description" label="Description" optional>
            <Textarea
              id="edit-trip-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              maxLength={180}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={addPlaceOpen}
        onOpenChange={setAddPlaceOpen}
        title="Add a place"
        description="Places pin the trip on the map. Activities are added separately."
        footer={
          <div className="flex justify-between gap-4 text-[0.75rem] text-ink/45">
            <Link to="/explore" className="underline decoration-ink/20 underline-offset-4 hover:text-ink">
              Find a place in the atlas
            </Link>
            <span>{available.length} available</span>
          </div>
        }
      >
        <div className="flex items-end gap-3">
          <Select
            aria-label="Place to add"
            value={placeToAdd}
            onChange={(event) => setPlaceToAdd(event.target.value)}
          >
            <option value="">Choose a destination</option>
            {available.map((destination) => (
              <option key={destination.slug} value={destination.slug}>
                {destination.name}, {destination.country}
              </option>
            ))}
          </Select>
          <button
            type="button"
            disabled={!placeToAdd}
            onClick={() => {
              const destination = destinationBySlug[placeToAdd];
              if (!destination) return;
              atlas.addDestinationToTrip(trip.id, placeToAdd);
              setActiveDestination(placeToAdd);
              setPlaceToAdd('');
              push({ title: `${destination.name} added to ${trip.title}` });
              setAddPlaceOpen(false);
            }}
            className="h-10 shrink-0 rounded-full bg-ink px-5 text-[0.8125rem] text-ivory disabled:opacity-40"
          >
            Add place
          </button>
        </div>
      </Modal>

      <Modal
        open={Boolean(dayDialog)}
        onOpenChange={(open) => !open && setDayDialog(null)}
        title="Rename this day"
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDayDialog(null)}
              className="h-11 px-4 text-[0.8125rem] text-ink/60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (!dayDialog) return;
                atlas.updateDayTitle(trip.id, dayDialog.dayId, dayDialog.title.trim() || 'A free day');
                setDayDialog(null);
              }}
              className="h-11 rounded-full bg-ink px-6 text-[0.8125rem] font-medium text-ivory"
            >
              Save
            </button>
          </div>
        }
      >
        <Field id="day-title" label="Day title">
          <Input
            id="day-title"
            value={dayDialog?.title ?? ''}
            onChange={(event) =>
              setDayDialog((current) => (current ? { ...current, title: event.target.value } : current))
            }
            maxLength={70}
            autoFocus
          />
        </Field>
      </Modal>

      <Modal
        open={Boolean(dayToDelete)}
        onOpenChange={(open) => !open && setDayToDelete(null)}
        title={`Delete “${dayToDelete?.title ?? ''}”?`}
        description="Activities on this day will be removed with it."
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDayToDelete(null)}
              className="h-11 px-4 text-[0.8125rem] text-ink/60"
            >
              Keep it
            </button>
            <button
              type="button"
              onClick={() => {
                if (!dayToDelete) return;
                atlas.removeDay(trip.id, dayToDelete.dayId);
                setDayToDelete(null);
                push({ title: 'Day removed' });
              }}
              className="h-11 rounded-full bg-[#8a3a2c] px-6 text-[0.8125rem] font-medium text-ivory"
            >
              Delete day
            </button>
          </div>
        }
      >
        <p className="text-[0.875rem] text-ink/60">This cannot be undone.</p>
      </Modal>

      <Modal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete “${trip.title}”?`}
        description="The itinerary and its activities will be removed. The places themselves stay in the atlas."
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
                atlas.deleteTrip(trip.id);
                push({ title: 'Trip deleted' });
                navigate('/plan');
              }}
              className="h-11 rounded-full bg-[#8a3a2c] px-6 text-[0.8125rem] font-medium text-ivory"
            >
              Delete trip
            </button>
          </div>
        }
      >
        <p className="text-[0.875rem] text-ink/60">This cannot be undone.</p>
      </Modal>

      {activityDialog ? (
        <ActivityDialog
          key={`${activityDialog.dayId}-${activityDialog.activityId ?? 'new'}`}
          open
          onOpenChange={(open) => !open && setActivityDialog(null)}
          initial={editingActivity}
          dayLabel={
            dialogDay
              ? `Day ${dialogDayIndex + 1} · ${dialogDay.title}`
              : 'Add something to the day'
          }
          onSave={saveActivity}
        />
      ) : null}
    </>
  );
};
