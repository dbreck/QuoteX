"use client";

import { AppShell } from "@/components/layout/AppShell";

export default function QuoteDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
