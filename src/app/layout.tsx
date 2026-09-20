import type { Metadata } from "next";
import "./globals.css";

// The design system's real font (typography/font/family/default, "Greed
// Standard-TRIAL") has no font file anywhere in this repo — see
// component-gaps.md. Falls back to the browser's default sans-serif via
// globals.css's `font-family: var(--typography-font-family-default),
// sans-serif` until a real font file is added; not Geist, which isn't the
// design system's font and would silently misrepresent it.

export const metadata: Metadata = {
  title: "Knowunity: Voice recall",
  description: "Voice-based active-recall prototype.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
