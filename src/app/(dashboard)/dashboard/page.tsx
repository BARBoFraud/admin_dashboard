"use client";
import { CategoriesGraph } from "@/components/features/CategoriesGraph";
import ReportsAccepted from "@/components/features/ReportsAccepted";
import ReportsList from "@/components/features/ReportsList";
import ReportsRejected from "@/components/features/ReportsRejected";

export default function DashboardPage() {
  return (
    <div className="w-full p-15">
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-[75%_25%] items-start">
          <div className="w-full h-[75vh]">
            <ReportsList />
          </div>
          <div className="w-full h-[75vh] flex flex-col gap-4">
            <div className="flex-1">
              <CategoriesGraph />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[20%_80%] items-start">
          <div className="grid gap-6 md:grid-cols-[75%_25%] items-start">
            <div className="flex flex-col items-center justify-center w-full h-[75vh]">
              <h2 className="text-5xl font-bold text-gray-800 dark:text-white text-center mb-2">
                Reportes ya revisados
              </h2>
              <div className="w-40 h-1 bg-primary rounded-full" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-[50%_50%] items-start">
            <div className="w-full h-[75vh]">
              <ReportsAccepted />
            </div>
            <div className="w-full h-[75vh]">
              <ReportsRejected />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
