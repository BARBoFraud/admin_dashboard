import { DashboardHeader } from "@/components/dashboard-header";
import { AdminList } from "@/components/admin-list";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <DashboardHeader />
      <div className="grid gap-6">
        <AdminList />
      </div>
    </div>
  );
}

