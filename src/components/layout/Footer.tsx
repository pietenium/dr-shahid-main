"use client";

import Link from "next/link";
import { FOOTER_LINKS } from "@/constants/navigation";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-footer-bg text-footer-text pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <span className="font-bold text-xl text-white">Dr. Sahidur</span>
            </Link>
            <p className="text-sm leading-relaxed opacity-80">
              Dedicated Orthopedic Surgeon providing world-class orthopedic care
              and specialized surgical treatments. Committed to patient recovery
              and innovative medical research.
            </p>
            <div className="flex items-center gap-4">
              {/* Social placeholders - can be replaced with real links from appInfo */}
              {["facebook", "twitter", "linkedin", "instagram"].map(
                (social) => (
                  <a
                    key={social}
                    href="/"
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary transition-all duration-300"
                    aria-label={social}
                  >
                    <span className="sr-only">{social}</span>
                    {/* Icon placeholders */}
                    <div className="w-3 h-3 bg-white/40 rounded-full" />
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Quick Links */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title} className="space-y-6">
              <h4 className="text-white font-bold uppercase tracking-widest text-xs">
                {group.title}
              </h4>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-footer-hover transition-colors flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-[1px] bg-brand-primary transition-all mr-0 group-hover:mr-2" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter / Contact Hint */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">
              Emergency
            </h4>
            <p className="text-sm opacity-80">
              For urgent orthopedic inquiries or emergency appointments, please
              contact the clinic directly.
            </p>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <span className="block text-[10px] text-brand-primary font-bold uppercase tracking-wider">
                Call Center
              </span>
              <a
                href="tel:+880123456789"
                className="text-lg font-bold text-white hover:text-brand-primary transition-colors"
              >
                +880 1234-56789
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-medium uppercase tracking-[0.2em]">
          <p>© {currentYear} DR. SAHIDUR RAHMAN KHAN. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-8">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-white/20 hidden md:block">|</span>
            <span className="flex items-center gap-1">
              DESIGNED BY{" "}
              <span className="text-brand-primary">ANTIGRAVITY</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
