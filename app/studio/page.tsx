import { getStudioPage } from "@/lib/sanity/queries";
import { studioFallback } from "@/lib/sanity/studioFallback";
import { StudioClient } from "./StudioClient";

export default async function StudioPage() {
  const studio = await getStudioPage();

  return <StudioClient studio={studio ?? studioFallback} />;
}
