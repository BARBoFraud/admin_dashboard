"use client";
import { CategoriesGraph } from "@/components/features/CategoriesGraph";
import ReportsList from "@/components/features/ReportsList";

export default function DashboardPage() {
  return (
    <div>
      <ReportsList />
      <CategoriesGraph />
    </div>
  );
}
