import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobHunter AI — Get Hired Faster",
  description: "Upload your resume. AI applies to 100 jobs/day. Land interviews automatically.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
