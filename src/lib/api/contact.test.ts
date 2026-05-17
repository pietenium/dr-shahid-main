import { describe, expect, it, vi } from "vitest";

// Mock axios before importing the module that uses it
vi.mock("@/lib/axios", () => ({
  api: {
    post: vi.fn(),
  },
}));

import { api } from "@/lib/axios";
import { submitContact } from "./contact";

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
