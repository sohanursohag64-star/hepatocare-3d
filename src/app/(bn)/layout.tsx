import { Hind_Siliguri, Noto_Serif_Bengali } from "next/font/google";
import { buildMetadata, RootDocument } from "@/components/RootDocument";
import { getDict } from "@/i18n/dictionaries";
import { fraunces, jakarta } from "../fonts";
import "../globals.css";

export { viewport } from "@/components/RootDocument";

/** Bengali fonts, loaded only on the Bangla page. */
const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bn-sans",
  display: "swap",
});

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali"],
  variable: "--font-bn-serif",
  display: "swap",
});

const t = getDict("bn");
export const metadata = buildMetadata(t);

export default function BanglaLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootDocument
      t={t}
      fontClassName={`${jakarta.variable} ${fraunces.variable} ${hind.variable} ${notoSerifBengali.variable}`}
    >
      {children}
    </RootDocument>
  );
}
