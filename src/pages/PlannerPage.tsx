import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  Circle,
  MapPin,
  Minus,
  Plus,
} from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { plannerMeta } from '@/seo/routes';
import { useAtlas } from '@/store/AtlasProvider';
import { useToast } from '@/components/ui/Toast';
import { destinations, destinationBySlug } from '@/data/destinations';
import { interests } from '@/data/interests';
import type { InterestId, TripPlanning } from '@/data/types';
import { accommodationOptions, buildItinerary } from '@/lib/itinerary';
import { SmartImage } from '@/components/media/SmartImage';
import { cn } from '@/lib/utils';

const steps = [
  { label: 'Place & dates', note: 'Where and for how long' },
  { label: 'Temper & pace', note: 'What you want from the days' },
  { label: 'Base & budget', note: 'How you like to travel' },
  { label: 'Compose', note: 'Review and make it yours' },
];

const paceOptions: {
  value: TripPlanning['pace'];
  label: string;
  note: string;
}[] = [
  {
    value: 'slow',
    label: 'Slow',
    note: 'Two anchors a day, long lunches, room to change your mind.',
  },
  {
    value: 'balanced',
    label: 'Balanced',
    note: 'Three anchors, a proper pause, an evening left open.',
  },
  {
    value: 'full',
    label: 'Full',
    note: 'Four anchors. More ground covered, more decisions on the day.',
  },
];

const partyOptions: { value: TripPlanning['party']; label: string }[] = [
  { value: 'solo', label: 'Solo' },
  { value: 'couple', label: 'Two' },
  { value: 'friends', label: 'Friends' },
  { value: 'family', label: 'Family' },
];

const budgetOptions: { value: TripPlanning['budget']; label: string; note: string }[] = [
  { value: 'modest', label: 'Modest', note: 'Simple rooms, markets, public transport' },
  { value: 'considered', label: 'Considered', note: 'Comfortable, one good meal a day' },
  { value: 'open', label: 'Open', note: 'Flexibility and a little spontaneity' },
];

