import { Activity, ArrowUpRight, Droplets, FlaskConical, Microscope, ShieldPlus, SunMedium, type LucideIcon } from "lucide-react";
import { fill, type Dict } from "@/i18n/dictionaries";
import { RevealItem } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

/** Icons, in the same order as the specialties in the dictionary. */
const icons: LucideIcon[] = [Droplets, ShieldPlus, Microscope, SunMedium, FlaskConical, Activity];

export function Specialties({ t }: { t: Dict["specialties"] }) {
  const specialties = t.items.map((item, i) => ({ ...item, icon: icons[i] }));
  return (
    <section
      id="specialties"
      aria-labelledby="specialties-title"
      className="relative overflow-hidden bg-mist py-20 sm:py-28"
    >
      <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" aria-hidden />
      <div className="container-page relative">
        <SectionHeading
          id="specialties-title"
          eyebrow={t.eyebrow}
          title={t.title}
          description={t.description}
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {specialties.map((s, i) => (
            <RevealItem
              key={s.title}
              delay={0.06 * i}
              className="shine group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white bg-white p-7 shadow-soft transition-[translate,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:border-teal-100 hover:shadow-lift"
            >
                <div
                  className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-teal-100/0 transition-colors duration-500 group-hover:bg-teal-100/70"
                  aria-hidden
                />
                <div className="relative flex items-start justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 text-teal-300 shadow-soft transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
                    <s.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="font-display text-sm text-navy-300">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="relative mt-6 font-display text-xl font-semibold text-navy-900">{s.title}</h3>
                <p className="relative mt-3 flex-1 text-sm leading-relaxed text-navy-600">{s.description}</p>
                <a
                  href="#appointment"
                  className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 transition-colors hover:text-teal-500"
                  aria-label={fill(t.ctaAria, { title: s.title })}
                >
                  {t.cta}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </a>
            </RevealItem>
          ))}
        </ul>
      </div>
    </section>
  );
}
