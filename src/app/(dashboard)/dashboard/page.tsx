"use client";
import { CategoriesGraph } from "@/components/features/CategoriesGraph";
import ReportsList from "@/components/features/ReportsList";

export default function DashboardPage() {
  return (
    <div className="w-full p-15">
      <div className="grid gap-6 md:grid-cols-[75%_25%] items-start">
        <div className="w-full">
          <ReportsList />
        </div>
        <div className="w-full">
          <CategoriesGraph />
        </div>
      </div>
    </div>
  );
}
