import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import Script from "next/script";
import { AppToaster } from "@/components/app-toaster";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const themeInitScript = `(() => {
  try {
    const theme = localStorage.getItem("fixmate-theme");
    if (theme === "dark") document.documentElement.classList.add("dark");
    if (theme === "light") document.documentElement.classList.remove("dark");
  } catch {}
})();`;

export const metadata: Metadata = {
  title: "FixMate — Repair with Confidence",
  description:
    "Find trusted technicians for smartphones, computers and home appliances. Book repairs with confidence and pay after the job is done.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${manrope.variable} min-h-full antialiased`}
    >
      <body className="min-h-full">
        <Script
          id="fixmate-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <a
          href="#main-content"
          className="sr-only rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to main content
        </a>
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
