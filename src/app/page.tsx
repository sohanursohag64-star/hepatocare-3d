import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { About } from "@/components/sections/About";
import { Appointment } from "@/components/sections/Appointment";
import { Chamber } from "@/components/sections/Chamber";
import { Hero } from "@/components/sections/Hero";
import { PatientEducation } from "@/components/sections/PatientEducation";
import { Specialties } from "@/components/sections/Specialties";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Specialties />
        <WhyChooseUs />
        <PatientEducation />
        <Chamber />
        <Appointment />
      </main>
      <Footer />
    </>
  );
}
