import { redirect } from "next/navigation";
import { i18n } from "@config";

export default function RootPage() {
  redirect(`/${i18n.defaultLocale}`);
}

