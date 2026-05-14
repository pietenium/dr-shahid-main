import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CopyButton } from "@/components/ui/CopyButton";
import { getAppInfo } from "@/lib/api/app-info";

export const metadata: Metadata = {
  title: "Contact Dr. Sahidur",
  description:
    "Get in touch with Dr. Sahidur Rahman Khan for medical inquiries, consultations, or general feedback.",
};

export default async function ContactPage() {
  const appInfo = await getAppInfo().catch(() => undefined);
  const email = appInfo?.email ?? "contact@drshahidur.com";
  const phone = appInfo?.phone ?? "+880123456789";
  const address = appInfo?.address ?? "Dhaka, Bangladesh";
  const clinicHours = appInfo?.clinicHours ?? "Sat - Thu: 04:00 PM - 09:00 PM";
  const social = appInfo?.socialLinks ?? {};

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
                <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center shrink-0">
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
                    {address}
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center shrink-0">
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
                  <div className="space-y-2">
                    <a
                      href={`tel:${phone}`}
                      className="text-text-para-light dark:text-text-para-dark opacity-80 leading-relaxed hover:text-brand-primary transition-colors"
                    >
                      {phone}
                    </a>
                    <div className="flex items-center gap-2">
                      <CopyButton value={phone} label="Copy phone" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center shrink-0">
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
                    {clinicHours}
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center shrink-0">
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
                    <title>Email Icon</title>
                    <path d="M4 4h16v16H4z" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-text-heading-light dark:text-text-heading-dark">
                    Email
                  </h4>
                  <a
                    href={`mailto:${email}`}
                    className="text-text-para-light dark:text-text-para-dark opacity-80 leading-relaxed hover:text-brand-primary transition-colors"
                  >
                    {email}
                  </a>
                  <div className="flex items-center gap-2">
                    <CopyButton value={email} label="Copy email" />
                  </div>
                </div>
              </div>

              {appInfo?.mapEmbedUrl ? (
                <div className="rounded-3xl overflow-hidden border border-border-light dark:border-border-dark">
                  <iframe
                    title="Map"
                    src={appInfo.mapEmbedUrl}
                    className="w-full h-64"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-3">
                {(
                  [
                    ["Facebook", social.facebook],
                    ["Twitter", social.twitter],
                    ["LinkedIn", social.linkedin],
                    ["YouTube", social.youtube],
                    ["Instagram", social.instagram],
                  ] as const
                )
                  .filter(([, url]) => Boolean(url))
                  .map(([label, url]) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-xs font-bold uppercase tracking-widest text-text-para-light dark:text-text-para-dark hover:border-brand-primary/60 transition-colors"
                    >
                      {label}
                    </a>
                  ))}
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
