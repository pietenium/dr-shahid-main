import { type ClassValue, clsx } from "clsx";
import { format, formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

/** Tailwind class merge helper */
export function cn(...classes: ClassValue[]): string {
  return twMerge(clsx(classes));
}

/** Format ISO date string to human-readable */
export function formatDate(dateStr: string, pattern = "MMMM d, yyyy"): string {
  return format(new Date(dateStr), pattern);
}

/** Relative time: "2 hours ago" */
export function timeAgo(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

/** Estimate reading time (minutes) from HTML content */
export function readingTime(html: string): number {
  const text = stripTags(html);
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Recursively strip HTML tags to prevent incomplete sanitization */
export function stripTags(html: string): string {
  let text = html;
  let prev: string;
  do {
    prev = text;
    text = text.replace(/<[^>]*>/g, "");
  } while (text !== prev);
  return text;
}

/** Get initials from a name */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function extractHttpStatus(error: unknown): number | undefined {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { status?: unknown } }).response;
    if (typeof response?.status === "number") return response.status;
  }
  return undefined;
}
