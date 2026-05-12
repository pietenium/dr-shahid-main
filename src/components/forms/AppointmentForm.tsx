"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { createAppointment } from "@/lib/api/appointments";

const appointmentSchema = z.object({
  patientName: z.string().min(2, "Name is required"),
  patientEmail: z.string().email("Invalid email address"),
  patientPhone: z.string().min(10, "Valid phone number is required"),
  appointmentDate: z.string().min(1, "Preferred date is required"),
  preferredTimeSlot: z.enum(["morning", "afternoon", "evening"]),
  reasonForVisit: z.string().min(10, "Please provide more details"),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export const AppointmentForm = () => {
  const [loading, setLoading] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      preferredTimeSlot: "morning",
    },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    if (!executeRecaptcha) {
      toast.error("ReCAPTCHA not initialized. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const token = await executeRecaptcha("appointment_request");
      await createAppointment({
        name: data.patientName,
        phone: data.patientPhone,
        email: data.patientEmail,
        message: data.reasonForVisit,
        preferredDate: data.appointmentDate,
        preferredTime: data.preferredTimeSlot,
        recaptchaToken: token,
      });
      toast.success(
        "Appointment request submitted! We will contact you soon to confirm.",
      );
      reset();
    } catch (_error) {
      toast.error("Failed to submit request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Patient Name"
          placeholder="John Doe"
          error={errors.patientName?.message}
          {...register("patientName")}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          error={errors.patientEmail?.message}
          {...register("patientEmail")}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+880 1XXX-XXXXXX"
          error={errors.patientPhone?.message}
          {...register("patientPhone")}
        />
        <Input
          label="Preferred Date"
          type="date"
          error={errors.appointmentDate?.message}
          {...register("appointmentDate")}
        />
      </div>
      <Select
        label="Preferred Time Slot"
        options={[
          { value: "morning", label: "Morning (09:00 - 12:00)" },
          { value: "afternoon", label: "Afternoon (14:00 - 17:00)" },
          { value: "evening", label: "Evening (18:00 - 21:00)" },
        ]}
        error={errors.preferredTimeSlot?.message}
        {...register("preferredTimeSlot")}
      />
      <Textarea
        label="Reason for Visit / Symptoms"
        placeholder="Briefly describe your orthopedic concern..."
        error={errors.reasonForVisit?.message}
        maxLength={500}
        {...register("reasonForVisit")}
      />
      <Button type="submit" loading={loading} className="w-full h-14 text-lg">
        Submit Appointment Request
      </Button>
      <p className="text-[10px] text-center text-text-para-light dark:text-text-para-dark opacity-40 uppercase tracking-widest">
        A representative will contact you for final confirmation.
      </p>
    </form>
  );
};
