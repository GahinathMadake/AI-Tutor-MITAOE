import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from '@/hooks/useAuth';
import StudentDashboardContent from "@/pages/Student/StudentDashboardContent";
import TeacherDashboardContent from "@/pages/Teacher/TeacherDashboardContent";

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isStudent = user?.role === "STUDENT";
  const isTeacher = user?.role === "TEACHER";

  return (
    <DashboardLayout 
      breadcrumbItems={[
        { label: "Dashboard", isCurrentPage: true }
      ]}
    >
      <div className="max-w-7xl p-6">
        {isStudent && <StudentDashboardContent />}
        {isTeacher && <TeacherDashboardContent />}
        {!isStudent && !isTeacher && (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="mt-2 text-muted-foreground">You do not have permission to view this page.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};