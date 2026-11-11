/**
 * Central content configuration for the HepatoCare website.
 *
 * Every doctor, chamber and contact detail below is a PLACEHOLDER.
 * Replace the bracketed values with verified, real information before
 * publishing. Do not publish credentials or affiliations that have not
 * been confirmed by the doctor.
 */

export const site = {
  name: "HepatoCare",
  tagline: "Specialist Liver Care",
  description:
    "HepatoCare is the personal practice website of a Specialist Hepatologist offering expert, personalized consultation for liver health.",
};

export const doctor = {
  name: "Dr. [Doctor Name]",
  designation: "Consultant Hepatologist",
  credentials: "[Degree], [Postgraduate Qualification in Hepatology]",
  experienceYears: "[XX]+",
  qualifications: [
    { title: "[Medical Degree]", detail: "[Institution Name], [Year]" },
    { title: "[Postgraduate Degree – Medicine / Gastroenterology]", detail: "[Institution Name], [Year]" },
    { title: "[Fellowship / Specialist Training in Hepatology]", detail: "[Institution Name], [Year]" },
    { title: "[Professional Membership]", detail: "[Society / Association Name]" },
  ],
};

export const chamber = {
  name: "[Hospital / Chamber Name]",
  addressLines: ["[Building / Floor, Street Address]", "[Area, City, Postcode]"],
  hours: [
    { days: "[Saturday – Thursday]", time: "[5:00 PM – 9:00 PM]" },
    { days: "[Friday]", time: "[Closed]" },
  ],
  phone: "+00 0000 000 000",
  phoneHref: "tel:+000000000000",
  email: "appointments@example.com",
  mapUrl: "https://www.google.com/maps",
};

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About Doctor", href: "#about" },
  { label: "Specialties", href: "#specialties" },
  { label: "Patient Education", href: "#education" },
  { label: "Chamber", href: "#chamber" },
  { label: "Contact", href: "#contact" },
] as const;
