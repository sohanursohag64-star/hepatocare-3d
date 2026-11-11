import { buildMetadata, RootDocument } from "@/components/RootDocument";
import { getDict } from "@/i18n/dictionaries";
import { fraunces, jakarta } from "../fonts";
import "../globals.css";

export { viewport } from "@/components/RootDocument";

const t = getDict("en");
export const metadata = buildMetadata(t);

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootDocument t={t} fontClassName={`${jakarta.variable} ${fraunces.variable}`}>
      {children}
    </RootDocument>
  );
}
