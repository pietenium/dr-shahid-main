import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for Dr. Sahidur Rahman Khan's portfolio website.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <Breadcrumbs title="Terms of Use" />
        <h1 className="text-4xl font-bold">Terms of Use</h1>
        <p className="text-text-para-light dark:text-text-para-dark leading-relaxed">
          By using this website, you agree to these terms and conditions. The
          site is provided for informational purposes and does not establish a
          doctor-patient relationship.
        </p>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Use of Content</h2>
          <p className="text-text-para-light dark:text-text-para-dark leading-relaxed">
            Content shared on this website is for educational purposes only and
            should not be treated as medical advice. Always consult a qualified
            healthcare professional before making healthcare decisions.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Limitation of Liability</h2>
          <p className="text-text-para-light dark:text-text-para-dark leading-relaxed">
            The website owner is not liable for any losses or damages arising
            from the use of this site or the information presented here.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Contact</h2>
          <p className="text-text-para-light dark:text-text-para-dark leading-relaxed">
            If you have questions about these terms, please visit the{" "}
            <Link
              href="/contact"
              className="text-brand-primary hover:text-brand-hover"
            >
              contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
