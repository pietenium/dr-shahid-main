import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { SectionHeading } from "@/components/shared/SectionHeading";

export const metadata: Metadata = {
  title: "Contact Dr. Sahidur",
  description:
    "Get in touch with Dr. Sahidur Rahman Khan for medical inquiries, consultations, or general feedback.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info Column */}
          <div className="space-y-12">
            <SectionHeading
              badge="Get in Touch"
              title="I'm Here to Help You Heal"
              subtitle="Whether you have a specific medical question or need guidance on orthopedic recovery, feel free to reach out."
            />

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <title>Contact Icon</title>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-text-heading-light dark:text-text-heading-dark">
                    Clinic Location
                  </h4>
                  <p className="text-text-para-light dark:text-text-para-dark opacity-80 leading-relaxed">
                    Modern Medical Center, Suite 402
                    <br />
                    House #12, Road #4, Dhanmondi
                    <br />
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <title>Contact Icon</title>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-text-heading-light dark:text-text-heading-dark">
                    Phone & WhatsApp
                  </h4>
                  <p className="text-text-para-light dark:text-text-para-dark opacity-80 leading-relaxed">
                    Clinic: +880 1234-56789
                    <br />
                    Support: +880 1987-65432
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <title>Contact Icon</title>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-text-heading-light dark:text-text-heading-dark">
                    Consultation Hours
                  </h4>
                  <p className="text-text-para-light dark:text-text-para-dark opacity-80 leading-relaxed">
                    Sat - Thu: 04:00 PM - 09:00 PM
                    <br />
                    Friday: Closed (Emergency only)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="bg-card-light dark:bg-card-dark rounded-3xl p-8 md:p-12 shadow-2xl border border-border-light dark:border-border-dark">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
