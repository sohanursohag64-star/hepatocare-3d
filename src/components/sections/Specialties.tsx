import { Activity, ArrowUpRight, Droplets, FlaskConical, Microscope, ShieldPlus, SunMedium, type LucideIcon } from "lucide-react";
import { RevealItem } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

type Specialty = { title: string; description: string; icon: LucideIcon };

const specialties: Specialty[] = [
  {
    title: "Fatty Liver Disease",
    description:
      "Assessment and ongoing follow-up for fat accumulation in the liver, including review of risk factors and test results.",
    icon: Droplets,
  },
  {
    title: "Hepatitis B & C",
    description:
      "Specialist evaluation, monitoring and long-term care planning for people living with viral hepatitis.",
    icon: ShieldPlus,
  },
  {
    title: "Liver Cirrhosis",
    description:
      "Structured, continuous care for advanced liver scarring, with regular review and coordinated follow-up.",
    icon: Microscope,
  },
  {
    title: "Jaundice",
    description:
      "Careful investigation of yellowing of the skin or eyes to help identify the underlying cause.",
    icon: SunMedium,
  },
  {
    title: "Liver Function Disorders",
    description:
      "Interpretation of abnormal liver function tests and a clear plan for any further evaluation needed.",
    icon: FlaskConical,
  },
  {
    title: "Other Liver Diseases",
    description:
      "Consultation for a wider range of liver and biliary conditions, including second-opinion reviews.",
    icon: Activity,
  },
];

export function Specialties() {
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
          eyebrow="Areas of Specialty"
          title="Focused expertise across the full spectrum of liver health"
          description="Consultations are available for common and complex liver conditions, from first assessment to long-term follow-up."
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {specialties.map((s, i) => (
            <RevealItem
              key={s.title}
              delay={0.06 * i}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white bg-white p-7 shadow-soft transition-[translate,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:border-teal-100 hover:shadow-lift"
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
                  aria-label={`Request a consultation for ${s.title}`}
                >
                  Request consultation
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </a>
            </RevealItem>
          ))}
        </ul>
      </div>
    </section>
  );
}
