import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import { getAppInfo } from "@/lib/api/app-info";
import { QueryProvider } from "@/providers/QueryProvider";
import { RecaptchaProvider } from "@/providers/RecaptchaProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const appInfo = await getAppInfo();
    return {
      title: {
        default: appInfo.siteName,
        template: `%s | ${appInfo.siteName}`,
      },
      description:
        appInfo.siteDescription ??
        `${appInfo.doctorName} — ${appInfo.doctorSpecialty}`,
      openGraph: {
        siteName: appInfo.siteName,
        images: appInfo.ogImage ? [{ url: appInfo.ogImage.url }] : [],
      },
      metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      ),
    };
  } catch (_error) {
    return {
      title: "Dr. Sahidur Rahman Khan",
      description: "Orthopedic Surgeon Portfolio",
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await getAppInfo();
  } catch (error) {
    console.error("Failed to fetch app info in RootLayout", error);
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg-light dark:bg-bg-dark text-text-heading-light dark:text-text-heading-dark">
        <ThemeProvider>
          <QueryProvider>
            <RecaptchaProvider>
              {/* Header and Footer will be added in Phase 3 */}
              <main className="flex-1">{children}</main>
              <Toaster
                position="top-right"
                richColors
                toastOptions={{
                  style: { fontFamily: "var(--font-inter)" },
                }}
              />
            </RecaptchaProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
