import { useState } from 'react';
import type { Activity, ActivityKind } from '@/data/types';
import { Modal } from '@/components/ui/Modal';
import { Field, Input, Select, Textarea } from '@/components/ui/field';

export type ActivityDraft = Omit<Activity, 'id'>;

type ActivityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Activity | null;
  dayLabel: string;
  onSave: (draft: ActivityDraft) => void;
};

const kinds: { value: ActivityKind; label: string }[] = [
  { value: 'place', label: 'Place' },
  { value: 'food', label: 'Food' },
  { value: 'walk', label: 'Walk' },
  { value: 'stay', label: 'Stay' },
  { value: 'travel', label: 'Travel' },
  { value: 'note', label: 'Note' },
];

const emptyDraft: ActivityDraft = {
  title: '',
  note: '',
  time: '',
  cost: undefined,
  link: '',
  kind: 'place',
};

export const ActivityDialog = ({ open, onOpenChange, initial, dayLabel, onSave }: ActivityDialogProps) => {
  const [draft, setDraft] = useState<ActivityDraft>(() =>
    initial
      ? {
          title: initial.title,
          note: initial.note ?? '',
          time: initial.time ?? '',
          cost: initial.cost,
          link: initial.link ?? '',
          kind: initial.kind,
        }
      : emptyDraft,
  );
  const [error, setError] = useState('');

  const submit = () => {
    if (!draft.title.trim()) {
      setError('Give the activity a name.');
      return;
    }
    if (draft.link) {
      try {
        const parsed = new URL(draft.link);
        if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('protocol');
      } catch {
        setError('Links need to start with http:// or https://');
        return;
      }
    }
    if (draft.cost !== undefined && (Number.isNaN(draft.cost) || draft.cost < 0)) {
      setError('Cost needs to be a positive number.');
      return;
    }
    onSave({
      ...draft,
      title: draft.title.trim(),
      note: draft.note?.trim() || undefined,
      time: draft.time?.trim() || undefined,
      link: draft.link?.trim() || undefined,
      cost: draft.cost === undefined || Number.isNaN(draft.cost) ? undefined : draft.cost,
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? 'Edit activity' : 'Add an activity'}
      description={dayLabel}
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-11 px-4 text-[0.8125rem] text-ink/60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            className="h-11 rounded-full bg-ink px-6 text-[0.8125rem] font-medium text-ivory"
          >
            {initial ? 'Save changes' : 'Add activity'}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <Field id="activity-title" label="What" error={error}>
          <Input
            id="activity-title"
            value={draft.title}
            onChange={(event) => {
              setDraft((current) => ({ ...current, title: event.target.value }));
              setError('');
            }}
            placeholder="A slow morning in the old town"
            maxLength={90}
            autoFocus
            aria-invalid={Boolean(error)}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field id="activity-kind" label="Kind">
            <Select
              id="activity-kind"
              value={draft.kind}
              onChange={(event) =>
                setDraft((current) => ({ ...current, kind: event.target.value as ActivityKind }))
              }
            >
              {kinds.map((kind) => (
                <option key={kind.value} value={kind.value}>
                  {kind.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field id="activity-time" label="Time" optional>
            <Input
              id="activity-time"
              type="time"
              value={draft.time ?? ''}
              onChange={(event) => setDraft((current) => ({ ...current, time: event.target.value }))}
            />
          </Field>
          <Field id="activity-cost" label="Cost (EUR)" optional>
            <Input
              id="activity-cost"
              type="number"
              min="0"
              step="1"
              inputMode="decimal"
              value={draft.cost ?? ''}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  cost: event.target.value === '' ? undefined : Number(event.target.value),
                }))
              }
              placeholder="0"
            />
          </Field>
        </div>

        <Field id="activity-note" label="Note" optional>
          <Textarea
            id="activity-note"
            value={draft.note ?? ''}
            onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))}
            placeholder="Book ahead, or leave the afternoon open."
            rows={3}
            maxLength={280}
          />
        </Field>

        <Field id="activity-link" label="Link" optional hint="A booking page, a map pin, a reference.">
          <Input
            id="activity-link"
            type="url"
            value={draft.link ?? ''}
            onChange={(event) => setDraft((current) => ({ ...current, link: event.target.value }))}
            placeholder="https://"
            maxLength={300}
          />
        </Field>
      </div>
    </Modal>
  );
};
