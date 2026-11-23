import { useId, type ReactNode } from "react";

interface Base {
  label: string;
  hint?: string;
}

function Row({ id, label, hint, children }: Base & { id: string; children: ReactNode }) {
  return (
    <div className="field">
      <div className="field-text">
        <label htmlFor={id}>{label}</label>
        {hint && (
          <p className="muted small" id={`${id}-hint`}>
            {hint}
          </p>
        )}
      </div>
      <div className="field-control">{children}</div>
    </div>
  );
}

export function SelectField<T extends string>({
  label,
  hint,
  value,
  options,
  onChange,
}: Base & { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  const id = useId();
  return (
    <Row id={id} label={label} hint={hint}>
      <select id={id} value={value} aria-describedby={hint ? `${id}-hint` : undefined} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Row>
  );
}

export function ToggleField({ label, hint, value, onChange }: Base & { value: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <Row id={id} label={label} hint={hint}>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className="switch"
        checked={value}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.checked)}
      />
    </Row>
  );
}

export function RangeField({
  label,
  hint,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: Base & { value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void }) {
  const id = useId();
  return (
    <Row id={id} label={label} hint={hint}>
      <div className="range">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-describedby={hint ? `${id}-hint` : undefined}
          aria-valuetext={`${value}${unit}`}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <output htmlFor={id}>
          {value}
          {unit}
        </output>
      </div>
    </Row>
  );
}

export function TextField({ label, hint, value, onCommit }: Base & { value: string; onCommit: (v: string) => void }) {
  const id = useId();
  return (
    <Row id={id} label={label} hint={hint}>
      <input
        id={id}
        type="text"
        defaultValue={value}
        key={value}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onBlur={(e) => e.target.value !== value && onCommit(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
      />
    </Row>
  );
}
