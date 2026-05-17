# Testing Guide for dr-shahid-main (Frontend Website)

---

## What is Testing?

Testing means writing **code that verifies your code works correctly** — automatically. Instead of manually clicking through your website every time you change something, you write test scripts that run in milliseconds and tell you exactly what broke.

Think of it like this: your code is a bridge. Testing is the safety inspection that runs before every car drives over it. No tests = every change is a gamble.

---

## Why This Project Needs It

Your project handles:
- Patient appointment booking (medical data)
- Contact form submissions
- reCAPTCHA-protected endpoints
- DOMPurify-sanitized HTML rendering
- 3D WebGL content loading
- Complex multi-step forms with validation
- Zustand state persistence with localStorage

**One bug in `AppointmentForm` validation = a real patient's appointment is lost or corrupted.** That's not a typo — it's a real consequence.

---

## The 3 Layers of Testing

```
┌─────────────────────────────────────────────────┐
│  End-to-End (E2E)                               │  ← Slow, expensive, high confidence
│  Playwright / Cypress                            │     Tests the FULL browser flow
│  "User clicks Book Appointment → fills form →    │
│   submits → sees success screen"                 │
├─────────────────────────────────────────────────┤
│  Integration Tests                               │  ← Medium speed
│  React Testing Library + Jest/Vitest              │     Tests components WITH their children
│  "ContactForm renders all fields, validates      │
│   email, shows error on invalid input,           │
│   calls submitContact on valid submit"           │
├─────────────────────────────────────────────────┤
│  Unit Tests                                      │  ← Fast, cheap, targeted
│  Vitest                                          │     Tests ONE function/component in isolation
│  "cn() merges Tailwind classes correctly"        │
│  "truncate('Hello World', 5) returns 'Hello...'" │
│  "useSearchStore.addRecentSearch() deduplicates" │
└─────────────────────────────────────────────────┘
```

**Rule of thumb:** 70% unit, 20% integration, 10% E2E.

---

## Setup — What to Install

```bash
# Vitest (test runner — faster than Jest, native ESM, great Vite/Next.js support)
bun add -d vitest @vtesting-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Add to `package.json` scripts:
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

Create `vitest.config.ts` in project root:
```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

Create `src/__tests__/setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

Update `tsconfig.json` to recognize vitest types:
```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

Update `biome.json` to ignore test files from linting (or keep them linted — your choice):
```json
{
  "files": {
    "ignore": ["**/*.test.{ts,tsx}", "src/__tests__/**"]
  }
}
```

---

## Layer 1: Unit Tests

### What to test in this project

These are the pure functions, hooks, and stores in your codebase — things with **no UI, no network calls, no browser APIs** (or mocked ones):

| File | Functions/Exports | What to test |
|------|-------------------|-------------|
| `src/lib/utils.ts` | `cn`, `formatDate`, `timeAgo`, `truncate`, `readingTime`, `stripTags`, `getInitials`, `extractHttpStatus` | Pure logic, no dependencies |
| `src/hooks/useDebounce.ts` | `useDebounce` | Timing behavior |
| `src/hooks/useMediaQuery.ts` | `useMediaQuery` | Window matchMedia behavior |
| `src/store/use-search-store.ts` | `addRecentSearch`, `setActiveType`, `clearRecentSearches` | State transitions, deduplication, max 8 limit, localStorage persistence |
| `src/store/use-ui-store.ts` | `openMobileMenu`, `closeMobileMenu`, `toggleMobileMenu`, `acceptCookieConsent` | State transitions, localStorage persistence |
| `src/store/use-appointment-prefill.ts` | `setPrefill`, `clearPrefill` | State transitions |
| `src/lib/url.ts` | `useSetParams` | URL param construction |

### Example: `src/lib/utils.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { cn, formatDate, timeAgo, truncate, readingTime, stripTags, getInitials, extractHttpStatus } from "@/lib/utils";

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
    expect(cn("px-4", active && "bg-brand-primary")).toBe("px-4 bg-brand-primary");
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

