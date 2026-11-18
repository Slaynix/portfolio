import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import type { EntityConfig, Field } from "@/lib/manager-schema";
import { deleteRow, listRows, saveRow, setSortOrder } from "@/lib/manager-api";
import { MediaPickerDialog } from "./MediaPicker";
import { isImage } from "@/lib/media";

type Row = Record<string, unknown>;

function emptyValues(config: EntityConfig): Row {
  const values: Row = {};
  for (const field of config.fields) {
    values[field.key] = field.type === "tags" ? [] : field.type === "boolean" ? false : "";
  }
  return values;
}

function toFormValue(field: Field, value: unknown) {
  if (field.type === "tags") return Array.isArray(value) ? value.join(", ") : "";
  if (field.type === "boolean") return Boolean(value);
  if (value === null || value === undefined) return "";
  return value as string | number;
}

function toDbValue(field: Field, value: unknown) {
  if (field.type === "tags") {
    const text = String(value ?? "").trim();
    return text ? text.split(",").map((item) => item.trim()).filter(Boolean) : [];
  }
  if (field.type === "boolean") return Boolean(value);
  if (field.type === "number") {
    const text = String(value ?? "").trim();
    return text === "" ? null : Number(text);
  }
  const text = String(value ?? "").trim();
  return text === "" ? null : text;
}

export function EntityManager({ config }: { config: EntityConfig }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>(() => emptyValues(config));
  const [saving, setSaving] = useState(false);
  const [picker, setPicker] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const data = await listRows(config.table);
      setRows(data);
      if (config.singleton) {
        const first = data[0] ?? null;
        setEditing(first);
        setForm(first ? hydrate(first) : emptyValues(config));
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load content.");
    } finally {
      setLoading(false);
    }
  }

  function hydrate(row: Row): Row {
    const values: Row = {};
    for (const field of config.fields) values[field.key] = toFormValue(field, row[field.key]);
    return values;
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.table]);

  const editingId = editing?.["id"] as string | undefined;

  async function save() {
    setSaving(true);
    try {
      const payload: Row = {};
      for (const field of config.fields) payload[field.key] = toDbValue(field, form[field.key]);
      if (config.hasSort && !editingId) payload["sort_order"] = rows.length;
      await saveRow(config.table, payload, editingId);
      toast.success("Saved.");
      if (!config.singleton) setEditing(null);
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(row: Row) {
    try {
      await saveRow(config.table, { published: !row["published"] }, row["id"] as string);
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update.");
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const a = rows[index] as Row;
    const b = rows[target] as Row;
    try {
      await setSortOrder(config.table, a["id"] as string, target);
      await setSortOrder(config.table, b["id"] as string, index);
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not reorder.");
    }
  }

  const editorFields = useMemo(() => config.fields, [config]);

  const editorOpen = config.singleton || editing !== null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">
            <span className="text-gradient">{config.label}</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            {config.singleton
              ? "These details power your public profile."
              : `${rows.length} item${rows.length === 1 ? "" : "s"} · changes go live instantly.`}
          </p>
        </div>
        {!config.singleton ? (
          <button
            type="button"
            onClick={() => {
              setEditing({});
              setForm(emptyValues(config));
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> Add new
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : null}

      {editorOpen ? (
        <div className="glass rounded-3xl p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {editorFields.map((field) => (
              <FieldInput
                key={field.key}
                field={field}
                value={form[field.key]}
                onChange={(value) => setForm((prev) => ({ ...prev, [field.key]: value }))}
                onPick={() => setPicker(field.key)}
              />
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            {!config.singleton ? (
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {!config.singleton && !loading ? (
        <div className="space-y-2">
          {rows.length === 0 ? (
            <p className="glass rounded-2xl p-6 text-sm text-muted-foreground">
              Nothing here yet. Use “Add new” to create your first entry.
            </p>
          ) : null}
          {rows.map((row, index) => (
            <div
              key={String(row["id"])}
              className="glass flex flex-wrap items-center gap-3 rounded-2xl p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {String(row[config.titleKey] ?? "Untitled")}
                </p>
                {config.subtitleKey ? (
                  <p className="truncate text-[11px] text-muted-foreground">
                    {String(row[config.subtitleKey] ?? "")}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-1.5">
                {config.hasSort ? (
                  <>
                    <IconButton label="Move up" onClick={() => void move(index, -1)}>
                      <ArrowUp className="h-3.5 w-3.5" />
                    </IconButton>
                    <IconButton label="Move down" onClick={() => void move(index, 1)}>
                      <ArrowDown className="h-3.5 w-3.5" />
                    </IconButton>
                  </>
                ) : null}
                {config.hasPublished ? (
                  <IconButton
                    label={row["published"] ? "Unpublish" : "Publish"}
                    onClick={() => void togglePublished(row)}
                  >
                    {row["published"] ? (
                      <Eye className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                  </IconButton>
                ) : null}
                <IconButton
                  label="Edit"
                  onClick={() => {
                    setEditing(row);
                    setForm(hydrate(row));
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </IconButton>
                <IconButton
                  label="Delete"
                  onClick={async () => {
                    if (!confirm("Delete this item?")) return;
                    try {
                      await deleteRow(config.table, row["id"] as string);
                      await refresh();
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "Could not delete.");
                    }
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <MediaPickerDialog
        open={picker !== null}
        onClose={() => setPicker(null)}
        category={config.table}
        onPick={(media) => {
          if (!picker) return;
          const field = config.fields.find((item) => item.key === picker);
          setForm((prev) => {
            if (field?.type === "tags") {
              const current = String(prev[picker] ?? "").trim();
              return { ...prev, [picker]: current ? `${current}, ${media.url}` : media.url };
            }
            return { ...prev, [picker]: media.url ?? "" };
          });
        }}
      />
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </button>
  );
}

function FieldInput({
  field,
  value,
  onChange,
  onPick,
}: {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
  onPick: () => void;
}) {
  const base =
    "w-full rounded-xl border border-border bg-surface-2/60 px-3 py-2 text-sm outline-none focus:border-primary";
  const wide = field.type === "textarea" || field.type === "tags";

  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {field.label}
      </label>

      {field.type === "textarea" ? (
        <textarea
          rows={4}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      ) : field.type === "boolean" ? (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 accent-[var(--primary)]"
          />
          <span className="text-muted-foreground">Enabled</span>
        </label>
      ) : field.type === "image" || field.type === "file" ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              value={String(value ?? "")}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Pick from library or paste a URL"
              className={base}
            />
            <button
              type="button"
              onClick={onPick}
              className="shrink-0 rounded-xl bg-primary/15 px-3 py-2 text-xs text-primary"
            >
              Browse
            </button>
          </div>
          {value && isImage(String(value)) ? (
            <img
              src={String(value)}
              alt={field.label}
              loading="lazy"
              className="h-24 rounded-xl border border-border object-cover"
            />
          ) : null}
        </div>
      ) : (
        <input
          type={field.type === "number" ? "number" : "text"}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      )}

      {field.hint ? <p className="mt-1 text-[11px] text-muted-foreground">{field.hint}</p> : null}
    </div>
  );
}
