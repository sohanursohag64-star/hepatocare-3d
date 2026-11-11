import type { Metadata, Viewport } from "next";
import { localeHome, type Dict } from "@/i18n/dictionaries";
import { media, site } from "@/lib/site";
import { MotionProvider } from "./ui/MotionProvider";

export const viewport: Viewport = {
  themeColor: "#0d1838",
  width: "device-width",
  initialScale: 1,
};

/** Per-language metadata, with hreflang alternates linking the English and Bangla pages. */
export function buildMetadata(t: Dict): Metadata {
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.title, template: `%s | ${site.name}` },
    description: t.meta.description,
    keywords: [
      "hepatologist",
      "liver specialist",
      "fatty liver",
      "hepatitis B",
      "hepatitis C",
      "liver cirrhosis",
      "jaundice",
      "liver function test",
      "লিভার বিশেষজ্ঞ",
      "হেপাটোলজিস্ট",
      "ফ্যাটি লিভার",
    ],
    applicationName: site.name,
    alternates: {
      canonical: localeHome[t.locale],
      languages: { en: localeHome.en, bn: localeHome.bn, "x-default": localeHome.en },
    },
    openGraph: {
      type: "website",
      title: t.meta.ogTitle,
      description: t.meta.description,
      siteName: site.name,
      locale: t.locale === "bn" ? "bn_BD" : "en_GB",
      alternateLocale: t.locale === "bn" ? ["en_GB"] : ["bn_BD"],
      url: localeHome[t.locale],
      images: media.doctorPhoto ? [{ url: media.doctorPhoto, width: 1000, height: 1250, alt: t.doctor.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.ogTitle,
      description: t.meta.description,
      images: media.doctorPhoto ? [media.doctorPhoto] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

/** Shared <html>/<body> shell for each language's root layout. */
export function RootDocument({ t, fontClassName, children }: { t: Dict; fontClassName: string; children: React.ReactNode }) {
  return (
    <html lang={t.htmlLang} className={fontClassName}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-navy-900 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          {t.common.skipToContent}
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
