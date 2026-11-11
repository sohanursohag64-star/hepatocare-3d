import type { Dict } from "@/i18n/dictionaries";
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
  return (
    <>
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
