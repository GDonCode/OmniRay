import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/services", "/work", "/about", "/contact"].map((path) => ({
    url: `${SITE.url}${path}`,
  }));
}
