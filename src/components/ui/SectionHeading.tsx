import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  id,
}: SectionHeadingProps) {
  const centered = align === "center";
  const dark = tone === "dark";
  return (
    <Reveal className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p
        className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] ${
          dark ? "text-teal-300" : "text-teal-600"
        }`}
      >
        <span className={`h-px w-6 ${dark ? "bg-teal-300" : "bg-teal-500"}`} aria-hidden />
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`mt-4 text-balance font-display text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.75rem] ${
          dark ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${dark ? "text-navy-200" : "text-navy-600"}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