const dateLabel = (iso: string) => {
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const addDays = (start: string, days: number) => {
  const date = new Date(`${start}T12:00:00`);
  if (Number.isNaN(date.getTime())) return start;
  date.setDate(date.getDate() + Math.max(0, days - 1));
  return date.toISOString().slice(0, 10);
};

const todayPlus = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

export const PlannerPage = () => {
  const atlas = useAtlas();
  const navigate = useNavigate();
  const { push } = useToast();
  const [params] = useSearchParams();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>(() => {
    const place = params.get('place');
    return place && destinationBySlug[place] ? [place] : [];
  });
  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState(() => todayPlus(35));
  const [days, setDays] = useState(7);
  const [pace, setPace] = useState<TripPlanning['pace']>('balanced');
  const [selectedInterests, setSelectedInterests] = useState<InterestId[]>([]);
  const [budget, setBudget] = useState<TripPlanning['budget']>('considered');
  const [party, setParty] = useState<TripPlanning['party']>('couple');
  const [accommodation, setAccommodation] = useState(accommodationOptions[0]?.value ?? '');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  usePageMeta(plannerMeta);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return destinations;
    return destinations.filter((destination) =>
      [destination.name, destination.country, destination.region, ...destination.interests]
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }, [query]);

  const selectedDestinations = selected
    .map((slug) => destinationBySlug[slug])
    .filter((destination): destination is NonNullable<typeof destination> => Boolean(destination));

  const availableInterests = useMemo(() => {
    const set = new Set(selectedDestinations.flatMap((destination) => destination.interests));
    return interests.filter((interest) => set.has(interest.id));
  }, [selectedDestinations]);

  const toggleDestination = (slug: string) => {
    setError('');
    setSelected((current) => {
      if (current.includes(slug)) return current.filter((entry) => entry !== slug);
      if (current.length >= 3) return current;
      return [...current, slug];
    });
  };

  const validateStep = () => {
    if (step === 0) {
      if (!selected.length) return 'Choose at least one place.';
      if (!startDate) return 'Choose a start date.';
      if (days < 2) return 'Give the journey at least two days.';
      if (days > 21) return 'Keep it to 21 days for now.';
    }
    return '';
  };

  const next = () => {
    const message = validateStep();
    if (message) {
      setError(message);
      return;
    }
    setError('');
    setStep((current) => Math.min(3, current + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    setError('');
    setStep((current) => Math.max(0, current - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generate = () => {
    if (!selectedDestinations.length) {
      setStep(0);
      setError('Choose at least one place.');
      return;
    }
    const itinerary = buildItinerary(
      {
        destinationSlugs: selectedDestinations.map((destination) => destination.slug),
        startDate,
        days,
        pace,
        interests: selectedInterests,
        budget,
        party,
        accommodation,
        notes: notes.trim() || undefined,
      },
      selectedDestinations,
    );
    const tripId = atlas.createGeneratedTrip(itinerary);
    push({
      title: 'Your journey is composed',
      description: 'Everything is editable. Move days, add a table, or print it.',
    });
    navigate(`/plan/${tripId}`);
  };

  return (
    <>
      <section className="border-b border-ink/10 bg-paper pb-10 pt-[calc(var(--nav-h)+2.6rem)] md:pb-12 md:pt-[calc(var(--nav-h)+4rem)]">
        <div className="shell">
          <Link
            to="/plan"
            className="inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.12em] text-ink/45 transition-colors hover:text-ink"
          >
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            All journeys
          </Link>
          <div className="mt-6 grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45">
                The itinerary studio
              </p>
              <h1 className="display-lg mt-2">Compose a journey.</h1>
            </div>
            <p className="max-w-[38ch] text-[0.875rem] leading-relaxed text-ink/55 md:col-span-4 md:col-start-9">
              A few deliberate questions, then a day-by-day draft. No account, no black box, no
              “personalised recommendations” you cannot inspect.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-[var(--spacing-section)] pt-10">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:items-start">
          <aside className="lg:col-span-3">
            <div className="sticky top-[calc(var(--nav-h)+1.5rem)]">
              <ol className="border-t border-ink/14">
                {steps.map((entry, index) => (
                  <li key={entry.label}>
                    <button
                      type="button"
                      onClick={() => {
                        if (index <= step) setStep(index);
                      }}
                      disabled={index > step}
                      aria-current={index === step ? 'step' : undefined}
                      className={cn(
                        'flex w-full items-baseline gap-3 border-b border-ink/10 py-3.5 text-left transition-colors',
                        index === step ? 'text-ink' : index < step ? 'text-ink/55' : 'text-ink/28',
                      )}
                    >
                      <span
                        className={cn(
                          'index-number w-5 shrink-0',
                          index === step ? 'text-seal' : 'text-ink/25',
                        )}
                      >
                        {index < step ? '✓' : String(index + 1).padStart(2, '0')}
                      </span>
                      <span>
                        <span className="block text-[0.8125rem]">{entry.label}</span>
                        <span className="mt-0.5 block text-[0.6875rem] text-ink/35">
                          {entry.note}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
              <p className="mt-5 max-w-[28ch] text-[0.6875rem] leading-relaxed text-ink/40">
                The schedule is built locally from KASANE’s editorial data. Nothing is sent to a
                booking platform; your answers stay in this browser.
              </p>
            </div>
          </aside>

          <div className="lg:col-span-8 lg:col-start-5">
            <div className="border border-ink/14 bg-cream">
              {step === 0 ? (
                <div className="p-6 md:p-9">
                  <p className="text-[0.625rem] uppercase tracking-[0.13em] text-seal">
                    Step one
                  </p>
                  <h2 className="display-md mt-2">Where does this begin?</h2>
                  <p className="mt-3 max-w-[52ch] text-[0.875rem] leading-relaxed text-ink/55">
                    Choose up to three places. The planner allocates days by editorial weight and
                    the interests you pick next — it will not cram in more than the days allow.
                  </p>

                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-[0.6875rem] uppercase tracking-[0.1em] text-ink/45">
                        Start date
                      </span>
                      <input
                        type="date"
                        value={startDate}
                        min={todayPlus(1)}
                        onChange={(event) => setStartDate(event.target.value)}
                        className="mt-2 h-11 w-full border border-ink/18 bg-transparent px-3 text-[0.875rem] focus:border-ink focus:outline-none"
                      />
                    </label>
                    <div>
                      <span className="text-[0.6875rem] uppercase tracking-[0.1em] text-ink/45">
                        Days
                      </span>
                      <div className="mt-2 flex h-11 items-center justify-between border border-ink/18 px-2">
                        <button
                          type="button"
                          onClick={() => setDays((value) => Math.max(2, value - 1))}
                          aria-label="One fewer day"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-ink/50 hover:bg-ink/5 hover:text-ink"
                        >
                          <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                        <span className="text-[0.875rem] tabular-nums">
                          {days} days · ends {dateLabel(addDays(startDate, days))}
                        </span>
                        <button
                          type="button"
                          onClick={() => setDays((value) => Math.min(21, value + 1))}
                          aria-label="One more day"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-ink/50 hover:bg-ink/5 hover:text-ink"
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-9 flex items-center justify-between gap-4 border-t border-ink/12 pt-5">
                    <p className="text-[0.6875rem] uppercase tracking-[0.1em] text-ink/40">
                      {selected.length} of 3 selected
                    </p>
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Find a place"
                      aria-label="Find a place"
                      className="h-9 w-40 border-b border-ink/18 bg-transparent text-[0.8125rem] placeholder:text-ink/30 focus:border-ink focus:outline-none sm:w-52"
                    />
                  </div>

                  <div className="mt-4 grid max-h-[540px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                    {filtered.map((destination) => {
                      const active = selected.includes(destination.slug);
                      const disabled = !active && selected.length >= 3;
                      return (
                        <button
                          key={destination.slug}
                          type="button"
                          onClick={() => toggleDestination(destination.slug)}
                          disabled={disabled}
                          aria-pressed={active}
                          className={cn(
                            'group flex items-center gap-3 border p-2.5 text-left transition-colors',
                            active
                              ? 'border-ink bg-ink text-ivory'
                              : 'border-ink/12 hover:border-ink/35',
                            disabled && 'cursor-not-allowed opacity-35',
                          )}
                        >
                          <span className="relative h-12 w-14 shrink-0 overflow-hidden bg-paper">
                            <SmartImage
                              name={destination.image.src}
                              alt=""
                              sizes="56px"
                              widths={[640]}
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-display text-[1.1rem] leading-tight">
                              {destination.name}
                            </span>
                            <span className="mt-0.5 block text-[0.6875rem] text-current opacity-50">
                              {destination.country}
                            </span>
                          </span>
                          {active ? (
                            <Check className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 opacity-25" strokeWidth={1.2} aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {step === 1 ? (
                <div className="p-6 md:p-9">
                  <p className="text-[0.625rem] uppercase tracking-[0.13em] text-seal">
                    Step two
                  </p>
                  <h2 className="display-md mt-2">What kind of days?</h2>
                  <p className="mt-3 max-w-[52ch] text-[0.875rem] leading-relaxed text-ink/55">
                    Pace is a promise about how much will fit. Interests tilt the choice of places
                    and the shape of each day.
                  </p>

                  <div className="mt-8 border-t border-ink/14">
                    {paceOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPace(option.value)}
                        aria-pressed={pace === option.value}
                        className={cn(
                          'flex w-full items-baseline gap-4 border-b border-ink/10 py-4 text-left transition-colors',
                          pace === option.value ? 'text-ink' : 'text-ink/55 hover:text-ink',
                        )}
                      >
                        <span
                          className={cn(
                            'mt-1 h-2 w-2 shrink-0 rounded-full border',
                            pace === option.value
                              ? 'border-seal bg-seal'
                              : 'border-ink/30 bg-transparent',
                          )}
                          aria-hidden="true"
                        />
                        <span className="w-24 shrink-0 font-display text-[1.6rem] leading-none">
                          {option.label}
                        </span>
                        <span className="text-[0.8125rem] leading-relaxed text-ink/55">
                          {option.note}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-8">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="text-[0.6875rem] uppercase tracking-[0.1em] text-ink/45">
                        Interests
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedInterests([])}
                        className="text-[0.6875rem] text-ink/40 underline decoration-ink/20 underline-offset-4 hover:text-ink"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {availableInterests.map((interest) => {
                        const active = selectedInterests.includes(interest.id);
                        return (
                          <button
                            key={interest.id}
                            type="button"
                            onClick={() =>
                              setSelectedInterests((current) =>
                                active
                                  ? current.filter((entry) => entry !== interest.id)
                                  : [...current, interest.id],
                              )
                            }
                            aria-pressed={active}
                            className={cn(
                              'h-9 rounded-full border px-4 text-[0.75rem] transition-colors',
                              active
                                ? 'border-ink bg-ink text-ivory'
                                : 'border-ink/18 text-ink/60 hover:border-ink/40',
                            )}
                          >
                            {interest.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-3 text-[0.6875rem] leading-relaxed text-ink/40">
                      Leave empty to follow the editorial order of each place.
                    </p>
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="p-6 md:p-9">
                  <p className="text-[0.625rem] uppercase tracking-[0.13em] text-seal">
                    Step three
                  </p>
                  <h2 className="display-md mt-2">How do you like to land?</h2>
                  <p className="mt-3 max-w-[52ch] text-[0.875rem] leading-relaxed text-ink/55">
                    This shapes the base, the budget guidance and the rhythm of the days. It does
                    not book anything.
                  </p>

                  <div className="mt-8">
                    <p className="text-[0.6875rem] uppercase tracking-[0.1em] text-ink/45">
                      Travelling as
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {partyOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setParty(option.value)}
                          aria-pressed={party === option.value}
                          className={cn(
                            'h-9 rounded-full border px-4 text-[0.75rem] transition-colors',
                            party === option.value
                              ? 'border-ink bg-ink text-ivory'
                              : 'border-ink/18 text-ink/60 hover:border-ink/40',
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className="text-[0.6875rem] uppercase tracking-[0.1em] text-ink/45">
                      Daily budget
                    </p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      {budgetOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setBudget(option.value)}
                          aria-pressed={budget === option.value}
                          className={cn(
                            'border p-3 text-left transition-colors',
                            budget === option.value
                              ? 'border-ink bg-ink text-ivory'
                              : 'border-ink/14 hover:border-ink/35',
                          )}
                        >
                          <span className="block font-display text-[1.25rem] leading-none">
                            {option.label}
                          </span>
                          <span className="mt-1.5 block text-[0.6875rem] leading-relaxed opacity-55">
                            {option.note}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <label className="block">
                      <span className="text-[0.6875rem] uppercase tracking-[0.1em] text-ink/45">
                        A base you like
                      </span>
                      <select
                        value={accommodation}
                        onChange={(event) => setAccommodation(event.target.value)}
                        className="mt-2 h-11 w-full border border-ink/18 bg-transparent px-3 text-[0.875rem] focus:border-ink focus:outline-none"
                      >
                        {accommodationOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="mt-7 block">
                    <span className="text-[0.6875rem] uppercase tracking-[0.1em] text-ink/45">
                      Anything the plan should know?
                    </span>
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      rows={3}
                      placeholder="A slower first day, no early starts, one long train ride…"
                      className="mt-2 w-full resize-none border border-ink/18 bg-transparent p-3 text-[0.875rem] leading-relaxed placeholder:text-ink/30 focus:border-ink focus:outline-none"
                    />
                  </label>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="p-6 md:p-9">
                  <p className="text-[0.625rem] uppercase tracking-[0.13em] text-seal">
                    Step four
                  </p>
                  <h2 className="display-md mt-2">A journey, ready to edit.</h2>
                  <p className="mt-3 max-w-[52ch] text-[0.875rem] leading-relaxed text-ink/55">
                    The plan will be saved in this browser. Nothing is booked, and every day can be
                    moved or removed afterwards.
                  </p>

                  <dl className="mt-8 grid gap-x-8 gap-y-5 border-y border-ink/14 py-5 sm:grid-cols-2">
                    <div>
                      <dt className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">Places</dt>
                      <dd className="mt-1 text-[0.9375rem]">
                        {selectedDestinations.map((destination) => destination.name).join(' · ')}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">Dates</dt>
                      <dd className="mt-1 text-[0.9375rem]">
                        {dateLabel(startDate)} — {dateLabel(addDays(startDate, days))}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">Pace</dt>
                      <dd className="mt-1 text-[0.9375rem]">
                        {paceOptions.find((option) => option.value === pace)?.label} · {days} days
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">Base</dt>
                      <dd className="mt-1 text-[0.9375rem]">{accommodation}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">Interests</dt>
                      <dd className="mt-1 text-[0.9375rem]">
                        {selectedInterests.length
                          ? selectedInterests
                              .map(
                                (id) => interests.find((interest) => interest.id === id)?.label ?? id,
                              )
                              .join(' · ')
                          : 'Editorial order'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">Budget</dt>
                      <dd className="mt-1 text-[0.9375rem]">
                        {budgetOptions.find((option) => option.value === budget)?.label}
                      </dd>
                    </div>
                  </dl>

                  {notes.trim() ? (
                    <div className="mt-5 border-l border-seal/40 pl-4">
                      <p className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">Your note</p>
                      <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink/55">{notes.trim()}</p>
                    </div>
                  ) : null}

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <div className="flex gap-2.5 text-[0.75rem] leading-relaxed text-ink/55">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-olive" strokeWidth={1.5} aria-hidden="true" />
                      A day-by-day structure with a base area, arrival notes and transport guidance.
                    </div>
                    <div className="flex gap-2.5 text-[0.75rem] leading-relaxed text-ink/55">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-olive" strokeWidth={1.5} aria-hidden="true" />
                      Fully editable, printable, and stored only in your browser.
                    </div>
                  </div>
                </div>
              ) : null}

              {error ? (
                <p role="alert" className="border-t border-seal/30 bg-seal-soft/40 px-6 py-3 text-[0.8125rem] text-seal md:px-9">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink/14 px-6 py-4 md:px-9">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0}
                  className="inline-flex h-10 items-center gap-2 text-[0.8125rem] text-ink/55 transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-25"
                >
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  Back
                </button>
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-[0.8125rem] font-medium text-ivory transition-colors hover:bg-forest"
                  >
                    Continue
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={generate}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-seal px-6 text-[0.8125rem] font-medium text-ivory transition-colors hover:bg-[#8d3023]"
                  >
                    Compose the journey
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {selectedDestinations.length ? (
              <div className="mt-5 flex flex-wrap items-center gap-2 text-[0.6875rem] text-ink/40">
                <span className="uppercase tracking-[0.1em]">In this journey</span>
                {selectedDestinations.map((destination) => (
                  <span key={destination.slug} className="tag">
                    {destination.name}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
};
