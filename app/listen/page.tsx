import { getArtists } from "@/lib/sanity/queries";
import { ListenClient } from "./ListenClient";

// Re-read Sanity at most once a minute, so edits show up without a redeploy
export const revalidate = 60;

/** Dropbox share links ("dl=0") open a preview page: force the direct file ("dl=1") */
function directImageUrl(url?: string) {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    if (u.hostname.endsWith("dropbox.com")) {
      u.searchParams.delete("raw");
      u.searchParams.set("dl", "1");
    }
    return u.toString();
  } catch {
    return undefined;
  }
}

export default async function ListenPage() {
  const artists = await getArtists();

  return (
    <ListenClient
      artists={artists.map((a) => ({ name: a.name, photo: directImageUrl(a.picture), qobuz: a.link }))}
    />
  );
}
