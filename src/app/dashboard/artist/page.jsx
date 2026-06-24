"use client";

import { AppShell } from "@/components/AppShell";
import { DashboardContent } from "../page";

export default function ArtistDashboardPage() {
  return (
    <AppShell>
      <DashboardContent initialTab="artworks" requiredRole="artist" />
    </AppShell>
  );
}
