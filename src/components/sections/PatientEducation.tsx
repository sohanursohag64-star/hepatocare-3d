import { ArrowRight, Clock3, Droplets, FlaskConical, ScanHeart, type LucideIcon } from "lucide-react";
import { RevealItem } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

type Article = {
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  icon: LucideIcon;
  gradient: string;
};

/** Placeholder articles — full, medically reviewed content will be added in a later phase. */
const articles: Article[] = [
  {
    title: "Understanding Fatty Liver Disease",
    category: "Liver Basics",
    excerpt:
      "An introductory overview of what fatty liver disease is and why a specialist review can be helpful. [Placeholder article — content pending medical review.]",
    readTime: "5 min read",
    icon: Droplets,
    gradient: "from-teal-400 via-teal-500 to-teal-700",
  },
  {
    title: "Early Signs of Liver Problems",
    category: "Awareness",
    excerpt:
      "A general guide to symptoms people sometimes notice and when it may be worth speaking to a doctor. [Placeholder article — content pending medical review.]",
    readTime: "4 min read",
    icon: ScanHeart,
    gradient: "from-navy-500 via-navy-700 to-navy-900",
  },
  {
    title: "Importance of Liver Function Tests",
    category: "Diagnostics",
    excerpt:
      "What liver function tests are, and why results are best interpreted together with a clinician. [Placeholder article — content pending medical review.]",
    readTime: "6 min read",
    icon: FlaskConical,
    gradient: "from-teal-600 via-navy-700 to-navy-950",
  },
];

export function PatientEducation() {
  return (
    <section id="education" aria-labelledby="education-title" className="bg-white py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          id="education-title"
          eyebrow="Patient Education"
          title="Understand your liver, with confidence"
          description="Clear, accessible reading to help you prepare for your consultation. These resources are for general information and do not replace medical advice."
        />

        <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <RevealItem
              key={a.title}
              delay={0.08 * i}
              className="group flex flex-col overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-soft transition-[translate,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-lift"
            >
              <article className="flex h-full flex-col">
                <div className={`relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br ${a.gradient}`}>
                  <div className="bg-grid absolute inset-0 opacity-30 invert" aria-hidden />
                  <div
                    className="absolute h-56 w-56 rounded-full border border-white/20 transition-transform duration-700 group-hover:scale-110"
                    aria-hidden
                  />
                  <div
                    className="absolute h-36 w-36 rounded-full border border-white/25 transition-transform duration-700 group-hover:scale-125"
                    aria-hidden
                  />
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
                    <a.icon className="h-8 w-8" aria-hidden />
                  </span>
                  <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-navy-800">
                    {a.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-navy-400">
                    <Clock3 className="h-3.5 w-3.5" aria-hidden />
                    {a.readTime}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold text-navy-900 transition-colors group-hover:text-teal-700">
                    {a.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-600">{a.excerpt}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700">
                    Article coming soon
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </article>
            </RevealItem>
          ))}
        </ul>
      </div>
    </section>
  );
}
