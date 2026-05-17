import { describe, expect, it, vi } from "vitest";

// Mock axios before importing the module that uses it
vi.mock("@/lib/axios", () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

import { api } from "@/lib/axios";
import { createAppointment, getBookedSlots } from "./appointments";

describe("createAppointment()", () => {
  it("sends POST to /appointments with payload", async () => {
    const mockResponse = {
      data: { data: { _id: "apt123" } },
    };
    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const payload = {
      name: "John Doe",
      phone: "+8801712345678",
      preferredDate: "2026-05-16",
      preferredTime: "10:00 AM",
      recaptchaToken: "token",
    };

    const result = await createAppointment(payload);

    expect(api.post).toHaveBeenCalledWith("/appointments", payload);
    expect(result._id).toBe("apt123");
  });
});

describe("getBookedSlots()", () => {
  it("fetches booked slots for a given date", async () => {
    const mockResponse = {
      data: {
        data: [{ preferredTime: "10:00 AM" }, { preferredTime: "11:30 AM" }],
      },
    };
    vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

    const date = "2026-05-16";
    const result = await getBookedSlots(date);

    expect(api.get).toHaveBeenCalledWith("/appointments/booked-slots", {
      params: { date },
    });
    expect(result).toEqual(["10:00 AM", "11:30 AM"]);
  });

  it("returns empty array on error", async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error("Network Error"));

    const result = await getBookedSlots("2026-05-16");
    expect(result).toEqual([]);
  });
});
