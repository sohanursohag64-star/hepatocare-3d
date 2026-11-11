import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "light";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-glow hover:-translate-y-0.5 hover:from-teal-400 hover:to-teal-600 focus-visible:outline-teal-500",
  secondary:
    "border border-navy-200 bg-white text-navy-800 shadow-soft hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-700 focus-visible:outline-teal-500",
  ghost: "text-navy-700 hover:text-teal-600 px-0 py-2 focus-visible:outline-teal-500",
  light:
    "bg-white text-navy-900 shadow-lift hover:-translate-y-0.5 hover:bg-teal-50 focus-visible:outline-white",
};

export function buttonClasses(variant: Variant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "primary", className = "", ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}
