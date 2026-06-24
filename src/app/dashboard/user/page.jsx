"use client";

import { AppShell } from "@/components/AppShell";
import { DashboardContent } from "../page";

export default function UserDashboardPage() {
  return (
    <AppShell>
      <DashboardContent initialTab="overview" requiredRole="user" />
    </AppShell>
  );
}
