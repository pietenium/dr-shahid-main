import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppointmentForm } from "./AppointmentForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppointment, getBookedSlots } from "@/lib/api/appointments";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

// Mock the API
vi.mock("@/lib/api/appointments", () => ({
  createAppointment: vi.fn().mockResolvedValue({ _id: "123" }),
  getBookedSlots: vi.fn().mockResolvedValue([]),
}));

// Mock reCAPTCHA
vi.mock("react-google-recaptcha-v3", () => ({
  useGoogleReCaptcha: vi.fn(() => ({
    executeRecaptcha: vi.fn().mockResolvedValue("mock-token"),
  })),
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

  it("can navigate back and forth between steps", async () => {
    const user = userEvent.setup();
    render(<AppointmentForm />, { wrapper });

    // Step 1 -> Step 2
    await user.type(screen.getByLabelText("Patient Name"), "John Doe");
    await user.type(screen.getByLabelText("Phone Number"), "+8801712345678");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText("Preferred Schedule")).toBeInTheDocument();
    });

    // Step 2 -> Step 1
    await user.click(screen.getByRole("button", { name: /back/i }));

    await waitFor(() => {
      expect(screen.getByText("Who is the patient?")).toBeInTheDocument();
    });
  });

  it("advances to next step instead of submitting if submitted early (e.g. pressing Enter)", async () => {
    const user = userEvent.setup();
    const { container } = render(<AppointmentForm />, { wrapper });

    // Step 1
    await user.type(screen.getByLabelText("Patient Name"), "John Doe");
    await user.type(screen.getByLabelText("Phone Number"), "+8801712345678");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 2 (fill required fields to make schema valid)
    await waitFor(() => {
      expect(screen.getByText("Preferred Schedule")).toBeInTheDocument();
    });
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().slice(0, 10);
    await user.type(screen.getByLabelText("Preferred Date"), dateStr);
    await user.selectOptions(screen.getByLabelText("Preferred Time Slot"), "10:00 AM");
    
    // Go back to Step 1
    await user.click(screen.getByRole("button", { name: /back/i }));
    await waitFor(() => {
      expect(screen.getByText("Who is the patient?")).toBeInTheDocument();
    });

    // Directly submit the form. Because all fields (including Step 2 fields) are now valid, 
    // react-hook-form allows the submit. But since step is 0 (< 2), the guard intercepts 
    // and advances us to Step 2 instead of executing final submit.
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      expect(screen.getByText("Preferred Schedule")).toBeInTheDocument();
      expect(createAppointment).not.toHaveBeenCalled();
    });
  });

  it("handles 429 rate limit error on submit", async () => {
    vi.mocked(createAppointment).mockRejectedValueOnce({ response: { status: 429 } });
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
    await user.selectOptions(screen.getByLabelText("Preferred Time Slot"), "10:00 AM");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 3
    await user.click(screen.getByRole("button", { name: /submit request/i }));

    await waitFor(() => {
      expect(createAppointment).toHaveBeenCalled();
    });
  });

  it("handles generic error on submit", async () => {
    vi.mocked(createAppointment).mockRejectedValueOnce(new Error("Network error"));
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
    await user.selectOptions(screen.getByLabelText("Preferred Time Slot"), "10:00 AM");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 3
    await user.click(screen.getByRole("button", { name: /submit request/i }));

    await waitFor(() => {
      expect(createAppointment).toHaveBeenCalled();
    });
  });

  it("handles missing or failing recaptcha on submit", async () => {
    vi.mocked(useGoogleReCaptcha).mockReturnValue({
      executeRecaptcha: vi.fn().mockRejectedValue(new Error("Recaptcha failed")),
    } as any);

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
    await user.selectOptions(screen.getByLabelText("Preferred Time Slot"), "10:00 AM");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 3
    await user.click(screen.getByRole("button", { name: /submit request/i }));

    await waitFor(() => {
      expect(createAppointment).toHaveBeenCalled();
      const callArgs = vi.mocked(createAppointment).mock.calls[0][0];
      expect(callArgs.recaptchaToken).toBeUndefined();
    });

    // Reset mock for other tests
    vi.mocked(useGoogleReCaptcha).mockReturnValue({
      executeRecaptcha: vi.fn().mockResolvedValue("mock-token"),
    } as any);
  });

  it("submits without token if recaptcha is not initialized", async () => {
    vi.mocked(useGoogleReCaptcha).mockReturnValue({
      executeRecaptcha: undefined,
    } as any);

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
    await user.selectOptions(screen.getByLabelText("Preferred Time Slot"), "10:00 AM");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 3
    await user.click(screen.getByRole("button", { name: /submit request/i }));

    await waitFor(() => {
      expect(createAppointment).toHaveBeenCalled();
      const callArgs = vi.mocked(createAppointment).mock.calls[0][0];
      expect(callArgs.recaptchaToken).toBeUndefined();
    });

    vi.mocked(useGoogleReCaptcha).mockReturnValue({
      executeRecaptcha: vi.fn().mockResolvedValue("mock-token"),
    } as any);
  });

  it("resets form when clicking 'Book Another Appointment'", async () => {
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
    await user.selectOptions(screen.getByLabelText("Preferred Time Slot"), "10:00 AM");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 3
    await user.click(screen.getByRole("button", { name: /submit request/i }));

    await waitFor(() => {
      expect(screen.getByText("Request Received")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /book another appointment/i }));

    await waitFor(() => {
      expect(screen.getByText("Who is the patient?")).toBeInTheDocument();
    });
  });
});
