import { getFaq } from "@/lib/sanity/queries";
import { FaqClient } from "./FaqClient";

// Re-read Sanity at most once a minute, so edits show up without a redeploy
export const revalidate = 60;

export default async function FaqPage() {
  const faq = await getFaq();

  return <FaqClient questions={faq?.questions ?? []} />;
}
