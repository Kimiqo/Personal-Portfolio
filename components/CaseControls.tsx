"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
export default function CaseControls() {
  const path = usePathname();
  if (!path.startsWith("/work/")) return null;
  return <div className="case-controls">{process.env.NODE_ENV === "development" && <Link href="/concepts">Design options ↗</Link>}<ThemeToggle/></div>;
}
