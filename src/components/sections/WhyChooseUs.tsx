import { BookOpenCheck, HandHeart, Stethoscope, UserRoundCog, type LucideIcon } from "lucide-react";
import { RevealItem } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

type Feature = { title: string; description: string; icon: LucideIcon };

const features: Feature[] = [
  {
    title: "Specialist Consultation",
    description: "Direct consultation with a liver specialist who reviews your concerns, history and reports in detail.",
    icon: Stethoscope,
  },
  {
    title: "Evidence-Based Medical Care",
    description: "Clinical decisions guided by current, recognised medical evidence and professional guidelines.",
    icon: BookOpenCheck,
  },
  {
    title: "Personalized Treatment Approach",
    description: "Care plans tailored to the individual — no two patients, and no two livers, are exactly alike.",
    icon: UserRoundCog,
  },
  {
    title: "Patient-Centered Care",
    description: "Clear explanations, shared decisions and time for your questions at every visit.",
    icon: HandHeart,
  },
];

export function WhyChooseUs() {
  return (
    <section aria-labelledby="why-title" className="relative isolate overflow-hidden bg-navy-950 py-20 text-white sm:py-28">
      <div className="bg-grid absolute inset-0 -z-10 opacity-60 invert" aria-hidden />
      <div className="absolute -top-32 left-1/4 -z-10 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" aria-hidden />
      <div className="absolute -right-24 -bottom-32 -z-10 h-96 w-96 rounded-full bg-navy-500/30 blur-3xl" aria-hidden />

      <div className="container-page">
        <SectionHeading
          id="why-title"
          tone="dark"
          eyebrow="Why Choose HepatoCare"
          title="Care that combines specialist knowledge with genuine attention"
          description="A practice built around four commitments that guide every consultation."
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
