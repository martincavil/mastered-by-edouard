import { getTermsAndConditions } from "@/lib/sanity/queries";
import { TermsAndConditionsClient } from "./TermsAndConditionsClient";

export default async function TermsAndConditionsPage() {
  const terms = await getTermsAndConditions();

  return <TermsAndConditionsClient terms={terms} />;
}
