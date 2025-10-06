import { DashboardHeader } from "@/components/dashboard-header";
import { AdminList } from "@/components/admin-list";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="p-8 max-w-7xl mx-auto">
        <div className="bg-card rounded-md p-6">
          <div className="grid gap-6">
            <AdminList />
          </div>
        </div>
      </main>
    </div>
  );
}


