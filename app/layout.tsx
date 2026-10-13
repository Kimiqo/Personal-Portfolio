import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import CaseControls from "@/components/CaseControls";

export const metadata: Metadata = {
  title: "MICHAEL DARKO — Kimiko Labs",
  description: "Explore Michael Kweku Kissi Darko’s interactive portfolio: software engineering, web development, data analytics, and a cozy 3D studio.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-theme="dark" suppressHydrationWarning><body><ThemeProvider>{children}<CaseControls/></ThemeProvider></body></html>;
}
