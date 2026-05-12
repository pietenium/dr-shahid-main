"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { createAppointment } from "@/lib/api/appointments";
import { extractHttpStatus } from "@/lib/utils";
import { useAppointmentPrefill } from "@/store/use-appointment-prefill";

const appointmentSchema = z.object({
  name: z.string().min(2, "Name is required").trim(),
  phone: z
    .string()
    .regex(/^\+8801[3-9]\d{8}$/, "Invalid Bangladesh phone format"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  preferredDate: z
    .string()
    .min(1, "Preferred date is required")
    .refine((val) => {
      const d = new Date(val);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return d > now;
    }, "Date must be in the future"),
  preferredTime: z.string().min(1, "Please select a time"),
  message: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export const AppointmentForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { message: prefillMessage, clearPrefill } = useAppointmentPrefill();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      preferredTime: "",
      message: prefillMessage ?? "",
    },
  });

  useEffect(() => {
    return () => clearPrefill();
  }, [clearPrefill]);

  const appointmentMutation = useMutation({
    mutationFn: createAppointment,
    retry: false,
    onSuccess: () => {
      toast.success(
        "Appointment request submitted! We will contact you soon to confirm.",
      );
      reset({ preferredTime: "", message: "" });
      setSubmitted(true);
    },
    onError: (error) => {
      const status = extractHttpStatus(error);
      if (status === 429) {
        toast.error(
          "You've submitted too many requests. Please wait and try again.",
        );
      } else {
        toast.error("Failed to submit request. Please try again later.");
      }
    },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    if (!executeRecaptcha) {
      toast.error("ReCAPTCHA not initialized. Please try again.");
      return;
    }

    try {
      const token = await executeRecaptcha("appointment_request");
      appointmentMutation.mutate({
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        message: data.message,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        recaptchaToken: token,
      });
    } catch (_error) {
      toast.error("Failed to execute ReCAPTCHA. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="space-y-8 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="mx-auto w-24 h-24 rounded-full bg-brand-primary/10 flex items-center justify-center"
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand-primary"
          >
            <title>Success</title>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </motion.div>

        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-text-heading-light dark:text-text-heading-dark">
            Appointment request submitted
          </h3>
          <p className="text-text-para-light dark:text-text-para-dark leading-relaxed">
            Your request has been received. You’ll be contacted soon to confirm
            the schedule.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setSubmitted(false)}
          className="w-full h-14 text-lg"
        >
          Book Another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Patient Name"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+8801XXXXXXXXX"
          helperText="Format: +8801XXXXXXXXX"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Input
          label="Preferred Date"
          type="date"
          min={minDate}
          error={errors.preferredDate?.message}
          {...register("preferredDate")}
        />
      </div>
      <Select
        label="Preferred Time Slot"
        options={[
          { value: "10:00 AM", label: "10:00 AM" },
          { value: "10:30 AM", label: "10:30 AM" },
          { value: "11:00 AM", label: "11:00 AM" },
          { value: "11:30 AM", label: "11:30 AM" },
          { value: "12:00 PM", label: "12:00 PM" },
          { value: "04:00 PM", label: "04:00 PM" },
          { value: "04:30 PM", label: "04:30 PM" },
          { value: "05:00 PM", label: "05:00 PM" },
          { value: "05:30 PM", label: "05:30 PM" },
          { value: "06:00 PM", label: "06:00 PM" },
          { value: "06:30 PM", label: "06:30 PM" },
          { value: "07:00 PM", label: "07:00 PM" },
          { value: "07:30 PM", label: "07:30 PM" },
          { value: "08:00 PM", label: "08:00 PM" },
        ]}
        error={errors.preferredTime?.message}
        {...register("preferredTime")}
      />
      <Textarea
        label="Message (optional)"
        placeholder="Briefly describe your orthopedic concern..."
        error={errors.message?.message}
        maxLength={500}
        {...register("message")}
      />
      <Button
        type="submit"
        loading={appointmentMutation.isPending}
        className="w-full h-14 text-lg"
      >
        Submit Appointment Request
      </Button>
      <p className="text-[10px] text-center text-text-para-light dark:text-text-para-dark opacity-40 uppercase tracking-widest">
        A representative will contact you for final confirmation.
      </p>
    </form>
  );
};
