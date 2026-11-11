import { CalendarCheck, Clock3, Mail, Phone } from "lucide-react";
import { chamber } from "@/lib/site";
import { Reveal } from "../ui/Reveal";
import { AppointmentForm } from "./AppointmentForm";

const steps = [
  { title: "Send a request", text: "Share your name, phone number and preferred time." },
  { title: "Chamber follow-up", text: "The chamber reviews availability for your preferred slot." },
  { title: "Confirmed visit", text: "Your visit is confirmed only once the chamber has confirmed it with you." },
];

export function Appointment() {
  return (
    <section
      id="appointment"
      aria-labelledby="appointment-title"
      className="relative isolate overflow-hidden bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 py-20 sm:py-28"
    >
      <div className="bg-grid absolute inset-0 -z-10 opacity-50 invert" aria-hidden />
      <div className="absolute top-0 right-0 -z-10 h-[30rem] w-[30rem] translate-x-1/3 -translate-y-1/3 rounded-full bg-teal-500/25 blur-3xl" aria-hidden />
      <div className="absolute bottom-0 left-0 -z-10 h-[26rem] w-[26rem] -translate-x-1/3 translate-y-1/3 rounded-full bg-teal-300/10 blur-3xl" aria-hidden />

      <div className="container-page grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <Reveal className="text-white">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
            <CalendarCheck className="h-4 w-4" aria-hidden />
            Appointments
          </p>
          <h2
            id="appointment-title"
            className="mt-4 text-balance font-display text-3xl leading-[1.15] font-medium tracking-tight sm:text-4xl lg:text-5xl"
          >
            Take the first step towards <span className="italic text-teal-300">better liver health</span>.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-navy-200 sm:text-lg">
            Request a consultation at a time that suits you. The chamber will get back to you to confirm availability.
          </p>

          <ol className="mt-9 space-y-5">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-teal-400/40 bg-teal-400/10 font-display text-sm font-semibold text-teal-300">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-semibold text-white">{s.title}</span>
                  <span className="block text-sm text-navy-300">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={chamber.phoneHref}
              className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:border-teal-400/50 hover:bg-white/10"
            >
              <Phone className="h-4 w-4 text-teal-300" aria-hidden />
              {chamber.phone}
            </a>
            <a
              href={`mailto:${chamber.email}`}
              className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:border-teal-400/50 hover:bg-white/10"
            >
              <Mail className="h-4 w-4 text-teal-300" aria-hidden />
              {chamber.email}
            </a>
            <span className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-navy-200">
              <Clock3 className="h-4 w-4 text-teal-300" aria-hidden />
              {chamber.hours[0].days} · {chamber.hours[0].time}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <AppointmentForm />
        </Reveal>
      </div>
    </section>
  );
}
