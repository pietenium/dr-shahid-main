import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Dr. Sahidur Rahman Khan's portfolio website.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <Breadcrumbs title="Privacy Policy" />
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-text-para-light dark:text-text-para-dark leading-relaxed">
          We value your privacy and are committed to protecting your personal
          information. This policy explains how we collect, use, and secure the
          data shared through this site.
        </p>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Information We Collect</h2>
          <p className="text-text-para-light dark:text-text-para-dark leading-relaxed">
            We may collect details you voluntarily provide through contact or
            appointment forms, such as your name, phone number, email address,
            and appointment preferences.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">How We Use It</h2>
          <p className="text-text-para-light dark:text-text-para-dark leading-relaxed">
            Your information is used to respond to inquiries, process
            appointments, and improve the website experience. We do not sell or
            share your data with third parties for marketing purposes.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Cookies</h2>
          <p className="text-text-para-light dark:text-text-para-dark leading-relaxed">
            This site uses cookies to store user preferences and improve
            functionality. You may choose to accept cookies via the consent
            banner displayed on the site.
          </p>
        </section>
        <p className="text-sm text-text-para-light dark:text-text-para-dark opacity-70">
          For further questions, please visit{" "}
          <Link
            href="/contact"
            className="text-brand-primary hover:text-brand-hover"
          >
            Contact
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
