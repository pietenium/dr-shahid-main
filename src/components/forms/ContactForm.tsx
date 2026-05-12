"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { submitContact } from "@/lib/api/contact";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    if (!executeRecaptcha) {
      toast.error("ReCAPTCHA not initialized. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const token = await executeRecaptcha("contact_form");
      await submitContact({ ...data, recaptchaToken: token });
      toast.success("Message sent successfully! I'll get back to you soon.");
      reset();
    } catch (_error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
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
      <Input
        label="Subject"
        placeholder="How can I help you?"
        error={errors.subject?.message}
        {...register("subject")}
      />
      <Textarea
        label="Your Message"
        placeholder="Please describe your inquiry..."
        error={errors.message?.message}
        maxLength={1000}
        {...register("message")}
      />
      <Button type="submit" loading={loading} className="w-full h-14 text-lg">
        Send Message
      </Button>
      <p className="text-[10px] text-center text-text-para-light dark:text-text-para-dark opacity-40 uppercase tracking-widest">
        Protected by reCAPTCHA v3
      </p>
    </form>
  );
};
