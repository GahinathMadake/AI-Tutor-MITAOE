import React from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from '@/components/mode-toggle';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const DashboardPage: React.FC = () => {

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4 flex-1">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </div>
      </header>
       </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardPage;



// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Separator } from '@/components/ui/separator';
// import { Loader2, User, Mail, School, Calendar, Settings, LogOut, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
// import { useAuth } from '../hooks/useAuth';
// import { getRoleName, ROLES } from '../utils/api';

// const DashboardPage: React.FC = () => {
//   const { 
//     user, 
//     logout, 
//     updateProfile, 
//     deleteAccount, 
//     isLoading, 
//     error, 
//     success, 
//     clearMessages 
//   } = useAuth();
  
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     name: user?.name || '',
//     prn: user?.prn || '',
//     role: user?.role || ROLES.STUDENT,
//     school: user?.school || ''
//   });

//   const handleInputChange = (field: string, value: string | number) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleSaveProfile = async (e: React.FormEvent) => {
//     e.preventDefault();
//     clearMessages();
//     await updateProfile(formData);
//     setIsEditing(false);
//   };

//   const handleCancelEdit = () => {
//     setFormData({
//       name: user?.name || '',
//       prn: user?.prn || '',
//       role: user?.role || ROLES.STUDENT,
//       school: user?.school || ''
//     });
//     setIsEditing(false);
//     clearMessages();
//   };

//   const handleLogout = async () => {
//     await logout();
//   };

//   const handleDeleteAccount = async () => {
//     await deleteAccount();
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//               <p className="text-gray-600">Welcome back, {user.name}!</p>
//             </div>
//             <Button onClick={handleLogout} variant="outline">
//               <LogOut className="mr-2 h-4 w-4" />
//               Logout
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Profile Card */}
//           <div className="lg:col-span-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <User className="h-5 w-5" />
//                   Profile Information
//                 </CardTitle>
//                 <CardDescription>
//                   View and update your profile information
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {/* Alerts */}
//                 {error && (
//                   <Alert variant="destructive" className="mb-4">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertDescription>{error}</AlertDescription>
//                   </Alert>
//                 )}
                
//                 {success && (
//                   <Alert className="mb-4">
//                     <CheckCircle className="h-4 w-4" />
//                     <AlertDescription>{success}</AlertDescription>
//                   </Alert>
//                 )}

//                 {isEditing ? (
//                   <form onSubmit={handleSaveProfile} className="space-y-4">
//                     <div>
//                       <label className="text-sm font-medium text-gray-700">Full Name</label>
//                       <Input
//                         type="text"
//                         value={formData.name}
//                         onChange={(e) => handleInputChange('name', e.target.value)}
//                         className="mt-1"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="text-sm font-medium text-gray-700">PRN</label>
//                       <Input
//                         type="text"
//                         value={formData.prn}
//                         onChange={(e) => handleInputChange('prn', e.target.value)}
//                         className="mt-1"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="text-sm font-medium text-gray-700">Role</label>
//                       <Select
//                         value={formData.role.toString()}
//                         onValueChange={(value) => handleInputChange('role', parseInt(value))}
//                       >
//                         <SelectTrigger className="mt-1">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value={ROLES.STUDENT.toString()}>Student</SelectItem>
//                           <SelectItem value={ROLES.TEACHER.toString()}>Teacher</SelectItem>
//                           <SelectItem value={ROLES.ADMIN.toString()}>Admin</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div>
//                       <label className="text-sm font-medium text-gray-700">School/Institution</label>
//                       <Input
//                         type="text"
//                         value={formData.school}
//                         onChange={(e) => handleInputChange('school', e.target.value)}
//                         className="mt-1"
//                       />
//                     </div>

//                     <div className="flex gap-2">
//                       <Button type="submit" disabled={isLoading}>
//                         {isLoading ? (
//                           <>
//                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                             Saving...
//                           </>
//                         ) : (
//                           <>
//                             <CheckCircle className="mr-2 h-4 w-4" />
//                             Save Changes
//                           </>
//                         )}
//                       </Button>
//                       <Button type="button" variant="outline" onClick={handleCancelEdit}>
//                         Cancel
//                       </Button>
//                     </div>
//                   </form>
//                 ) : (
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Full Name</label>
//                         <p className="text-gray-900">{user.name}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Email</label>
//                         <p className="text-gray-900">{user.email}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">PRN</label>
//                         <p className="text-gray-900">{user.prn}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Role</label>
//                         <p className="text-gray-900">{getRoleName(user.role || ROLES.STUDENT)}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">School/Institution</label>
//                         <p className="text-gray-900">{user.school || 'Not specified'}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Member Since</label>
//                         <p className="text-gray-900">
//                           {new Date(user.created_at).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                     <Button onClick={() => setIsEditing(true)} className="mt-4">
//                       <Settings className="mr-2 h-4 w-4" />
//                       Edit Profile
//                     </Button>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Account Actions */}
//           <div className="space-y-6">
//             {/* Quick Stats */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Account Status</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-600">Status</span>
//                     <span className="text-sm font-medium text-green-600 capitalize">
//                       {user.status}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-600">User ID</span>
//                     <span className="text-sm font-mono text-gray-900">
//                       {user.id.substring(0, 8)}...
//                     </span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Account Actions */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
//                 <CardDescription>
//                   Irreversible actions for your account
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Button
//                   onClick={handleDeleteAccount}
//                   variant="destructive"
//                   disabled={isLoading}
//                   className="w-full"
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Deleting...
//                     </>
//                   ) : (
//                     <>
//                       <Trash2 className="mr-2 h-4 w-4" />
//                       Delete Account
//                     </>
//                   )}
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default DashboardPage;