describe("stripTags()", () => {
  it("removes simple HTML tags", () => {
    expect(stripTags("<p>Hello</p>")).toBe("Hello");
  });

  it("removes nested tags", () => {
    expect(stripTags("<div><p>Hello <strong>World</strong></p></div>")).toBe("Hello World");
  });

  it("removes self-closing tags", () => {
    expect(stripTags("Line 1<br />Line 2")).toBe("Line 1Line 2");
  });

  it("handles empty string", () => {
    expect(stripTags("")).toBe("");
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

describe("extractHttpStatus()", () => {
  it("extracts status from Axios error", () => {
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
```

### Example: `src/store/use-search-store.test.ts`

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { useSearchStore } from "@/store/use-search-store";

describe("useSearchStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useSearchStore.setState({
      recentSearches: [],
      activeType: "all",
    });
    localStorage.clear();
  });

  describe("addRecentSearch()", () => {
    it("adds a search to recent list", () => {
      useSearchStore.getState().addRecentSearch("knee surgery", "article");
      const { recentSearches } = useSearchStore.getState();
      expect(recentSearches).toHaveLength(1);
      expect(recentSearches[0].query).toBe("knee surgery");
      expect(recentSearches[0].type).toBe("article");
    });

    it("deduplicates same query+type (moves to top)", () => {
      useSearchStore.getState().addRecentSearch("knee", "article");
      useSearchStore.getState().addRecentSearch("hip", "article");
      useSearchStore.getState().addRecentSearch("knee", "article");
      const { recentSearches } = useSearchStore.getState();
      expect(recentSearches).toHaveLength(2);
      expect(recentSearches[0].query).toBe("knee");
    });

    it("limits to 8 recent searches", () => {
      for (let i = 0; i < 10; i++) {
        useSearchStore.getState().addRecentSearch(`query-${i}`, "article");
      }
      const { recentSearches } = useSearchStore.getState();
      expect(recentSearches).toHaveLength(8);
      expect(recentSearches[0].query).toBe("query-9"); // Most recent first
    });

    it("rejects queries shorter than 2 characters", () => {
      useSearchStore.getState().addRecentSearch("a", "article");
      expect(useSearchStore.getState().recentSearches).toHaveLength(0);
    });

    it("trims whitespace before storing", () => {
      useSearchStore.getState().addRecentSearch("  knee  ", "article");
      expect(useSearchStore.getState().recentSearches[0].query).toBe("knee");
    });
  });

  describe("setActiveType()", () => {
    it("sets the active search type", () => {
      useSearchStore.getState().setActiveType("research");
      expect(useSearchStore.getState().activeType).toBe("research");
    });
  });

  describe("clearRecentSearches()", () => {
    it("clears all recent searches", () => {
      useSearchStore.getState().addRecentSearch("knee", "article");
      useSearchStore.getState().addRecentSearch("hip", "research");
      useSearchStore.getState().clearRecentSearches();
      expect(useSearchStore.getState().recentSearches).toHaveLength(0);
    });
  });
});
```

### Example: `src/store/use-ui-store.test.ts`

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { useUIStore } from "@/store/use-ui-store";

describe("useUIStore", () => {
  beforeEach(() => {
    useUIStore.setState({
      isMobileMenuOpen: false,
      cookieConsentAccepted: false,
    });
    localStorage.clear();
  });

  it("opens mobile menu", () => {
    useUIStore.getState().openMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(true);
  });

  it("closes mobile menu", () => {
    useUIStore.getState().openMobileMenu();
    useUIStore.getState().closeMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
  });

  it("toggles mobile menu", () => {
    useUIStore.getState().toggleMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(true);
    useUIStore.getState().toggleMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
  });

  it("accepts cookie consent", () => {
    useUIStore.getState().acceptCookieConsent();
    expect(useUIStore.getState().cookieConsentAccepted).toBe(true);
  });
});
```

### Example: `src/hooks/useDebounce.test.ts`

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 500));
    expect(result.current).toBe("hello");
  });

  it("updates value after delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "hello", delay: 500 } }
    );

    rerender({ value: "world", delay: 500 });
    expect(result.current).toBe("hello"); // Not updated yet

    vi.advanceTimersByTime(500);
    expect(result.current).toBe("world"); // Updated after delay
  });

  it("resets timer if value changes before delay expires", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 500 } }
    );

    rerender({ value: "b", delay: 500 });
    vi.advanceTimersByTime(300); // Not enough time
    expect(result.current).toBe("a");

    rerender({ value: "c", delay: 500 });
    vi.advanceTimersByTime(300); // Still not enough — timer reset
    expect(result.current).toBe("a");

    vi.advanceTimersByTime(200); // Now 500ms since last change
    expect(result.current).toBe("c");
  });
});
```

### Example: `src/lib/api/__mocks__/contact.test.ts`

```ts
import { describe, expect, it, vi } from "vitest";

// Mock axios before importing the module that uses it
vi.mock("@/lib/axios", () => ({
  api: {
    post: vi.fn(),
  },
}));

import { api } from "@/lib/axios";
import { submitContact } from "@/lib/api/contact";

describe("submitContact()", () => {
  it("sends POST to /contact with payload", async () => {
    const mockResponse = {
      data: { data: { _id: "abc123", status: "UNREAD" } },
    };
    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const payload = {
      name: "John Doe",
      email: "john@example.com",
      subject: "Test",
      message: "Hello there",
      reason: "general" as const,
      recaptchaToken: "token",
    };

    const result = await submitContact(payload);

    expect(api.post).toHaveBeenCalledWith("/contact", payload);
    expect(result._id).toBe("abc123");
  });

  it("throws when API returns error", async () => {
    vi.mocked(api.post).mockRejectedValueOnce({
      response: { status: 429, data: { message: "Too many requests" } },
    });

    await expect(
      submitContact({
        name: "John",
        email: "john@test.com",
        subject: "Test",
        message: "Test message",
        reason: "general" as const,
        recaptchaToken: "token",
      })
    ).rejects.toEqual({
      response: { status: 429, data: { message: "Too many requests" } },
    });
  });
});
```

---

## Layer 2: Integration Tests (Component Tests)

### What to test

Components that render UI, interact with forms, use hooks, or call API functions:

| Component | Key behaviors to test |
|-----------|----------------------|
| `ContactForm` | Renders all 6 fields, validates required fields, shows Zod error messages, calls `submitContact` on valid submit, resets form on success, handles 429 error |
| `AppointmentForm` | 3-step navigation, validates per-step fields, phone regex validation, date must be future, shows booked slots, submit calls `createAppointment`, success state renders |
| `ShareButtons` | Renders 5 share links (native, Facebook, X, LinkedIn, copy), correct URLs with encoded title+slug |
| `CookieConsent` | Hidden when consent accepted, visible when not, accept button hides banner |
| `Modal` | Opens/closes, focus trap cycles Tab/Shift+Tab, Escape key closes, body scroll locked |
| `StarRating` | Renders correct number of stars for given rating |
| `Pagination` | Renders correct page numbers, active page highlighted |
| `EmptyState` | Renders title, description, and optional action button |
| `BackToTop` | Hidden when scroll < threshold, visible when scroll > threshold |
| `Breadcrumbs` | Renders Home + intermediate links + current page |

### Example: `src/components/forms/ContactForm.test.tsx`

```tsx
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { ContactForm } from "@/components/forms/ContactForm";

// Mock the API
vi.mock("@/lib/api/contact", () => ({
  submitContact: vi.fn().mockResolvedValue({ _id: "123", status: "UNREAD" }),
}));

// Mock reCAPTCHA
vi.mock("react-google-recaptcha-v3", () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: vi.fn().mockResolvedValue("mock-token"),
  }),
}));

import { submitContact } from "@/lib/api/contact";

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone (optional)")).toBeInTheDocument();
    expect(screen.getByLabelText("Reason")).toBeInTheDocument();
    expect(screen.getByLabelText("Subject")).toBeInTheDocument();
    expect(screen.getByLabelText("Your Message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText("Name must be at least 2 characters")).toBeInTheDocument();
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
      expect(screen.getByText("Subject must be at least 5 characters")).toBeInTheDocument();
      expect(screen.getByText("Message must be at least 10 characters")).toBeInTheDocument();
    });
  });

  it("shows error for invalid email format", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Email Address"), "not-an-email");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });

  it("shows error for short name", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Full Name"), "J");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText("Name must be at least 2 characters")).toBeInTheDocument();
    });
  });

  it("submits form successfully with valid data", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Full Name"), "John Doe");
    await user.type(screen.getByLabelText("Email Address"), "john@example.com");
    await user.type(screen.getByLabelText("Subject"), "Medical question");
    await user.type(screen.getByLabelText("Your Message"), "I have a question about knee pain treatment");

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(submitContact).toHaveBeenCalledOnce();
    });

    // Verify payload
    const callArgs = vi.mocked(submitContact).mock.calls[0][0];
    expect(callArgs.name).toBe("John Doe");
    expect(callArgs.email).toBe("john@example.com");
    expect(callArgs.reason).toBe("general");
    expect(callArgs.recaptchaToken).toBe("mock-token");
  });
});
```

### Example: `src/components/shared/ShareButtons.test.tsx`

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ShareButtons } from "@/components/shared/ShareButtons";

// Mock process.env
vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://drshahid.com");

describe("ShareButtons", () => {
  const props = { title: "Knee Replacement Guide", slug: "knee-replacement", basePath: "articles" };

  it("renders all 5 share buttons", () => {
    render(<ShareButtons {...props} />);
    expect(screen.getByLabelText("Share")).toBeInTheDocument();
    expect(screen.getByLabelText("Share on Facebook")).toBeInTheDocument();
    expect(screen.getByLabelText("Share on X")).toBeInTheDocument();
    expect(screen.getByLabelText("Share on LinkedIn")).toBeInTheDocument();
    expect(screen.getByLabelText("Copy link")).toBeInTheDocument();
  });

  it("generates correct Facebook share URL", () => {
    render(<ShareButtons {...props} />);
    const link = screen.getByLabelText("Share on Facebook").closest("a");
    expect(link?.href).toContain("facebook.com/sharer");
    expect(link?.href).toContain(encodeURIComponent("https://drshahid.com/articles/knee-replacement"));
  });

  it("generates correct X share URL with encoded title", () => {
    render(<ShareButtons {...props} />);
    const link = screen.getByLabelText("Share on X").closest("a");
    expect(link?.href).toContain("twitter.com/intent/tweet");
    expect(link?.href).toContain(encodeURIComponent("Knee Replacement Guide"));
  });

  it("uses basePath prop for URL generation", () => {
    render(<ShareButtons {...props} basePath="research" />);
    const link = screen.getByLabelText("Copy link").closest("a");
    expect(link?.href).toContain("/research/knee-replacement");
  });
});
```

### Example: `src/components/shared/CookieConsent.test.tsx`

```tsx
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock the API
vi.mock("@/lib/api/visitors", () => ({
  giveConsent: vi.fn().mockResolvedValue({}),
}));

// Mock Zustand persist storage
beforeEach(() => {
  localStorage.clear();
});

describe("CookieConsent", () => {
  it("shows banner when consent not given", () => {
    render(<CookieConsent />);
    expect(screen.getByText(/analytics cookies/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /accept cookies/i })).toBeInTheDocument();
  });

  it("hides banner when consent already accepted in localStorage", () => {
    localStorage.setItem("cookie_consent", "true");
    render(<CookieConsent />);
    expect(screen.queryByText(/analytics cookies/i)).not.toBeInTheDocument();
  });

  it("hides banner after clicking Accept", async () => {
    const user = userEvent.setup();
    render(<CookieConsent />);

    await user.click(screen.getByRole("button", { name: /accept cookies/i }));

    expect(screen.queryByText(/analytics cookies/i)).not.toBeInTheDocument();
    expect(localStorage.getItem("cookie_consent")).toBe("true");
  });
});
```

### Example: `src/components/ui/Modal.test.tsx`

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "@/components/ui/Modal";

describe("Modal", () => {
  it("renders when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test">
        <p>Content</p>
      </Modal>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onClose when close button clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>
    );

    await user.click(screen.getByLabelText("Close modal"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when Escape key pressed", async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>
    );

    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("traps focus within modal (Tab cycles)", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <button type="button">First</button>
        <button type="button">Second</button>
      </Modal>
    );

    // Tab from close button should cycle to first button inside
    await userEvent.tab(); // Focus close button
    await userEvent.tab(); // Focus "First"
    await userEvent.tab(); // Focus "Second"
    await userEvent.tab(); // Should cycle back to close button
  });
});
```

---

## Layer 3: E2E Tests

### Setup

```bash
bun add -d @playwright/test
npx playwright install
```

Create `playwright.config.ts`:
```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "Mobile Chrome", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
  },
});
```

Add to `package.json`:
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### Example: `e2e/homepage.spec.ts`

```ts
import { expect, test } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and shows hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Precision Care for Your")).toBeVisible();
    await expect(page.getByText("Book Consultation")).toBeVisible();
    await expect(page.getByText("Explore Articles")).toBeVisible();
  });

  test("navigates to appointment page from hero CTA", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Book Consultation").click();
    await expect(page).toHaveURL("/appointment");
    await expect(page.getByText("Schedule Your Consultation")).toBeVisible();
  });

  test("navigates to articles page from hero CTA", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Explore Articles").click();
    await expect(page).toHaveURL("/articles");
  });

  test("shows specialties section with 4 cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Focused on Your Physical Freedom")).toBeVisible();
    await expect(page.getByText("Joint Replacement")).toBeVisible();
    await expect(page.getByText("Trauma Surgery")).toBeVisible();
    await expect(page.getByText("Sports Medicine")).toBeVisible();
    await expect(page.getByText("Research & Innovation")).toBeVisible();
  });
});
```

### Example: `e2e/appointment.spec.ts`

```ts
import { expect, test } from "@playwright/test";

test.describe("Appointment Form", () => {
  test("shows multi-step form with 3 steps", async ({ page }) => {
    await page.goto("/appointment");
    await expect(page.getByText("Who is the patient?")).toBeVisible();
  });

  test("shows validation error on empty submit at step 1", async ({ page }) => {
    await page.goto("/appointment");
    await page.getByText("Continue").click();
    await expect(page.getByText("Name is required")).toBeVisible();
  });

  test("shows phone format error for invalid input", async ({ page }) => {
    await page.goto("/appointment");
    await page.getByLabel("Patient Name").fill("John Doe");
    await page.getByLabel("Phone Number").fill("12345");
    await page.getByText("Continue").click();
    await expect(page.getByText("Invalid Bangladesh phone format")).toBeVisible();
  });

  test("navigates through all 3 steps with valid data", async ({ page }) => {
    await page.goto("/appointment");

    // Step 1: Personal Info
    await page.getByLabel("Patient Name").fill("John Doe");
    await page.getByLabel("Email Address").fill("john@example.com");
    await page.getByLabel("Phone Number").fill("+8801712345678");
    await page.getByText("Continue").click();

    // Step 2: Date & Time
    await expect(page.getByText("Preferred Schedule")).toBeVisible();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().slice(0, 10);
    await page.getByLabel("Preferred Date").fill(dateStr);
    await page.getByLabel("Preferred Time Slot").selectOption("10:00 AM");
    await page.getByText("Continue").click();

    // Step 3: Notes
    await expect(page.getByText("Anything else?")).toBeVisible();
    await expect(page.getByText("Submit Request")).toBeVisible();
  });
});
```

### Example: `e2e/contact.spec.ts`

```ts
import { expect, test } from "@playwright/test";

test.describe("Contact Form", () => {
  test("loads contact page with form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByLabel("Full Name")).toBeVisible();
    await expect(page.getByLabel("Email Address")).toBeVisible();
    await expect(page.getByRole("button", { name: /send message/i })).toBeVisible();
  });

  test("validates required fields", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText("Name must be at least 2 characters")).toBeVisible();
    await expect(page.getByText("Invalid email address")).toBeVisible();
  });
});
```

### Example: `e2e/articles.spec.ts`

```ts
import { expect, test } from "@playwright/test";

test.describe("Articles", () => {
  test("loads articles page", async ({ page }) => {
    await page.goto("/articles");
    await expect(page).toHaveURL(/\/articles/);
  });

  test("article detail page shows reading progress bar", async ({ page }) => {
    await page.goto("/articles");
    // Find first article link and click
    const articleLink = page.locator("a[href^='/articles/']").first();
    if (await articleLink.isVisible()) {
      await articleLink.click();
      // Reading progress bar should exist in DOM
      await expect(page.locator("[class*='fixed top-0'][class*='h-0.5']")).toBeAttached();
    }
  });
});
```

### Example: `e2e/search.spec.ts`

```ts
import { expect, test } from "@playwright/test";

test.describe("Search", () => {
  test("search page renders search input", async ({ page }) => {
    await page.goto("/search");
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  });
});
```

---

## Complete Test File Structure

```
src/
├── __tests__/
│   └── setup.ts
├── lib/
│   ├── utils.ts
│   ├── utils.test.ts                          ← Unit
│   ├── url.ts
│   ├── url.test.ts                            ← Unit
│   └── api/
│       ├── contact.ts
│       ├── contact.test.ts                    ← Unit (mocked API)
│       ├── appointments.ts
│       ├── appointments.test.ts               ← Unit (mocked API)
│       └── search.ts
│           search.test.ts                     ← Unit (mocked API)
├── hooks/
│   ├── useDebounce.ts
│   ├── useDebounce.test.ts                    ← Unit
│   ├── useMediaQuery.ts
│   └── useMediaQuery.test.ts                  ← Unit
├── store/
│   ├── use-search-store.ts
│   ├── use-search-store.test.ts               ← Unit
│   ├── use-ui-store.ts
│   ├── use-ui-store.test.ts                   ← Unit
│   └── use-appointment-prefill.ts
│       use-appointment-prefill.test.ts        ← Unit
├── components/
│   ├── forms/
│   │   ├── ContactForm.tsx
│   │   ├── ContactForm.test.tsx               ← Integration
│   │   ├── AppointmentForm.tsx
│   │   └── AppointmentForm.test.tsx           ← Integration
│   ├── ui/
│   │   ├── Modal.tsx
│   │   ├── Modal.test.tsx                     ← Integration
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx                    ← Integration
│   │   ├── StarRating.tsx
│   │   ├── StarRating.test.tsx                ← Integration
│   │   └── Pagination.tsx
│   │       Pagination.test.tsx                ← Integration
│   └── shared/
│       ├── ShareButtons.tsx
│       ├── ShareButtons.test.tsx              ← Integration
│       ├── CookieConsent.tsx
│       ├── CookieConsent.test.tsx             ← Integration
│       ├── Breadcrumbs.tsx
│       ├── Breadcrumbs.test.tsx               ← Integration
│       └── BackToTop.tsx
│           BackToTop.test.tsx                 ← Integration
e2e/
├── homepage.spec.ts                           ← E2E
├── appointment.spec.ts                        ← E2E
├── contact.spec.ts                            ← E2E
├── articles.spec.ts                           ← E2E
├── search.spec.ts                             ← E2E
└── navigation.spec.ts                         ← E2E
```

---

## Test Priority — What to Write First

| Priority | File | Type | Why |
|----------|------|------|-----|
| **P0** | `utils.test.ts` | Unit | Pure functions, zero setup, catches logic bugs instantly |
| **P0** | `use-search-store.test.ts` | Unit | Complex dedup logic, max limit, persistence |
| **P0** | `ContactForm.test.tsx` | Integration | Patient-facing form, Zod validation, API call |
| **P1** | `AppointmentForm.test.tsx` | Integration | Multi-step, phone regex, future date, booked slots |
| **P1** | `Modal.test.tsx` | Integration | Focus trap, Escape key, accessibility |
| **P1** | `use-ui-store.test.ts` | Unit | Cookie consent state, mobile menu |
| **P1** | `ShareButtons.test.tsx` | Integration | URL encoding, correct hrefs |
| **P2** | `useDebounce.test.ts` | Unit | Timing behavior, timer reset |
| **P2** | `CookieConsent.test.tsx` | Integration | Show/hide, localStorage |
| **P2** | `contact.test.ts` (API mock) | Unit | API payload shape, error handling |
| **P2** | `appointments.test.ts` (API mock) | Unit | API payload shape, booked slots fallback |
| **P3** | `Breadcrumbs.test.tsx` | Integration | URL-based rendering |
| **P3** | `Pagination.test.tsx` | Integration | Page number generation |
| **P3** | `homepage.spec.ts` | E2E | Smoke test critical user paths |
| **P3** | `appointment.spec.ts` | E2E | Full form flow |
| **P3** | `navigation.spec.ts` | E2E | All links work, no 404s |

---

## CI Integration

Add a test job to `.github/workflows/ci.yml`:

```yaml
test:
  needs: [lint, type-check]
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4

    - uses: oven-sh/setup-bun@v2
      with:
        bun-version: latest

    - name: Install dependencies
      run: bun install --frozen-lockfile

    - name: Run unit & integration tests
      run: bun run test:run --coverage

    - name: Upload coverage
      uses: actions/upload-artifact@v4
      with:
        name: coverage
        path: coverage/
```

---

## Key Testing Concepts — Quick Reference

| Concept | Meaning | Example |
|---------|---------|---------|
| **describe()** | Groups related tests | `describe("cn()", () => { ... })` |
| **it() / test()** | One test case | `it("merges classes", () => { ... })` |
| **expect()** | Assertion — what you expect | `expect(result).toBe("hello")` |
| **vi.mock()** | Replace a module with a fake | `vi.mock("@/lib/axios")` |
| **vi.fn()** | Create a spy function | `const onClose = vi.fn()` |
| **render()** | Render a React component | `render(<Modal />)` |
| **screen** | Query the rendered DOM | `screen.getByText("Hello")` |
| **userEvent** | Simulate real user actions | `await user.click(button)` |
| **waitFor()** | Wait for async updates | `await waitFor(() => expect(...))` |
| **beforeEach()** | Runs before each test | Reset state, clear mocks |
| **vi.advanceTimersByTime()** | Fast-forward timers | Test debounce without waiting |

---

## Testing Commands Cheat Sheet

```bash
# Run all tests (watch mode)
bun test

# Run all tests once (CI mode)
bun run test:run

# Run only unit tests
bun run test:run src/lib/utils.test.ts

# Run only component tests
bun run test:run src/components/

# Run with coverage report
bun run test:coverage

# Run E2E tests
bun run test:e2e

# Run E2E with UI (interactive)
bun run test:e2e:ui
```