import { getArtists } from "@/lib/sanity/queries";
import { ListenClient } from "./ListenClient";

export default async function ListenPage() {
  const artists = await getArtists();

  return <ListenClient artists={artists} />;
}
