import { getTermsAndConditions } from "@/lib/sanity/queries";
import { TermsAndConditionsClient } from "./TermsAndConditionsClient";

// Re-read Sanity at most once a minute, so edits show up without a redeploy
export const revalidate = 60;

export default async function TermsAndConditionsPage() {
  const terms = await getTermsAndConditions();

  return <TermsAndConditionsClient terms={terms} />;
}
