import { localeHome, type Dict } from "@/i18n/dictionaries";
import { contact, media, schedule, site } from "@/lib/site";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { About } from "./sections/About";
import { Appointment } from "./sections/Appointment";
import { Chamber } from "./sections/Chamber";
import { Faq } from "./sections/Faq";
import { Hero } from "./sections/Hero";
import { LiverStory } from "./sections/LiverStory";
import { PatientEducation } from "./sections/PatientEducation";
import { PatientJourney } from "./sections/PatientJourney";
import { Specialties } from "./sections/Specialties";
import { WhyChooseUs } from "./sections/WhyChooseUs";
import { WhatsAppButton } from "./WhatsAppButton";

/** The full homepage, rendered in the given language. */
export function HomePage({ t }: { t: Dict }) {
  const openDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].filter(
    (_, i) => !schedule.closedWeekdays.includes(i),
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: t.doctor.name,
    description: t.meta.description,
    url: new URL(localeHome[t.locale], site.url).toString(),
    telephone: contact.phone.replace(/[\s-]/g, ""),
    email: contact.email,
    medicalSpecialty: "Hepatology",
    ...(media.doctorPhoto ? { image: new URL(media.doctorPhoto, site.url).toString() } : {}),
    address: {
      "@type": "PostalAddress",
      name: t.chamber.name,
      addressLocality: schedule.city,
      addressCountry: schedule.country,
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: openDays, opens: schedule.opens, closes: schedule.closes },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- static, trusted JSON built from site config
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <Navbar t={t} />
      <main id="main">
        <Hero t={t} />
        <LiverStory t={t.story} numberLocale={t.numberLocale} />
        <About t={t} />
        <Specialties t={t.specialties} />
        <WhyChooseUs t={t.why} />
        <PatientEducation t={t.education} />
        <Faq t={t.faq} />
        <Chamber t={t.chamber} newTab={t.common.opensNewTab} />
        <PatientJourney t={t.journey} numberLocale={t.numberLocale} />
        <Appointment t={t} />
      </main>
      <Footer t={t} />
      <WhatsAppButton t={t.whatsapp} newTab={t.common.opensNewTab} />
    </>
  );
}
