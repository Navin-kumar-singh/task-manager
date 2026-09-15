import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Task Log",
  description: "Track today's work and generate a shareable end-of-day report.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
