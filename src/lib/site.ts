/**
 * Language-neutral site configuration.
 *
 * Text that appears on the page (names, addresses, hours…) lives in
 * src/i18n/dictionaries.ts so it can be shown in English and Bangla.
 * Everything here is a PLACEHOLDER until verified details are provided.
 */

export const site = {
  name: "HepatoCare",
  /** Public URL of the site, used for canonical links and social previews. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hepatocare-3d.vercel.app",
};

export const contact = {
  phone: "+00 0000 000 000",
  phoneHref: "tel:+000000000000",
  email: "appointments@example.com",
  /**
   * WhatsApp number in international format, digits only (e.g. "8801XXXXXXXXX").
   * Leave empty to hide the floating WhatsApp button.
   */
  whatsapp: "",
};

export const media = {
  /**
   * Doctor's portrait, placed in /public (e.g. "/doctor.jpg").
   * Leave empty to show the illustrated placeholder.
   */
  doctorPhoto: "",
  /**
   * Google Maps "Embed a map" URL (Share → Embed a map → copy the src="…" value).
   * Leave empty to show the illustrated map placeholder.
   */
  mapEmbedUrl: "",
  /** Link opened by "Open in Google Maps". */
  mapUrl: "https://www.google.com/maps",
};
