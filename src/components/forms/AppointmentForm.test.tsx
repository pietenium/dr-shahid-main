import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppointmentForm } from "./AppointmentForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppointment, getBookedSlots } from "@/lib/api/appointments";

// Mock the API
vi.mock("@/lib/api/appointments", () => ({
  createAppointment: vi.fn().mockResolvedValue({ _id: "123" }),
  getBookedSlots: vi.fn().mockResolvedValue([]),
}));

// Mock reCAPTCHA
vi.mock("react-google-recaptcha-v3", () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: vi.fn().mockResolvedValue("mock-token"),
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("AppointmentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it("renders step 1 fields initially", () => {
    render(<AppointmentForm />, { wrapper });
    expect(screen.getByText("Who is the patient?")).toBeInTheDocument();
    expect(screen.getByLabelText("Patient Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
  });

  it("shows validation error on empty submit at step 1", async () => {
    const user = userEvent.setup();
    render(<AppointmentForm />, { wrapper });

    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      // Phone format fails if empty or incorrect
      expect(
        screen.getByText("Invalid Bangladesh phone format")
      ).toBeInTheDocument();
    });
  });

  it("shows phone format error for invalid input", async () => {
    const user = userEvent.setup();
    render(<AppointmentForm />, { wrapper });

    await user.type(screen.getByLabelText("Patient Name"), "John Doe");
    await user.type(screen.getByLabelText("Phone Number"), "12345");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Invalid Bangladesh phone format")
      ).toBeInTheDocument();
    });
  });

  it("navigates through steps with valid data", async () => {
    const user = userEvent.setup();
    render(<AppointmentForm />, { wrapper });

    // Step 1
    await user.type(screen.getByLabelText("Patient Name"), "John Doe");
    await user.type(screen.getByLabelText("Email Address"), "john@example.com");
    await user.type(screen.getByLabelText("Phone Number"), "+8801712345678");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 2
    await waitFor(() => {
      expect(screen.getByText("Preferred Schedule")).toBeInTheDocument();
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().slice(0, 10);

    // FireEvent is sometimes easier for date inputs in jsdom
    await user.type(screen.getByLabelText("Preferred Date"), dateStr);
    
    // Select time slot
    await user.selectOptions(screen.getByLabelText("Preferred Time Slot"), "10:00 AM");

    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 3
    await waitFor(() => {
      expect(screen.getByText("Anything else?")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /submit request/i }));

    await waitFor(() => {
      expect(createAppointment).toHaveBeenCalledOnce();
      expect(screen.getByText("Request Received")).toBeInTheDocument();
    });

    const callArgs = vi.mocked(createAppointment).mock.calls[0][0];
    expect(callArgs.name).toBe("John Doe");
    expect(callArgs.phone).toBe("+8801712345678");
    expect(callArgs.preferredDate).toBe(dateStr);
    expect(callArgs.preferredTime).toBe("10:00 AM");
    expect(callArgs.recaptchaToken).toBe("mock-token");
  });

  it("displays booked slots message when slots are booked", async () => {
    vi.mocked(getBookedSlots).mockResolvedValueOnce(["10:00 AM"]);
    const user = userEvent.setup();
    render(<AppointmentForm />, { wrapper });

    // Step 1
    await user.type(screen.getByLabelText("Patient Name"), "John Doe");
    await user.type(screen.getByLabelText("Phone Number"), "+8801712345678");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 2
    await waitFor(() => {
      expect(screen.getByText("Preferred Schedule")).toBeInTheDocument();
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().slice(0, 10);
    await user.type(screen.getByLabelText("Preferred Date"), dateStr);

    await waitFor(() => {
      expect(screen.getByText(/1 slot\(s\) already booked for this date/)).toBeInTheDocument();
    });
  });
});
