"use client";

import { AppShell } from "@/components/AppShell";
import { DashboardContent } from "../page";

export default function AdminDashboardPage() {
  return (
    <AppShell>
      <DashboardContent initialTab="admin" requiredRole="admin" />
    </AppShell>
  );
}


