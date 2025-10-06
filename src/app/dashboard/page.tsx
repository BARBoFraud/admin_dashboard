import { DashboardHeader } from "@/components/dashboard-header";
import { AdminList } from "@/components/admin-list";
import RevisionReportes from "@/components/revision-reportes";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="p-5 max-w-7xl mx-auto">
        <div className="bg-background rounded-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-9 items-start">
            <div className="h-full">
              <RevisionReportes />
            </div>
            <div className="h-full">
              <AdminList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
