/**
 * All user-facing copy, in English and Bangla.
 *
 * Doctor, chamber and contact details were provided by the site owner.
 * Keep English and Bangla in sync, and never add credentials or
 * affiliations that have not been confirmed.
 *
 * Strings may contain {tokens}; components fill them in with `fill()`.
 */

export const locales = ["en", "bn"] as const;
export type Locale = (typeof locales)[number];

export const localeHome: Record<Locale, string> = { en: "/", bn: "/bn" };

const en = {
  locale: "en" as Locale,
  htmlLang: "en",
  dateLocale: "en-GB",
  numberLocale: "en-GB",

  meta: {
    title: "Dr. Md Sohanur Rahman – Hepatologist in Bogura | HepatoCare",
    description:
      "HepatoCare is the practice website of Dr. Md Sohanur Rahman, MBBS, MD (Hepatology), Associate Professor with 20+ years of experience — consultations for liver conditions at X Diagnostic Centre, Bogura.",
    ogTitle: "Dr. Md Sohanur Rahman – Hepatologist | HepatoCare",
  },

  common: {
    skipToContent: "Skip to content",
    switchLanguage: "বাংলা",
    switchLanguageLabel: "বাংলায় দেখুন (View in Bangla)",
    readMore: "Read More",
    showLess: "Show Less",
    opensNewTab: "(opens in a new tab)",
  },

  nav: {
    links: [
      { label: "Home", href: "#home" },
      { label: "About Doctor", href: "#about" },
      { label: "Specialties", href: "#specialties" },
      { label: "Patient Education", href: "#education" },
      { label: "Chamber", href: "#chamber" },
      { label: "Contact", href: "#contact" },
    ],
    appointment: "Appointment",
    bookAppointment: "Book an Appointment",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    backToTop: "HepatoCare – back to top",
    primary: "Primary",
  },

  doctor: {
    name: "Dr. Md Sohanur Rahman",
    designation: "Associate Professor · Hepatologist",
    credentials: "MBBS, MD (Hepatology)",
    experienceYears: "20+",
    qualifications: [
      { title: "MBBS", detail: "Bachelor of Medicine, Bachelor of Surgery" },
      { title: "MD (Hepatology)", detail: "Doctor of Medicine in Hepatology" },
      { title: "Associate Professor", detail: "Academic appointment" },
      { title: "20+ years of experience", detail: "In clinical medicine and liver care" },
    ],
  },

  hero: {
    badge: "Specialist Liver Care",
    title1: "Your Liver Health,",
    title2: "Our Priority.",
    intro:
      "Expert evaluation and long-term care for liver conditions, delivered through unhurried, one-to-one consultations. Every plan is shaped around your history, your test results and your goals.",
    ctaPrimary: "Book an Appointment",
    ctaSecondary: "Explore the Liver Story",
    chip1Title: "Evidence-Based",
    chip1Text: "Clinical guidance",
    chip2Title: "Personalized Care",
    chip2Text: "One-to-one consultation",
  },

  liver3d: {
    modelLabel: "Interactive 3D model of the human liver. Use the arrow keys to rotate it.",
    hint: "Drag to rotate · Tap the dots to explore",
    showDescription: "{label}: show description",
    hotspots: [
      { id: "right-lobe", label: "Right Lobe", description: "The larger of the liver's two main anatomical lobes." },
      {
        id: "left-lobe",
        label: "Left Lobe",
        description: "The smaller lobe, extending toward the left side of the upper abdomen.",
      },
      { id: "gallbladder", label: "Gallbladder", description: "A small pouch beneath the liver that stores bile." },
    ],
  },

  story: {
    eyebrow: "The Liver Story",
    titleBefore: "Understanding the organ ",
    titleEm: "we care for",
    titleAfter: "",
    intro: "Scroll to see how common liver conditions can change the liver — an illustrated guide for patients.",
    disclaimer: "Illustrative visual · not a diagnostic image",
    cta: "Book a Consultation",
    steps: [
      {
        eyebrow: "The healthy liver",
        title: "Quietly working, around the clock",
        body: "A healthy liver is smooth and reddish-brown. It is one of the largest organs in the body and plays a part in digestion, metabolism and filtering the blood.",
      },
      {
        eyebrow: "Fatty liver",
        title: "When fat builds up in liver cells",
        body: "In fatty liver disease, fat accumulates within the liver. It is often first noticed on routine blood tests or imaging, and a specialist can help you understand what it means for you.",
      },
      {
        eyebrow: "Hepatitis",
        title: "Inflammation of the liver",
        body: "Hepatitis means inflammation of the liver. It has several possible causes, including viral infections such as hepatitis B and C.",
      },
      {
        eyebrow: "Cirrhosis",
        title: "Long-term scarring",
        body: "Over time, ongoing liver injury can lead to scarring. A cirrhotic liver may become firmer and more uneven, which is why regular specialist follow-up matters.",
      },
      {
        eyebrow: "Specialist care",
        title: "Your liver, in caring hands",
        body: "Every liver story is different. Good care starts with a careful conversation, a thorough review of your reports and a plan made together with you.",
      },
    ],
  },

  about: {
    eyebrow: "About the Doctor",
    titleBefore: "Thoughtful, specialist care for ",
    titleEm: "every liver",
    titleAfter: ".",
    intro:
      "{name} (MBBS, MD in Hepatology) is an Associate Professor and hepatologist with more than 20 years of experience. The practice focuses on the diagnosis and long-term management of liver conditions, with unhurried consultations and clear explanations.",
    portraitPlaceholder: "Portrait placeholder",
    portraitAlt: "Portrait of {name}",
    yearsOf: "Years of",
    experience: "Experience",
    philosophyLabel: "Consultation philosophy",
    philosophy:
      "“Every patient deserves time, a clear explanation and a plan they understand. Good care begins with listening.”",
    highlights: [
      { value: "{years}", label: "Years of clinical experience" },
      { value: "1:1", label: "Dedicated consultations" },
      { value: "360°", label: "Review of history & reports" },
    ],
    /** Extra biography paragraphs shown under "Read More" — add verified details here. */
    more: [] as string[],
  },

  specialties: {
    eyebrow: "Areas of Specialty",
    title: "Focused expertise across the full spectrum of liver health",
    description:
      "Consultations are available for common and complex liver conditions, from first assessment to long-term follow-up.",
    cta: "Request consultation",
    ctaAria: "Request a consultation for {title}",
    items: [
      {
        title: "Fatty Liver Disease",
        description:
          "Assessment and ongoing follow-up for fat accumulation in the liver, including review of risk factors and test results.",
      },
      {
        title: "Hepatitis B & C",
        description: "Specialist evaluation, monitoring and long-term care planning for people living with viral hepatitis.",
      },
      {
        title: "Liver Cirrhosis",
        description: "Structured, continuous care for advanced liver scarring, with regular review and coordinated follow-up.",
      },
      {
        title: "Jaundice",
        description: "Careful investigation of yellowing of the skin or eyes to help identify the underlying cause.",
      },
      {
        title: "Liver Function Disorders",
        description: "Interpretation of abnormal liver function tests and a clear plan for any further evaluation needed.",
      },
      {
        title: "Other Liver Diseases",
        description: "Consultation for a wider range of liver and biliary conditions, including second-opinion reviews.",
      },
    ],
  },

  why: {
    eyebrow: "Why Choose HepatoCare",
    title: "Care that combines specialist knowledge with genuine attention",
    description: "A practice built around four commitments that guide every consultation.",
    items: [
      {
        title: "Specialist Consultation",
        description: "Direct consultation with a liver specialist who reviews your concerns, history and reports in detail.",
      },
      {
        title: "Evidence-Based Medical Care",
        description: "Clinical decisions guided by current, recognised medical evidence and professional guidelines.",
      },
      {
        title: "Personalized Treatment Approach",
        description: "Care plans tailored to the individual — no two patients, and no two livers, are exactly alike.",
      },
      {
        title: "Patient-Centered Care",
        description: "Clear explanations, shared decisions and time for your questions at every visit.",
      },
    ],
  },

  education: {
    eyebrow: "Patient Education",
    title: "Understand your liver, with confidence",
    description:
      "Clear, accessible reading to help you prepare for your consultation. These resources are for general information and do not replace medical advice.",
    comingSoon: "Article coming soon",
    articles: [
      {
        title: "Understanding Fatty Liver Disease",
        category: "Liver Basics",
        excerpt:
          "An introductory overview of what fatty liver disease is and why a specialist review can be helpful.",
        readTime: "5 min read",
      },
      {
        title: "Early Signs of Liver Problems",
        category: "Awareness",
        excerpt:
          "A general guide to symptoms people sometimes notice and when it may be worth speaking to a doctor.",
        readTime: "4 min read",
      },
      {
        title: "Importance of Liver Function Tests",
        category: "Diagnostics",
        excerpt:
          "What liver function tests are, and why results are best interpreted together with a clinician.",
        readTime: "6 min read",
      },
    ],
  },

  journey: {
    eyebrow: "Your Visit",
    title: "What your visit looks like",
    description: "From arrival to heading home — a simple, friendly picture of a consultation at the chamber.",
    play: "Play animation",
    pause: "Pause animation",
    goToStep: "Show step {n}: {title}",
    sceneLabel: "Animated illustration: a patient drives to the chamber, checks in at reception, meets the doctor, and leaves reassured with a care plan.",
    clinicDoor: "Chamber",
    doctorDoor: "Doctor",
    reception: "Reception",
    steps: [
      { title: "Arrive at the chamber", text: "Come at your confirmed time, with your previous reports and prescriptions." },
      { title: "Quick check-in", text: "The front desk confirms your details and shows you to the doctor's room." },
      { title: "An unhurried consultation", text: "The doctor listens, reviews your reports and explains things clearly." },
      { title: "Leave with a clear plan", text: "Head home reassured, with written next steps you understand." },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    title: "Questions patients often ask",
    description: "Practical answers to help you plan your visit. For anything about your own health, please speak with the doctor.",
    items: [
      {
        q: "How do I book an appointment?",
        a: "Call the chamber during visiting hours, or send a request using the appointment form on this page. The chamber will contact you to confirm a time.",
      },
      {
        q: "What should I bring to my first consultation?",
        a: "Please bring any previous prescriptions, a list of the medicines you currently take, and recent test reports or imaging (for example, blood test or ultrasound reports). Keeping them together in one folder helps make the most of your visit.",
      },
      {
        q: "Can a family member come with me?",
        a: "Many patients find it helpful to bring a family member or carer to listen and take notes.",
      },
      {
        q: "Is the online form a confirmed booking?",
        a: "No. The form is a request only. Your appointment is confirmed only after the chamber has contacted you.",
      },
      {
        q: "What should I do in an emergency?",
        a: "This website is not for emergencies. If you have a medical emergency, contact your local emergency services or go to the nearest hospital emergency department immediately.",
      },
    ],
  },

  chamber: {
    eyebrow: "Chamber Information",
    title: "Visit the chamber",
    description: "Consultations are by appointment. Please call ahead or send an appointment request below.",
    name: "X Diagnostic Centre",
    addressLines: ["Bogura, Bangladesh"],
    hours: [
      { days: "Every day except Thursday", time: "4:00 PM – 9:00 PM" },
      { days: "Thursday", time: "Closed" },
    ],
    visitingHours: "Visiting Hours",
    appointments: "Appointments",
    callDuring: "Call during visiting hours",
    mapPlaceholder: "Map placeholder · location to be added",
    mapTitle: "Map showing the chamber location",
    openMaps: "Open in Google Maps",
  },

  appointment: {
    eyebrow: "Appointments",
    titleBefore: "Take the first step towards ",
    titleEm: "better liver health",
    titleAfter: ".",
    description: "Request a consultation at a time that suits you. The chamber will get back to you to confirm availability.",
    steps: [
      { title: "Send a request", text: "Share your name, phone number and preferred time." },
      { title: "Chamber follow-up", text: "The chamber reviews availability for your preferred slot." },
      { title: "Confirmed visit", text: "Your visit is confirmed only once the chamber has confirmed it with you." },
    ],
  },

  form: {
    title: "Request an appointment",
    allRequired: "All fields are required.",
    name: "Patient Name",
    namePlaceholder: "Full name",
    phone: "Phone Number",
    date: "Preferred Date",
    time: "Preferred Time",
    selectTime: "Select a time",
    timeSlots: ["4:00 PM – 5:30 PM", "5:30 PM – 7:00 PM", "7:00 PM – 9:00 PM"],
    submit: "Submit Request",
    sending: "Sending request…",
    disclaimer:
      "Submitting this form sends a request only — it does not confirm an appointment. For medical emergencies, contact your local emergency services immediately.",
    errors: {
      nameRequired: "Please enter the patient's name.",
      nameShort: "Name should be at least 2 characters.",
      nameInvalid: "Name can contain letters, spaces, apostrophes and hyphens only.",
      phoneRequired: "Please enter a phone number.",
      phoneInvalid: "Please enter a valid phone number (7–15 digits).",
      dateRequired: "Please choose a preferred date.",
      datePast: "Please choose today or a future date.",
      dateClosed: "The chamber is closed on Thursdays. Please choose another day.",
      timeRequired: "Please choose a preferred time.",
    },
    successTitle: "Request received",
    successBody: "Thank you, {name}. Your appointment request for {date}, {time}, has been noted.",
    noteLabel: "Please note:",
    note: "this is a request only and your appointment is {nc}. Confirmation is subject to availability — please contact the chamber to confirm your visit.",
    notConfirmed: "not yet confirmed",
    another: "Make another request",
  },

  footer: {
    srTitle: "Contact and site information",
    quickLinks: "Quick Links",
    contact: "Contact",
    bookLink: "Book Appointment",
    faqLink: "FAQ",
    social: "Social media",
    linkSoon: "{label} (link coming soon)",
    rights: "All rights reserved.",
    disclaimer: "Information on this website is general and does not replace a medical consultation.",
    backToTop: "Back to top",
  },

  whatsapp: {
    label: "Chat on WhatsApp",
    message: "Hello, I would like to request an appointment.",
  },
};

export type Dict = typeof en;

const bn: Dict = {
  locale: "bn",
  htmlLang: "bn",
  dateLocale: "bn-BD",
  numberLocale: "bn-BD",

  meta: {
    title: "ডা. মো. সোহানুর রহমান – বগুড়ায় লিভার বিশেষজ্ঞ (হেপাটোলজিস্ট) | হেপাটোকেয়ার",
    description:
      "হেপাটোকেয়ার ডা. মো. সোহানুর রহমানের ওয়েবসাইট — এমবিবিএস, এমডি (হেপাটোলজি), সহযোগী অধ্যাপক, ২০+ বছরের অভিজ্ঞতা। এক্স ডায়াগনস্টিক সেন্টার, বগুড়ায় লিভারের রোগের পরামর্শ।",
    ogTitle: "ডা. মো. সোহানুর রহমান – লিভার বিশেষজ্ঞ | হেপাটোকেয়ার",
  },

  common: {
    skipToContent: "মূল অংশে যান",
    switchLanguage: "English",
    switchLanguageLabel: "View in English (ইংরেজিতে দেখুন)",
    readMore: "আরও পড়ুন",
    showLess: "কম দেখান",
    opensNewTab: "(নতুন ট্যাবে খুলবে)",
  },

  nav: {
    links: [
      { label: "হোম", href: "#home" },
      { label: "ডাক্তার পরিচিতি", href: "#about" },
      { label: "বিশেষত্ব", href: "#specialties" },
      { label: "রোগী শিক্ষা", href: "#education" },
      { label: "চেম্বার", href: "#chamber" },
      { label: "যোগাযোগ", href: "#contact" },
    ],
    appointment: "অ্যাপয়েন্টমেন্ট",
    bookAppointment: "অ্যাপয়েন্টমেন্ট নিন",
    openMenu: "মেনু খুলুন",
    closeMenu: "মেনু বন্ধ করুন",
    backToTop: "হেপাটোকেয়ার – উপরে ফিরে যান",
    primary: "প্রধান",
  },

  doctor: {
    name: "ডা. মো. সোহানুর রহমান",
    designation: "সহযোগী অধ্যাপক · হেপাটোলজিস্ট",
    credentials: "এমবিবিএস, এমডি (হেপাটোলজি)",
    experienceYears: "২০+",
    qualifications: [
      { title: "এমবিবিএস", detail: "ব্যাচেলর অব মেডিসিন অ্যান্ড ব্যাচেলর অব সার্জারি" },
      { title: "এমডি (হেপাটোলজি)", detail: "হেপাটোলজিতে ডক্টর অব মেডিসিন" },
      { title: "সহযোগী অধ্যাপক", detail: "শিক্ষকতার পদ" },
      { title: "২০+ বছরের অভিজ্ঞতা", detail: "চিকিৎসা ও লিভার রোগের যত্নে" },
    ],
  },

  hero: {
    badge: "বিশেষজ্ঞ লিভার চিকিৎসা",
    title1: "আপনার লিভারের সুস্থতা,",
    title2: "আমাদের অগ্রাধিকার।",
    intro:
      "লিভারের রোগের বিশেষজ্ঞ মূল্যায়ন ও দীর্ঘমেয়াদি চিকিৎসা — সময় নিয়ে, একান্ত পরামর্শের মাধ্যমে। আপনার ইতিহাস, পরীক্ষার ফলাফল ও লক্ষ্য অনুযায়ী প্রতিটি পরিকল্পনা তৈরি হয়।",
    ctaPrimary: "অ্যাপয়েন্টমেন্ট নিন",
    ctaSecondary: "লিভারের গল্প দেখুন",
    chip1Title: "প্রমাণভিত্তিক",
    chip1Text: "চিকিৎসা নির্দেশনা",
    chip2Title: "ব্যক্তিগত যত্ন",
    chip2Text: "একান্ত পরামর্শ",
  },

  liver3d: {
    modelLabel: "মানব লিভারের ইন্টারঅ্যাকটিভ 3D মডেল। ঘোরাতে অ্যারো কী ব্যবহার করুন।",
    hint: "ঘোরাতে টানুন · জানতে বিন্দুতে চাপুন",
    showDescription: "{label}: বিবরণ দেখুন",
    hotspots: [
      { id: "right-lobe", label: "ডান লোব", description: "লিভারের দুটি প্রধান লোবের মধ্যে বড়টি।" },
      { id: "left-lobe", label: "বাম লোব", description: "ছোট লোবটি, যা পেটের উপরের অংশের বাম দিকে বিস্তৃত।" },
      { id: "gallbladder", label: "পিত্তথলি", description: "লিভারের নিচের ছোট একটি থলি, যেখানে পিত্তরস জমা থাকে।" },
    ],
  },

  story: {
    eyebrow: "লিভারের গল্প",
    titleBefore: "যে অঙ্গের ",
    titleEm: "যত্ন নিই",
    titleAfter: ", তাকে জানুন",
    intro: "স্ক্রল করে দেখুন, সাধারণ কিছু লিভারের রোগে লিভার কীভাবে বদলাতে পারে — রোগীদের জন্য একটি চিত্রিত নির্দেশিকা।",
    disclaimer: "শিক্ষামূলক চিত্র · রোগনির্ণয়ের ছবি নয়",
    cta: "পরামর্শের সময় নিন",
    steps: [
      {
        eyebrow: "সুস্থ লিভার",
        title: "নীরবে কাজ করে চলেছে, দিনরাত",
        body: "সুস্থ লিভার মসৃণ ও লালচে-বাদামি রঙের। এটি শরীরের সবচেয়ে বড় অঙ্গগুলোর একটি, যা হজম, বিপাক ও রক্ত পরিশোধনে ভূমিকা রাখে।",
      },
      {
        eyebrow: "ফ্যাটি লিভার",
        title: "যখন লিভারের কোষে চর্বি জমে",
        body: "ফ্যাটি লিভার রোগে লিভারের ভেতরে চর্বি জমা হয়। প্রায়ই সাধারণ রক্ত পরীক্ষা বা আল্ট্রাসনোগ্রামের মতো পরীক্ষায় এটি প্রথম ধরা পড়ে। আপনার জন্য এর অর্থ কী, তা বুঝতে একজন বিশেষজ্ঞ সাহায্য করতে পারেন।",
      },
      {
        eyebrow: "হেপাটাইটিস",
        title: "লিভারের প্রদাহ",
        body: "হেপাটাইটিস মানে লিভারের প্রদাহ। এর নানা কারণ থাকতে পারে, যার মধ্যে হেপাটাইটিস বি ও সি-এর মতো ভাইরাল সংক্রমণ অন্যতম।",
      },
      {
        eyebrow: "সিরোসিস",
        title: "দীর্ঘমেয়াদি ক্ষত",
        body: "দীর্ঘদিন ধরে লিভারের ক্ষতি চলতে থাকলে লিভারে ক্ষতচিহ্ন (স্কার) তৈরি হতে পারে। সিরোসিসে লিভার আরও শক্ত ও অসমান হয়ে যেতে পারে — তাই নিয়মিত বিশেষজ্ঞের ফলো-আপ গুরুত্বপূর্ণ।",
      },
      {
        eyebrow: "বিশেষজ্ঞ যত্ন",
        title: "যত্নের হাতে আপনার লিভার",
        body: "প্রতিটি লিভারের গল্প আলাদা। ভালো চিকিৎসা শুরু হয় মনোযোগী আলাপ, রিপোর্টের পূর্ণ পর্যালোচনা আর আপনার সঙ্গে মিলে তৈরি একটি পরিকল্পনা দিয়ে।",
      },
    ],
  },

  about: {
    eyebrow: "ডাক্তার পরিচিতি",
    titleBefore: "প্রতিটি লিভারের জন্য ",
    titleEm: "যত্নশীল বিশেষজ্ঞ",
    titleAfter: " চিকিৎসা।",
    intro:
      "{name} (এমবিবিএস, এমডি – হেপাটোলজি) একজন সহযোগী অধ্যাপক ও হেপাটোলজিস্ট, যাঁর ২০ বছরেরও বেশি অভিজ্ঞতা রয়েছে। লিভারের রোগ নির্ণয় ও দীর্ঘমেয়াদি চিকিৎসাই তাঁর মূল কাজের ক্ষেত্র — সময় নিয়ে পরামর্শ ও স্পষ্ট ব্যাখ্যার মাধ্যমে।",
    portraitPlaceholder: "ছবির জায়গা",
    portraitAlt: "{name}-এর ছবি",
    yearsOf: "বছরের",
    experience: "অভিজ্ঞতা",
    philosophyLabel: "চিকিৎসা দর্শন",
    philosophy:
      "“প্রত্যেক রোগীর প্রাপ্য সময়, স্পষ্ট ব্যাখ্যা আর এমন একটি পরিকল্পনা যা তিনি বোঝেন। ভালো চিকিৎসা শুরু হয় মনোযোগ দিয়ে শোনার মাধ্যমে।”",
    highlights: [
      { value: "{years}", label: "বছরের চিকিৎসা অভিজ্ঞতা" },
      { value: "১:১", label: "একান্ত পরামর্শ" },
      { value: "৩৬০°", label: "ইতিহাস ও রিপোর্টের পূর্ণ পর্যালোচনা" },
    ],
    more: [],
  },

  specialties: {
    eyebrow: "বিশেষত্বের ক্ষেত্র",
    title: "লিভারের সব ধরনের সমস্যায় মনোযোগী দক্ষতা",
    description: "সাধারণ থেকে জটিল লিভারের রোগে পরামর্শ — প্রথম মূল্যায়ন থেকে দীর্ঘমেয়াদি ফলো-আপ পর্যন্ত।",
    cta: "পরামর্শের অনুরোধ করুন",
    ctaAria: "{title} — পরামর্শের অনুরোধ করুন",
    items: [
      {
        title: "ফ্যাটি লিভার রোগ",
        description: "লিভারে চর্বি জমার মূল্যায়ন ও নিয়মিত ফলো-আপ, ঝুঁকির কারণ ও পরীক্ষার ফলাফলের পর্যালোচনাসহ।",
      },
      {
        title: "হেপাটাইটিস বি ও সি",
        description: "ভাইরাল হেপাটাইটিসে আক্রান্তদের জন্য বিশেষজ্ঞ মূল্যায়ন, পর্যবেক্ষণ ও দীর্ঘমেয়াদি চিকিৎসা পরিকল্পনা।",
      },
      {
        title: "লিভার সিরোসিস",
        description: "লিভারের দীর্ঘমেয়াদি ক্ষতের জন্য নিয়মিত পর্যালোচনা ও সমন্বিত ফলো-আপসহ ধারাবাহিক যত্ন।",
      },
      {
        title: "জন্ডিস",
        description: "ত্বক বা চোখ হলুদ হওয়ার মূল কারণ খুঁজে বের করতে যত্নশীল পরীক্ষা-নিরীক্ষা।",
      },
      {
        title: "লিভার ফাংশনের সমস্যা",
        description: "অস্বাভাবিক লিভার ফাংশন টেস্টের ব্যাখ্যা এবং প্রয়োজনীয় পরবর্তী পরীক্ষার স্পষ্ট পরিকল্পনা।",
      },
      {
        title: "অন্যান্য লিভারের রোগ",
        description: "লিভার ও পিত্তনালীর আরও নানা সমস্যায় পরামর্শ, দ্বিতীয় মতামতসহ।",
      },
    ],
  },

  why: {
    eyebrow: "কেন হেপাটোকেয়ার",
    title: "বিশেষজ্ঞ জ্ঞান আর আন্তরিক মনোযোগের মেলবন্ধন",
    description: "চারটি অঙ্গীকার, যা প্রতিটি পরামর্শকে পথ দেখায়।",
    items: [
      {
        title: "বিশেষজ্ঞ পরামর্শ",
        description: "একজন লিভার বিশেষজ্ঞের সঙ্গে সরাসরি পরামর্শ, যিনি আপনার সমস্যা, ইতিহাস ও রিপোর্ট বিস্তারিতভাবে দেখেন।",
      },
      {
        title: "প্রমাণভিত্তিক চিকিৎসা",
        description: "সাম্প্রতিক ও স্বীকৃত চিকিৎসা-প্রমাণ এবং পেশাগত নির্দেশিকা অনুযায়ী চিকিৎসার সিদ্ধান্ত।",
      },
      {
        title: "ব্যক্তিভিত্তিক চিকিৎসা পরিকল্পনা",
        description: "প্রতিটি মানুষের জন্য আলাদা পরিকল্পনা — কোনো দুজন রোগী, কোনো দুটি লিভার একরকম নয়।",
      },
      {
        title: "রোগীকেন্দ্রিক যত্ন",
        description: "প্রতিটি ভিজিটে স্পষ্ট ব্যাখ্যা, যৌথ সিদ্ধান্ত আর আপনার প্রশ্নের জন্য পর্যাপ্ত সময়।",
      },
    ],
  },

  education: {
    eyebrow: "রোগী শিক্ষা",
    title: "নিজের লিভারকে জানুন, আত্মবিশ্বাসের সঙ্গে",
    description:
      "পরামর্শের আগে প্রস্তুতির জন্য সহজ ও স্পষ্ট লেখা। এগুলো সাধারণ তথ্যের জন্য, চিকিৎসকের পরামর্শের বিকল্প নয়।",
    comingSoon: "লেখাটি শিগগিরই আসছে",
    articles: [
      {
        title: "ফ্যাটি লিভার রোগ বোঝা",
        category: "লিভারের মৌলিক বিষয়",
        excerpt:
          "ফ্যাটি লিভার রোগ কী, এবং কেন বিশেষজ্ঞের পর্যালোচনা সহায়ক হতে পারে — একটি প্রাথমিক ধারণা।",
        readTime: "৫ মিনিটে পড়ুন",
      },
      {
        title: "লিভারের সমস্যার প্রাথমিক লক্ষণ",
        category: "সচেতনতা",
        excerpt:
          "যেসব উপসর্গ মানুষ কখনো কখনো লক্ষ করেন, এবং কখন ডাক্তারের সঙ্গে কথা বলা উচিত — একটি সাধারণ নির্দেশিকা।",
        readTime: "৪ মিনিটে পড়ুন",
      },
      {
        title: "লিভার ফাংশন টেস্টের গুরুত্ব",
        category: "পরীক্ষা-নিরীক্ষা",
        excerpt:
          "লিভার ফাংশন টেস্ট কী, এবং কেন এর ফলাফল চিকিৎসকের সঙ্গে মিলিয়ে দেখা ভালো।",
        readTime: "৬ মিনিটে পড়ুন",
      },
    ],
  },

  journey: {
    eyebrow: "আপনার ভিজিট",
    title: "আপনার ভিজিট যেভাবে হয়",
    description: "পৌঁছানো থেকে বাড়ি ফেরা পর্যন্ত — চেম্বারে একটি পরামর্শের সহজ ও বন্ধুত্বপূর্ণ চিত্র।",
    play: "অ্যানিমেশন চালান",
    pause: "অ্যানিমেশন থামান",
    goToStep: "ধাপ {n} দেখুন: {title}",
    sceneLabel: "অ্যানিমেটেড চিত্র: একজন রোগী গাড়িতে চেম্বারে আসেন, রিসেপশনে নাম লেখান, ডাক্তারের সঙ্গে দেখা করেন এবং চিকিৎসা পরিকল্পনা নিয়ে নিশ্চিন্ত মনে ফিরে যান।",
    clinicDoor: "চেম্বার",
    doctorDoor: "ডাক্তার",
    reception: "রিসেপশন",
    steps: [
      { title: "চেম্বারে পৌঁছানো", text: "নিশ্চিত করা সময়ে আসুন, সঙ্গে আগের রিপোর্ট ও প্রেসক্রিপশন আনুন।" },
      { title: "সহজ রেজিস্ট্রেশন", text: "রিসেপশন আপনার তথ্য নিশ্চিত করে ডাক্তারের রুমে পৌঁছে দেবে।" },
      { title: "সময় নিয়ে পরামর্শ", text: "ডাক্তার মন দিয়ে শোনেন, রিপোর্ট দেখেন এবং সবকিছু স্পষ্টভাবে বুঝিয়ে বলেন।" },
      { title: "স্পষ্ট পরিকল্পনা নিয়ে ফেরা", text: "পরবর্তী করণীয় লিখিতভাবে বুঝে নিয়ে নিশ্চিন্ত মনে বাড়ি ফিরুন।" },
    ],
  },

  faq: {
    eyebrow: "সাধারণ প্রশ্ন",
    title: "রোগীরা প্রায়ই যা জানতে চান",
    description: "ভিজিটের পরিকল্পনায় সহায়ক কিছু ব্যবহারিক উত্তর। আপনার নিজের স্বাস্থ্য নিয়ে যেকোনো প্রশ্ন ডাক্তারের সঙ্গে আলোচনা করুন।",
    items: [
      {
        q: "কীভাবে অ্যাপয়েন্টমেন্ট নেব?",
        a: "সাক্ষাতের সময়ে চেম্বারে ফোন করুন, অথবা এই পেজের অ্যাপয়েন্টমেন্ট ফর্ম দিয়ে অনুরোধ পাঠান। সময় নিশ্চিত করতে চেম্বার থেকে আপনার সঙ্গে যোগাযোগ করা হবে।",
      },
      {
        q: "প্রথম পরামর্শে কী কী সঙ্গে আনব?",
        a: "আগের প্রেসক্রিপশন, এখন যেসব ওষুধ খাচ্ছেন তার তালিকা, এবং সাম্প্রতিক পরীক্ষার রিপোর্ট বা ইমেজিং (যেমন রক্ত পরীক্ষা বা আল্ট্রাসনোগ্রামের রিপোর্ট) সঙ্গে আনুন। সব কাগজ একটি ফাইলে গুছিয়ে রাখলে ভিজিট আরও ফলপ্রসূ হয়।",
      },
      {
        q: "পরিবারের কেউ কি সঙ্গে আসতে পারবেন?",
        a: "অনেক রোগী পরিবারের কাউকে বা সেবাদানকারীকে সঙ্গে আনতে সুবিধা পান — তিনি শুনতে ও নোট নিতে সাহায্য করতে পারেন।",
      },
      {
        q: "অনলাইন ফর্ম কি নিশ্চিত বুকিং?",
        a: "না। ফর্মটি শুধু একটি অনুরোধ। চেম্বার আপনার সঙ্গে যোগাযোগ করার পরই অ্যাপয়েন্টমেন্ট নিশ্চিত হয়।",
      },
      {
        q: "জরুরি অবস্থায় কী করব?",
        a: "এই ওয়েবসাইট জরুরি চিকিৎসার জন্য নয়। জরুরি অবস্থায় অবিলম্বে স্থানীয় জরুরি সেবায় যোগাযোগ করুন অথবা নিকটতম হাসপাতালের জরুরি বিভাগে যান।",
      },
    ],
  },

  chamber: {
    eyebrow: "চেম্বারের তথ্য",
    title: "চেম্বারে আসুন",
    description: "শুধু অ্যাপয়েন্টমেন্টের মাধ্যমে পরামর্শ দেওয়া হয়। আগে ফোন করুন অথবা নিচে অ্যাপয়েন্টমেন্টের অনুরোধ পাঠান।",
    name: "এক্স ডায়াগনস্টিক সেন্টার",
    addressLines: ["বগুড়া, বাংলাদেশ"],
    hours: [
      { days: "বৃহস্পতিবার ছাড়া প্রতিদিন", time: "বিকেল ৪:০০ – রাত ৯:০০" },
      { days: "বৃহস্পতিবার", time: "বন্ধ" },
    ],
    visitingHours: "সাক্ষাতের সময়",
    appointments: "অ্যাপয়েন্টমেন্ট",
    callDuring: "সাক্ষাতের সময়ে ফোন করুন",
    mapPlaceholder: "ম্যাপের জায়গা · অবস্থান যোগ করা হবে",
    mapTitle: "চেম্বারের অবস্থান দেখানো ম্যাপ",
    openMaps: "Google Maps-এ খুলুন",
  },

  appointment: {
    eyebrow: "অ্যাপয়েন্টমেন্ট",
    titleBefore: "সুস্থ লিভারের পথে ",
    titleEm: "প্রথম পদক্ষেপ",
    titleAfter: " নিন।",
    description: "আপনার সুবিধামতো সময়ে পরামর্শের অনুরোধ করুন। সময় নিশ্চিত করতে চেম্বার থেকে আপনার সঙ্গে যোগাযোগ করা হবে।",
    steps: [
      { title: "অনুরোধ পাঠান", text: "আপনার নাম, ফোন নম্বর ও পছন্দের সময় জানান।" },
      { title: "চেম্বারের ফলো-আপ", text: "আপনার পছন্দের সময়ে সিরিয়াল আছে কিনা, চেম্বার তা দেখবে।" },
      { title: "নিশ্চিত ভিজিট", text: "চেম্বার আপনার সঙ্গে নিশ্চিত করার পরই আপনার ভিজিট নিশ্চিত হবে।" },
    ],
  },

  form: {
    title: "অ্যাপয়েন্টমেন্টের অনুরোধ",
    allRequired: "সব ঘর পূরণ করা আবশ্যক।",
    name: "রোগীর নাম",
    namePlaceholder: "পূর্ণ নাম",
    phone: "ফোন নম্বর",
    date: "পছন্দের তারিখ",
    time: "পছন্দের সময়",
    selectTime: "সময় বেছে নিন",
    timeSlots: ["বিকেল ৪:০০ – ৫:৩০", "বিকেল ৫:৩০ – সন্ধ্যা ৭:০০", "সন্ধ্যা ৭:০০ – রাত ৯:০০"],
    submit: "অনুরোধ পাঠান",
    sending: "অনুরোধ পাঠানো হচ্ছে…",
    disclaimer:
      "এই ফর্ম জমা দিলে শুধু একটি অনুরোধ পাঠানো হয় — এতে অ্যাপয়েন্টমেন্ট নিশ্চিত হয় না। জরুরি চিকিৎসার প্রয়োজনে অবিলম্বে স্থানীয় জরুরি সেবায় যোগাযোগ করুন।",
    errors: {
      nameRequired: "রোগীর নাম লিখুন।",
      nameShort: "নাম অন্তত ২ অক্ষরের হতে হবে।",
      nameInvalid: "নামে শুধু অক্ষর, স্পেস, অ্যাপোস্ট্রফি ও হাইফেন ব্যবহার করা যাবে।",
      phoneRequired: "ফোন নম্বর লিখুন।",
      phoneInvalid: "সঠিক ফোন নম্বর লিখুন (৭–১৫ অঙ্ক)।",
      dateRequired: "পছন্দের তারিখ বেছে নিন।",
      datePast: "আজকের বা পরের কোনো তারিখ বেছে নিন।",
      dateClosed: "বৃহস্পতিবার চেম্বার বন্ধ থাকে। অন্য একটি দিন বেছে নিন।",
      timeRequired: "পছন্দের সময় বেছে নিন।",
    },
    successTitle: "অনুরোধ পাওয়া গেছে",
    successBody: "ধন্যবাদ, {name}। {date}, {time}-এর জন্য আপনার অ্যাপয়েন্টমেন্টের অনুরোধ নথিভুক্ত হয়েছে।",
    noteLabel: "দয়া করে মনে রাখবেন:",
    note: "এটি শুধু একটি অনুরোধ, আপনার অ্যাপয়েন্টমেন্ট {nc}। সিরিয়াল পাওয়া সাপেক্ষে নিশ্চিত করা হবে — ভিজিট নিশ্চিত করতে চেম্বারে যোগাযোগ করুন।",
    notConfirmed: "এখনো নিশ্চিত হয়নি",
    another: "আরেকটি অনুরোধ করুন",
  },

  footer: {
    srTitle: "যোগাযোগ ও সাইটের তথ্য",
    quickLinks: "দ্রুত লিংক",
    contact: "যোগাযোগ",
    bookLink: "অ্যাপয়েন্টমেন্ট নিন",
    faqLink: "সাধারণ প্রশ্ন",
    social: "সামাজিক মাধ্যম",
    linkSoon: "{label} (লিংক শিগগিরই আসছে)",
    rights: "সর্বস্বত্ব সংরক্ষিত।",
    disclaimer: "এই ওয়েবসাইটের তথ্য সাধারণ জ্ঞানের জন্য, এটি চিকিৎসকের পরামর্শের বিকল্প নয়।",
    backToTop: "উপরে ফিরে যান",
  },

  whatsapp: {
    label: "WhatsApp-এ কথা বলুন",
    message: "হ্যালো, আমি একটি অ্যাপয়েন্টমেন্টের অনুরোধ করতে চাই।",
  },
};

export const dictionaries: Record<Locale, Dict> = { en, bn };

export function getDict(locale: Locale): Dict {
  return dictionaries[locale];
}

/** Replace {tokens} in a string. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (m, key: string) => values[key] ?? m);
}
