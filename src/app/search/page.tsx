import type { Metadata } from "next";
import { SearchClient } from "@/components/search/SearchClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search articles, research, and testimonials.",
  robots: { index: false },
};

export default function SearchPage() {
  return <SearchClient />;
}
