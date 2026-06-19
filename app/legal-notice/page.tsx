import { getLegalNotice } from "@/lib/sanity/queries";
import { LegalNoticeClient } from "./LegalNoticeClient";

export default async function LegalNoticePage() {
  const legalNotice = await getLegalNotice();

  return <LegalNoticeClient legalNotice={legalNotice} />;
}
