import { describe, expect, it } from "vitest";
import {
  cn,
  extractHttpStatus,
  formatDate,
  getInitials,
  readingTime,
  stripTags,
  timeAgo,
  truncate,
} from "./utils";

describe("cn()", () => {
  it("merges conflicting Tailwind classes (last wins)", () => {
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("merges responsive variants", () => {
    expect(cn("text-sm", "md:text-lg")).toBe("text-sm md:text-lg");
  });

  it("handles empty and undefined inputs", () => {
    expect(cn()).toBe("");
    expect(cn("px-4", undefined, "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    const active = true;
    expect(cn("px-4", active && "bg-brand-primary")).toBe(
      "px-4 bg-brand-primary",
    );
  });
});

describe("formatDate()", () => {
  it("formats ISO date to readable string", () => {
    const result = formatDate("2026-05-16T00:00:00.000Z");
    expect(result).toContain("2026");
    expect(result).toContain("May");
  });

  it("supports custom pattern", () => {
    const result = formatDate("2026-05-16", "yyyy-MM-dd");
    expect(result).toBe("2026-05-16");
  });
});

describe("timeAgo()", () => {
  it("returns relative time from now", () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    expect(timeAgo(oneHourAgo)).toContain("about 1 hour ago");
  });
});

describe("truncate()", () => {
  it("returns full text when under maxLength", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("truncates and adds ellipsis when over maxLength", () => {
    expect(truncate("Hello World", 5)).toBe("Hello...");
  });

  it("trims whitespace before truncating", () => {
    expect(truncate("Hello World  ", 8)).toBe("Hello...");
  });

  it("returns empty string for empty input", () => {
    expect(truncate("", 5)).toBe("");
  });
});

describe("readingTime()", () => {
  it("returns 1 for very short content", () => {
    expect(readingTime("<p>Hello</p>")).toBe(1);
  });

  it("calculates reading time from word count (200 wpm)", () => {
    const words = Array(400).fill("word").join(" ");
    const html = `<p>${words}</p>`;
    expect(readingTime(html)).toBe(2);
  });
});

describe("stripTags()", () => {
  it("removes simple HTML tags", () => {
    expect(stripTags("<p>Hello</p>")).toBe("Hello");
  });

  it("removes nested tags", () => {
    expect(stripTags("<div><p>Hello <strong>World</strong></p></div>")).toBe(
      "Hello World",
    );
  });

  it("removes self-closing tags", () => {
    expect(stripTags("Line 1<br />Line 2")).toBe("Line 1Line 2");
  });

  it("handles empty string", () => {
    expect(stripTags("")).toBe("");
  });
});

describe("getInitials()", () => {
  it("returns initials from full name", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("returns single initial for one name", () => {
    expect(getInitials("Madonna")).toBe("M");
  });

  it("returns max 2 initials", () => {
    expect(getInitials("John Michael Doe")).toBe("JM");
  });

  it("handles empty string", () => {
    expect(getInitials("")).toBe("");
  });
});

describe("extractHttpStatus()", () => {
  it("extracts status from Axios error structure", () => {
    const error = { response: { status: 429 } };
    expect(extractHttpStatus(error)).toBe(429);
  });

  it("returns undefined for non-object", () => {
    expect(extractHttpStatus("string error")).toBeUndefined();
  });

  it("returns undefined for error without response", () => {
    expect(extractHttpStatus({ message: "Network error" })).toBeUndefined();
  });

  it("returns undefined for null", () => {
    expect(extractHttpStatus(null)).toBeUndefined();
  });
});
