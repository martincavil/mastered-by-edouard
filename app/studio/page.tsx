import { getStudioPage } from "@/lib/sanity/queries";
import { studioFallback } from "@/lib/sanity/studioFallback";
import { StudioClient } from "./StudioClient";

// Re-read Sanity at most once a minute, so edits show up without a redeploy
export const revalidate = 60;

export default async function StudioPage() {
  const studio = await getStudioPage();

  return <StudioClient studio={studio ?? studioFallback} />;
}
