"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CircleAlert, CircleCheckBig, Clock3, Phone, Send, UserRound } from "lucide-react";
import { useEffect, useId, useState, type FormEvent } from "react";
import { buttonClasses } from "../ui/Button";

type Fields = { name: string; phone: string; date: string; time: string };
type Errors = Partial<Record<keyof Fields, string>>;

const empty: Fields = { name: "", phone: "", date: "", time: "" };

const timeSlots = ["Morning (9 AM – 12 PM)", "Afternoon (12 PM – 4 PM)", "Evening (4 PM – 8 PM)"];

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function validate(f: Fields): Errors {
  const errors: Errors = {};
  const name = f.name.trim();
  if (!name) errors.name = "Please enter the patient's name.";
  else if (name.length < 2) errors.name = "Name should be at least 2 characters.";
  else if (!/^[\p{L}\p{M}.'\- ]+$/u.test(name)) errors.name = "Name can contain letters, spaces, apostrophes and hyphens only.";

  const digits = f.phone.replace(/\D/g, "");
  if (!f.phone.trim()) errors.phone = "Please enter a phone number.";
  else if (!/^\+?[\d\s()-]+$/.test(f.phone.trim()) || digits.length < 7 || digits.length > 15)
    errors.phone = "Please enter a valid phone number (7–15 digits).";

  if (!f.date) errors.date = "Please choose a preferred date.";
  else if (f.date < todayISO()) errors.date = "Please choose today or a future date.";

  if (!f.time) errors.time = "Please choose a preferred time.";
  return errors;
}

/**
 * Frontend-only appointment REQUEST form. Nothing is sent to a server in
 * Phase 1 — the success state only acknowledges the request locally and
 * makes clear that the appointment is not confirmed.
 */
export function AppointmentForm() {
  const uid = useId();
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<Fields | null>(null);
  // Computed after mount so server and client markup match regardless of time zone.
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  useEffect(() => setMinDate(todayISO()), []);

  const id = (k: keyof Fields) => `${uid}-${k}`;

  const update = (k: keyof Fields, v: string) => {
    const next = { ...fields, [k]: v };
    setFields(next);
    if (touched[k]) setErrors(validate(next));
  };

  const blur = (k: keyof Fields) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(fields));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = validate(fields);
    setErrors(v);
    setTouched({ name: true, phone: true, date: true, time: true });
    const firstInvalid = (Object.keys(v) as (keyof Fields)[])[0];
    if (firstInvalid) {
      document.getElementById(id(firstInvalid))?.focus();
      return;
    }
    setSubmitting(true);
    // Simulated latency for a natural feel; replace with a real API call in a later phase.
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSubmitted({ ...fields, name: fields.name.trim() });
    setFields(empty);
    setTouched({});
  };

  const fieldClass = (k: keyof Fields) =>
    `w-full rounded-2xl border bg-white py-3.5 pr-4 pl-11 text-base text-navy-900 placeholder:text-navy-300 shadow-sm transition focus:outline-none focus:ring-4 sm:text-sm ${
      touched[k] && errors[k]
        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-navy-100 focus:border-teal-400 focus:ring-teal-100"
    }`;

  const errorText = (k: keyof Fields) =>
    touched[k] && errors[k] ? (
      <p id={`${id(k)}-error`} className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
        <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {errors[k]}
      </p>
    ) : null;

  const describedBy = (k: keyof Fields) => (touched[k] && errors[k] ? `${id(k)}-error` : undefined);

  return (
    <div className="relative rounded-[2rem] bg-white p-6 shadow-lift sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35 }}
            role="status"
            aria-live="polite"
            className="flex flex-col items-center py-6 text-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-600 ring-8 ring-teal-50/60">
              <CircleCheckBig className="h-8 w-8" aria-hidden />
            </span>
            <h3 className="mt-6 font-display text-2xl font-semibold text-navy-900">Request received</h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-navy-600">
              Thank you, <span className="font-semibold text-navy-900">{submitted.name}</span>. Your appointment
              request for <span className="font-semibold text-navy-900">{formatDate(submitted.date)}</span>,{" "}
              {submitted.time}, has been noted.
            </p>
            <p className="mt-4 max-w-sm rounded-2xl bg-mist px-4 py-3 text-xs leading-relaxed text-navy-600">
              <strong className="text-navy-800">Please note:</strong> this is a request only and your appointment is
              <strong className="text-navy-800"> not yet confirmed</strong>. Confirmation is subject to availability —
              please contact the chamber to confirm your visit.
            </p>
            <button type="button" onClick={() => setSubmitted(null)} className={buttonClasses("secondary", "mt-6")}>
              Make another request
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={onSubmit}
            noValidate
            aria-labelledby={`${uid}-title`}
          >
            <h3 id={`${uid}-title`} className="font-display text-2xl font-semibold text-navy-900">
              Request an appointment
            </h3>
            <p className="mt-1.5 text-sm text-navy-500">All fields are required.</p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor={id("name")} className="mb-1.5 block text-sm font-semibold text-navy-800">
                  Patient Name
                </label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-navy-400" aria-hidden />
                  <input
                    id={id("name")}
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Full name"
                    value={fields.name}
                    onChange={(e) => update("name", e.target.value)}
                    onBlur={() => blur("name")}
                    aria-invalid={!!(touched.name && errors.name)}
                    aria-describedby={describedBy("name")}
                    className={fieldClass("name")}
                    maxLength={80}
                  />
                </div>
                {errorText("name")}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={id("phone")} className="mb-1.5 block text-sm font-semibold text-navy-800">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-navy-400" aria-hidden />
                  <input
                    id={id("phone")}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+00 0000 000 000"
                    value={fields.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    onBlur={() => blur("phone")}
                    aria-invalid={!!(touched.phone && errors.phone)}
                    aria-describedby={describedBy("phone")}
                    className={fieldClass("phone")}
                    maxLength={20}
                  />
                </div>
                {errorText("phone")}
              </div>

              <div>
                <label htmlFor={id("date")} className="mb-1.5 block text-sm font-semibold text-navy-800">
                  Preferred Date
                </label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2 text-navy-400" aria-hidden />
                  <input
                    id={id("date")}
                    name="date"
                    type="date"
                    min={minDate}
                    value={fields.date}
                    onChange={(e) => update("date", e.target.value)}
                    onBlur={() => blur("date")}
                    aria-invalid={!!(touched.date && errors.date)}
                    aria-describedby={describedBy("date")}
                    className={`${fieldClass("date")} min-h-[3.25rem] appearance-none`}
                  />
                </div>
                {errorText("date")}
              </div>

              <div>
                <label htmlFor={id("time")} className="mb-1.5 block text-sm font-semibold text-navy-800">
                  Preferred Time
                </label>
                <div className="relative">
                  <Clock3 className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-navy-400" aria-hidden />
                  <select
                    id={id("time")}
                    name="time"
                    value={fields.time}
                    onChange={(e) => update("time", e.target.value)}
                    onBlur={() => blur("time")}
                    aria-invalid={!!(touched.time && errors.time)}
                    aria-describedby={describedBy("time")}
                    className={`${fieldClass("time")} min-h-[3.25rem] appearance-none ${fields.time ? "" : "!text-navy-300"}`}
                  >
                    <option value="" disabled>
                      Select a time
                    </option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t} className="text-navy-900">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                {errorText("time")}
              </div>
            </div>

            <button type="submit" disabled={submitting} className={buttonClasses("primary", "mt-7 w-full !py-4")}>
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
                  Sending request…
                </>
              ) : (
                <>
                  Submit Request
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </>
              )}
            </button>
            <p className="mt-4 text-center text-xs leading-relaxed text-navy-400">
              Submitting this form sends a request only — it does not confirm an appointment. For medical
              emergencies, contact your local emergency services immediately.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
