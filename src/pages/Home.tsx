import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** =========================
 *  CONFIG
 *  ========================= */
const BASE_URL = import.meta.env?.VITE_API_BASE_URL ?? "http://localhost:3000";

/** =========================
 *  TYPES
 *  ========================= */
type Court = {
  _id: string;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  price: number;
  activity: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type Booking = {
  _id: string;
  courtId: Court; // Now populated with full court object
  name: string;
  phoneNumber: string;
  timeSlots: number[][];
  date: string; // YYYY-MM-DD
  paidAmount: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

type CreateBookingDto = {
  courtId: string;
  name: string;
  phoneNumber: string;
  timeSlots: number[][] | string; // backend accepts flexible string/array
  date: string; // YYYY-MM-DD
  paidAmount: number;
};

type ApiErr = { message?: string };

/** =========================
 *  UTIL: FETCH WRAPPER
 *  ========================= */
async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = (await res.json()) as ApiErr;
      if (data?.message) msg = Array.isArray(data.message) ? data.message.join(", ") : data.message;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

/** =========================
 *  UI PRIMITIVES
 *  ========================= */
function classNames(...xs: (string | boolean | undefined | null)[]) {
  return xs.filter(Boolean).join(" ");
}

const Badge: React.FC<React.PropsWithChildren<{ title?: string; variant?: "default" | "success" | "info" }>> = ({ 
  children, 
  title, 
  variant = "default" 
}) => {
  const variants = {
    default: "bg-slate-100 text-slate-800 ring-slate-200",
    success: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    info: "bg-blue-100 text-blue-800 ring-blue-200",
  };

  return (
    <span
      title={title}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

/** =========================
 *  DIALOG (headless, no deps)
 *  ========================= */
type DialogProps = {
  open: boolean;
  onClose(): void;
  title?: string;
  subtitle?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
};

const Dialog: React.FC<DialogProps> = ({ open, onClose, title, subtitle, children, maxWidth = "md" }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Focus trap (simple)
  useEffect(() => {
    if (!open) return;
    const el = ref.current;
    const focusable = el?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !focusable?.length) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    first?.focus();
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="dialog-title"
    >
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={ref}
        className={classNames(
          "relative mx-auto w-full rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200",
          {
            sm: "max-w-sm",
            md: "max-w-md",
            lg: "max-w-2xl",
            xl: "max-w-4xl",
          }[maxWidth]
        )}
      >
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              {title && (
                <h2 id="dialog-title" className="text-base font-semibold text-slate-900">
                  {title}
                </h2>
              )}
              {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
              aria-label="Close dialog"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body
  );
};

/** =========================
 *  TIME SLOT PICKER
 *  ========================= */
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function humanSlot([s, e]: number[]) {
  const fmt = (h: number) => `${String(h).padStart(2, "0")}:00`;
  return `${fmt(s)}–${fmt(e)}`;
}

type TimeSlotPickerProps = {
  value: number[][];
  onChange(v: number[][]): void;
  minHour?: number;
  maxHour?: number;
};

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ value, onChange, minHour = 6, maxHour = 24 }) => {
  const [pendingStart, setPendingStart] = useState<number | null>(null);

  const hours = useMemo(() => HOURS.filter((h) => h >= minHour && h <= maxHour), [minHour, maxHour]);

  const confirmRange = (start: number, end: number) => {
    if (start >= end) return;
    const next = [...value, [start, end]];
    onChange(next);
    setPendingStart(null);
  };

  const onHourClick = (h: number) => {
    if (pendingStart === null) {
      setPendingStart(h);
    } else {
      confirmRange(pendingStart, h);
    }
  };

  const clear = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-8 gap-2">
        {hours.map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => onHourClick(h)}
            className={classNames(
              "rounded-md border px-2 py-2 text-sm font-medium",
              pendingStart === h
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
            title={String(h).padStart(2, "0") + ":00"}
          >
            {String(h).padStart(2, "0")}:00
          </button>
        ))}
      </div>

      {pendingStart !== null && (
        <p className="text-xs text-slate-500">
          Select an end hour greater than <span className="font-medium">{String(pendingStart).padStart(2, "0")}:00</span>
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {value.length === 0 ? (
          <span className="text-sm text-slate-500">No time slots added yet.</span>
        ) : (
          value.map((slot, i) => (
            <span key={i} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm">
              <span className="font-medium">{humanSlot(slot)}</span>
              <button
                type="button"
                onClick={() => clear(i)}
                className="rounded-full p-1.5 text-slate-500 hover:bg-white hover:text-slate-700"
                aria-label="Remove slot"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
};

/** =========================
 *  BOOKING FORM
 *  ========================= */
const BookingForm: React.FC<{
  onCreated(b: Booking): void;
}> = ({ onCreated }) => {
  const [courtId, setCourtId] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [date, setDate] = useState("");
  const [timeSlots, setTimeSlots] = useState<number[][]>([]);
  const [paidAmount, setPaidAmount] = useState<number | "">("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = courtId && name && phoneNumber && date && timeSlots.length > 0 && paidAmount !== "";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    setError(null);
    try {
      const body: CreateBookingDto = {
        courtId,
        name,
        phoneNumber,
        date,
        timeSlots, // already [[start,end],...]
        paidAmount: Number(paidAmount),
      };
      const created = await api<Booking>("/bookings", {
        method: "POST",
        body: JSON.stringify(body),
      });
      onCreated(created);
      // reset
      setCourtId("");
      setName("");
      setPhoneNumber("");
      setDate("");
      setTimeSlots([]);
      setPaidAmount("");
    } catch (err: any) {
      setError(err?.message ?? "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Create Booking</h3>
        <Badge>POST /bookings</Badge>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Court ID</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            placeholder="665f8d... (ObjectId)"
            value={courtId}
            onChange={(e) => setCourtId(e.target.value)}
            required
          />
          <p className="mt-1 text-xs text-slate-500">Paste the court's ObjectId.</p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone Number</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="9876543210"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Date</label>
          <input
            type="date"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Time Slots</label>
          <TimeSlotPicker value={timeSlots} onChange={setTimeSlots} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Paid Amount</label>
          <input
            type="number"
            min={0}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="1000"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setCourtId("");
            setName("");
            setPhoneNumber("");
            setDate("");
            setTimeSlots([]);
            setPaidAmount("");
            setError(null);
          }}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={!valid || submitting}
          className={classNames(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white shadow-sm",
            submitting ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800"
          )}
        >
          {submitting && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" opacity={0.25} />
              <path d="M22 12a10 10 0 0 1-10 10" stroke="white" strokeWidth="4" fill="none" />
            </svg>
          )}
          Create
        </button>
      </div>
    </form>
  );
};

/** =========================
 *  FIND BY PHONE (Dialog)
 *  ========================= */
const PhoneLookup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    setLoading(true);
    setError(null);
    setRows(null);
    try {
      const data = await api<Booking[]>(`/bookings/phone/${encodeURIComponent(phone)}`);
      setRows(data);
    } catch (err: any) {
      setError(err?.message ?? "Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M21 21l-4.35-4.35M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" stroke="currentColor" strokeWidth="2" />
        </svg>
        Find by phone
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Find bookings by phone"
        subtitle="GET /bookings/phone/:phoneNumber"
        maxWidth="xl"
      >
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              onClick={search}
              disabled={!phone || loading}
              className={classNames(
                "rounded-lg px-4 py-2 text-white",
                loading ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800"
              )}
            >
              Search
            </button>
          </div>

          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          {loading && (
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity={0.25} />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
              Searching…
            </div>
          )}

          {rows && rows.length === 0 && <p className="text-sm text-slate-500">No bookings found.</p>}

          {rows && rows.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Court</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Activity</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Time Slots</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600">Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {rows.map((b) => (
                    <tr key={b._id}>
                      <td className="px-4 py-2 text-sm text-slate-800">{b.date}</td>
                      <td className="px-4 py-2 text-sm">
                        <div>
                          <div className="font-medium text-slate-900">{b.courtId.name}</div>
                          <div className="text-xs text-slate-500">{b.courtId.location}</div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <Badge variant="info">{b.courtId.activity}</Badge>
                      </td>
                      <td className="px-4 py-2 text-sm text-slate-700">
                        <div className="flex flex-wrap gap-1">
                          {b.timeSlots.map((s, i) => (
                            <Badge key={i}>{humanSlot(s)}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right text-sm font-semibold text-slate-900">₹{b.paidAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};

/** =========================
 *  AVAILABILITY TOOLS
 *  ========================= */
const AvailabilityTools: React.FC = () => {
  const [courtId, setCourtId] = useState("");
  const [date, setDate] = useState("");
  const [unavailable, setUnavailable] = useState<number[][] | null>(null);
  const [uLoading, setULoading] = useState(false);
  const [uError, setUError] = useState<string | null>(null);

  const [fullyBooked, setFullyBooked] = useState<string[] | null>(null);
  const [fLoading, setFLoading] = useState(false);
  const [fError, setFError] = useState<string | null>(null);

  const getUnavailable = async () => {
    if (!courtId || !date) return;
    setUError(null);
    setUnavailable(null);
    setULoading(true);
    try {
      const qs = new URLSearchParams({ courtId, date }).toString();
      const data = await api<number[][]>(`/bookings/unavailable?${qs}`);
      setUnavailable(data);
    } catch (err: any) {
      setUError(err?.message ?? "Failed to fetch unavailable slots");
    } finally {
      setULoading(false);
    }
  };

  const getFullyBookedDays = async () => {
    if (!courtId) return;
    setFError(null);
    setFullyBooked(null);
    setFLoading(true);
    try {
      const data = await api<string[]>(`/bookings/fully-booked-days/${encodeURIComponent(courtId)}`);
      setFullyBooked(data);
    } catch (err: any) {
      setFError(err?.message ?? "Failed to fetch fully booked days");
    } finally {
      setFLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Availability</h3>
        <div className="flex gap-2">
          <Badge title="GET /bookings/unavailable">Unavailable</Badge>
          <Badge title="GET /bookings/fully-booked-days/:courtId">Fully booked days</Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Court ID</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={courtId}
            onChange={(e) => setCourtId(e.target.value)}
            placeholder="Court ObjectId"
          />
        </div>
        <div className="sm:col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Date</label>
          <input
            type="date"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="flex items-end gap-3">
          <button
            onClick={getUnavailable}
            disabled={!courtId || !date || uLoading}
            className={classNames(
              "rounded-lg px-4 py-2 text-white",
              uLoading ? "bg-slate-400" : "bg-indigo-600 hover:bg-indigo-500"
            )}
          >
            Unavailable
          </button>
          <button
            onClick={getFullyBookedDays}
            disabled={!courtId || fLoading}
            className={classNames(
              "rounded-lg px-4 py-2 text-white",
              fLoading ? "bg-slate-400" : "bg-emerald-600 hover:bg-emerald-500"
            )}
          >
            Fully booked
          </button>
        </div>
      </div>

      {/* Unavailable */}
      <div className="mt-6">
        {uError && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{uError}</div>}
        {uLoading && <p className="text-sm text-slate-500">Loading unavailable slots…</p>}
        {unavailable && (
          <div>
            <h4 className="mb-2 text-sm font-semibold text-slate-800">Unavailable time slots:</h4>
            <div className="flex flex-wrap gap-2">
              {unavailable.length === 0 ? (
                <Badge variant="success">None 🎉</Badge>
              ) : (
                unavailable.map((s, i) => <Badge key={i}>{humanSlot(s)}</Badge>)
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fully booked days */}
      <div className="mt-6">
        {fError && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{fError}</div>}
        {fLoading && <p className="text-sm text-slate-500">Loading fully booked days…</p>}
        {fullyBooked && (
          <div>
            <h4 className="mb-2 text-sm font-semibold text-slate-800">Fully booked days:</h4>
            <div className="flex flex-wrap gap-2">
              {fullyBooked.length === 0 ? (
                <Badge variant="success">None 🎉</Badge>
              ) : (
                fullyBooked.map((d) => <Badge key={d}>{d}</Badge>)
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/** =========================
 *  BOOKINGS TABLE
 *  ========================= */
const BookingTable: React.FC<{ rows: Booking[] }> = ({ rows }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-900">All Bookings</h3>
        <Badge>GET /bookings</Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Date</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Name</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Phone</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Court</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Activity</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Time Slots</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600">Paid</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.map((b) => (
              <tr key={b._id} className="hover:bg-slate-50">
                <td className="px-4 py-2 text-sm">{b.date}</td>
                <td className="px-4 py-2 text-sm text-slate-800">{b.name}</td>
                <td className="px-4 py-2 text-sm text-slate-700">{b.phoneNumber}</td>
                <td className="px-4 py-2 text-sm">
                  <div>
                    <div className="font-medium text-slate-900">{b.courtId.name}</div>
                    <div className="text-xs text-slate-500">{b.courtId.location}</div>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm">
                  <Badge variant="info">{b.courtId.activity}</Badge>
                </td>
                <td className="px-4 py-2 text-sm">
                  <div className="flex flex-wrap gap-1">
                    {b.timeSlots.map((s, i) => (
                      <Badge key={i}>{humanSlot(s)}</Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2 text-right text-sm font-semibold text-slate-900">₹{b.paidAmount}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/** =========================
 *  PAGE: BOOKING DASHBOARD
 *  ========================= */
const BookingDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await api<Booking[]>("/bookings");
      setBookings(data);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage bookings, check unavailable slots, and find reservations by phone.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PhoneLookup />
          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-3">
          {err && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</div>}

          {loading ? (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-6 text-slate-600">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity={0.25} />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
              Loading bookings…
            </div>
          ) : (
            <BookingTable rows={bookings} />
          )}
        </div>

        <div className="space-y-8 lg:col-span-2">
          <BookingForm
            onCreated={(b) => {
              setBookings((xs) => [b, ...xs]);
            }}
          />
          {/* <AvailabilityTools /> */}
        </div>
      </div>
    </div>
  );
};

export default BookingDashboard;