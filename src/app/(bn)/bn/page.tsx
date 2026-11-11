import { HomePage } from "@/components/HomePage";
import { getDict } from "@/i18n/dictionaries";

export default function BanglaHome() {
  return <HomePage t={getDict("bn")} />;
}
