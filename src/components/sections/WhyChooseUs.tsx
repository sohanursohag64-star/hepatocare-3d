import { BookOpenCheck, HandHeart, Stethoscope, UserRoundCog, type LucideIcon } from "lucide-react";
import type { Dict } from "@/i18n/dictionaries";
import { RevealItem } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

const icons: LucideIcon[] = [Stethoscope, BookOpenCheck, UserRoundCog, HandHeart];

export function WhyChooseUs({ t }: { t: Dict["why"] }) {
  const features = t.items.map((item, i) => ({ ...item, icon: icons[i] }));
  return (
    <section aria-labelledby="why-title" className="relative isolate overflow-hidden bg-navy-950 py-20 text-white sm:py-28">
      <div className="bg-grid absolute inset-0 -z-10 opacity-60 invert" aria-hidden />
      <div className="absolute -top-32 left-1/4 -z-10 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" aria-hidden />
      <div className="absolute -right-24 -bottom-32 -z-10 h-96 w-96 rounded-full bg-navy-500/30 blur-3xl" aria-hidden />

      <div className="container-page">
        <SectionHeading
          id="why-title"
          tone="dark"
          eyebrow={t.eyebrow}
          title={t.title}
          description={t.description}
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <RevealItem
              key={f.title}
              delay={0.08 * i}
              className="group relative rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-[translate,background-color,border-color] duration-500 hover:-translate-y-1.5 hover:border-teal-400/40 hover:bg-white/[0.08]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-glow transition-transform duration-500 group-hover:scale-105">
                <f.icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-navy-200">{f.description}</p>
              <span
                className="absolute inset-x-7 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-teal-400 to-transparent transition-transform duration-500 group-hover:scale-x-100"
                aria-hidden
              />
            </RevealItem>
          ))}
        </ul>
      </div>
    </section>
  );
}
