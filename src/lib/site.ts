/**
 * Language-neutral site configuration.
 *
 * Text that appears on the page (names, addresses, hours…) lives in
 * src/i18n/dictionaries.ts so it can be shown in English and Bangla.
 * Details provided by the site owner.
 */

export const site = {
  name: "HepatoCare",
  /** Public URL of the site, used for canonical links and social previews. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hepatocare-3d.vercel.app",
};

export const contact = {
  phone: "+880 1770-951986",
  phoneHref: "tel:+8801770951986",
  email: "sohanurnil24@gmail.com",
  /**
   * WhatsApp number in international format, digits only (e.g. "8801XXXXXXXXX").
   * Leave empty to hide the floating WhatsApp button.
   */
  whatsapp: "",
};

/** Chamber schedule (used by the appointment form and search-engine data). */
export const schedule = {
  /** Days the chamber is closed, as JavaScript weekday numbers (0 = Sunday … 4 = Thursday). */
  closedWeekdays: [4],
  opens: "16:00",
  closes: "21:00",
  city: "Bogura",
  country: "BD",
};

export const media = {
  /**
   * Doctor's portrait, placed in /public (e.g. "/doctor.jpg").
   * Leave empty to show the illustrated placeholder.
   */
  doctorPhoto: "/doctor.jpg",
  /** Square face crop used for small avatars. */
  doctorAvatar: "/doctor-avatar.jpg",
  /**
   * Google Maps "Embed a map" URL (Share → Embed a map → copy the src="…" value).
   * Leave empty to show the illustrated map placeholder.
   */
  mapEmbedUrl: "",
  /** Link opened by "Open in Google Maps". */
  mapUrl: "https://www.google.com/maps",
};
