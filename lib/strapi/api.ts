import { Artist, StrapiResponse } from "./types";

// Remove trailing slash if present to avoid double slashes in URLs
const STRAPI_URL = (
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
).replace(/\/$/, "");

export async function getArtists(): Promise<Artist[]> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/artists?populate=*`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch artists: ${response.statusText}`);
    }

    const data: StrapiResponse<Artist[]> = await response.json();
    console.log("📦 Strapi Response:", JSON.stringify(data, null, 2));
    return data.data;
  } catch (error) {
    console.error("Error fetching artists:", error);
    return [];
  }
}

export function getStrapiImageUrl(url: string): string {
  if (!url) {
    console.log("❌ URL is empty");
    return "";
  }

  console.log("🔍 Original URL:", url);

  // Handle Dropbox links
  if (url.includes("dropbox.com")) {
    // For new Dropbox format: https://www.dropbox.com/scl/fi/xxx/file.jpg?rlkey=xxx&st=xxx&dl=0
    // Change dl=0 to dl=1 for direct download
    let convertedUrl = url;

    // Replace dl=0 with dl=1 (for direct download instead of preview page)
    if (convertedUrl.includes("dl=0")) {
      convertedUrl = convertedUrl.replace("dl=0", "dl=1");
      console.log("✅ Converted Dropbox URL (direct download):", convertedUrl);
      return convertedUrl;
    }

    // For old format without dl parameter: https://www.dropbox.com/s/xxxxx/image.jpg
    // Convert to dl.dropboxusercontent.com
    convertedUrl = convertedUrl.replace(
      "www.dropbox.com",
      "dl.dropboxusercontent.com"
    );
    console.log("✅ Converted Dropbox URL (old format):", convertedUrl);
    return convertedUrl;
  }

  if (url.startsWith("http")) {
    console.log("✅ External URL:", url);
    return url;
  }

  const fullUrl = `${STRAPI_URL}${url}`;
  console.log("✅ Strapi URL:", fullUrl);
  return fullUrl;
}
