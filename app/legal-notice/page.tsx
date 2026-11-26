import { getLegalNotice } from "@/lib/sanity/queries";
import { LegalNoticeClient } from "./LegalNoticeClient";

// Re-read Sanity at most once a minute, so edits show up without a redeploy
export const revalidate = 60;

export default async function LegalNoticePage() {
  const legalNotice = await getLegalNotice();

  return <LegalNoticeClient legalNotice={legalNotice} />;
}
