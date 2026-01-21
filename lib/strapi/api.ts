import { Artist, StrapiResponse } from "./types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function getArtists(): Promise<Artist[]> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/artists?sort=name:asc`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: StrapiResponse<Artist[]> = await response.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching artists:", error);
    return [];
  }
}

export function getStrapiImageUrl(imageUrl: string): string {
  // If it's already a full URL, return as is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Otherwise, it's a relative URL from Strapi
  return `${STRAPI_URL}${imageUrl}`;
}
