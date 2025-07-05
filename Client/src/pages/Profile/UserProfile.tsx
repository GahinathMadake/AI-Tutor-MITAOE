import { 
  User, 
  Mail, 
  CreditCard, 
  GraduationCap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { getSchoolName } from '@/utils/api';
import DashboardLayout from '@/components/layout/DashboardLayout';

export function UserProfile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No user data available</p>
        </div>
      </div>
    );
  }

  return (
     <DashboardLayout 
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "User Profile", isCurrentPage: true }
      ]}
    >
    <div className="max-w-4xl mx-auto p-6">
      <Card className="overflow-hidden">

        {/* Profile Details */}
        <CardContent className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <div>
                <CardTitle className="text-xl mb-2">Personal Information</CardTitle>
                <Separator />
              </div>
              
              <div className="space-y-4">
                <Card className="bg-muted/50">
                  <CardContent className="flex items-center space-x-3 p-4">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardContent className="flex items-center space-x-3 p-4">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email Address</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </CardContent>
                </Card>

                {user.prn && (
                  <Card className="bg-muted/50">
                    <CardContent className="flex items-center space-x-3 p-4">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">PRN</p>
                        <p className="font-medium">{user.prn}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-6">
              <div>
                <CardTitle className="text-xl mb-2">Academic Information</CardTitle>
                <Separator />
              </div>
              
              <div className="space-y-4">
                <Card className="bg-muted/50">
                  <CardContent className="flex items-center space-x-3 p-4">
                    <GraduationCap className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">School/Department</p>
                      <p className="font-medium">{getSchoolName(user.school || 'Not specified')}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-2">Role</p>
                    <Badge variant="outline" className="font-medium">
                      {user.role}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  );
}