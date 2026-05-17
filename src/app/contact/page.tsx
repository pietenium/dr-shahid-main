import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
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

  return (
    <div className="container mx-auto px-6 pt-32 pb-20 space-y-24">
      {/* Top Content: Breadcrumbs and Grid wrapped in max-w-5xl for compact, balanced sizing */}
      <div className="max-w-5xl mx-auto w-full">
        <Breadcrumbs title="Contact" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mt-10">
          {/* Info Column */}
          <div className="space-y-12">
            <SectionHeading
              badge="Get in Touch"
              title="I'm Here to Help You Heal"
              subtitle="Whether you have a specific medical question or need guidance on orthopedic recovery, feel free to reach out."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Location Card */}
              <div className="p-5 bg-white dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark hover:border-brand-primary/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group flex flex-col gap-3">
                <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <title>Contact Icon</title>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-heading-light dark:text-text-heading-dark">
                    Clinic Location
                  </h4>
                  <p className="text-text-para-light dark:text-text-para-dark opacity-80 leading-relaxed text-xs mt-1">
                    {address}
                  </p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="p-5 bg-white dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark hover:border-brand-primary/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group flex flex-col gap-3">
                <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <title>Contact Icon</title>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-heading-light dark:text-text-heading-dark">
                    Phone & WhatsApp
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <a
                      href={`tel:${phone.replace(/\D/g, "")}`}
                      className="text-text-para-light dark:text-text-para-dark opacity-80 leading-relaxed text-xs hover:text-brand-primary transition-colors font-semibold"
                    >
                      {phone}
                    </a>
                    <CopyButton
                      value={phone}
                      label="copy"
                      className="px-1.5 py-0.5 text-[8px] rounded-md font-semibold tracking-normal lowercase h-fit border border-border-light dark:border-border-dark"
                    />
                  </div>
                </div>
              </div>

              {/* Consultation Hours Card */}
              <div className="p-5 bg-white dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark hover:border-brand-primary/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group flex flex-col gap-3">
                <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <title>Contact Icon</title>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-heading-light dark:text-text-heading-dark">
                    Consultation Hours
                  </h4>
                  <p className="text-text-para-light dark:text-text-para-dark opacity-80 leading-relaxed text-xs mt-1">
                    {clinicHours}
                  </p>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-5 bg-white dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark hover:border-brand-primary/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group flex flex-col gap-3">
                <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <title>Email Icon</title>
                    <path d="M4 4h16v16H4z" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-heading-light dark:text-text-heading-dark">
                    Email Address
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <a
                      href={`mailto:${email}`}
                      className="text-text-para-light dark:text-text-para-dark opacity-80 leading-relaxed text-xs hover:text-brand-primary transition-colors break-all font-semibold"
                    >
                      {email}
                    </a>
                    <CopyButton
                      value={email}
                      label="copy"
                      className="px-1.5 py-0.5 text-[8px] rounded-md font-semibold tracking-normal lowercase h-fit border border-border-light dark:border-border-dark shrink-0"
                    />
                  </div>
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

      {appInfo?.mapEmbedUrl ? (
        <section className="max-w-5xl mx-auto w-full pt-8 border-t border-border-light dark:border-border-dark">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold tracking-widest uppercase mb-3">
                  Find Our Clinic
                </span>
                <h3 className="text-2xl font-bold text-text-heading-light dark:text-text-heading-dark leading-tight">
                  Interactive Directions
                </h3>
              </div>
              <p className="text-sm text-text-para-light dark:text-text-para-dark opacity-80 max-w-sm leading-relaxed">
                Located conveniently in Dhaka, with fully equipped modern
                consulting chambers.
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden border border-border-light dark:border-border-dark shadow-xl h-[350px]">
              <iframe
                title="Map"
                src={appInfo.mapEmbedUrl}
                className="w-full h-full border-none"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
