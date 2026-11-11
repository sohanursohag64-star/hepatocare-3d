import { HomePage } from "@/components/HomePage";
import { getDict } from "@/i18n/dictionaries";

export default function EnglishHome() {
  return <HomePage t={getDict("en")} />;
}
