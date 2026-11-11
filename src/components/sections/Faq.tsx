import { Plus } from "lucide-react";
import type { Dict } from "@/i18n/dictionaries";
import { RevealItem } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

/** Frequently asked questions, using native <details> so it works without JavaScript. */
export function Faq({ t }: { t: Dict["faq"] }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-white py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="faq-title" eyebrow={t.eyebrow} title={t.title} description={t.description} />

        <ul className="mx-auto mt-12 max-w-3xl space-y-3">
          {t.items.map((item, i) => (
            <RevealItem key={item.q} delay={0.04 * i}>
              <details className="group rounded-2xl border border-navy-100 bg-mist/50 transition-colors open:border-teal-200 open:bg-white open:shadow-soft">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left font-semibold text-navy-900 transition-colors hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-teal-500 sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-teal-600 shadow-soft transition-transform duration-300 group-open:rotate-45">
                    <Plus className="h-4 w-4" aria-hidden />
                  </span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-navy-600 sm:px-6 sm:text-base">{item.a}</p>
              </details>
            </RevealItem>
          ))}
        </ul>
      </div>
    </section>
  );
}
