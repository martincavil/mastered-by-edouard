import { getFaq } from "@/lib/sanity/queries";
import { FaqClient } from "./FaqClient";

export default async function FaqPage() {
  const faq = await getFaq();

  return <FaqClient questions={faq?.questions ?? []} />;
}
