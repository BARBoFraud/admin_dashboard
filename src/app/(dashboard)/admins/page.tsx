import AdminsList from "@/components/features/AdminsList";
import CreateAdminForm from "@/components/features/CreateAdminForm";

export default function AdminsPage() {
  return (
    <div>
      <h1>HOla admins</h1>
      <AdminsList />
      <CreateAdminForm />
    </div>
  );
}
