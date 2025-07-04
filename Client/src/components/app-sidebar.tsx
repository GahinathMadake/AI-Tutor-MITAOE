//AppSidebar.tsx

import * as React from "react"
import {
  BookOpen,
  GraduationCap,
  Bell,
  Home,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { useAuth } from '@/hooks/useAuth';



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  console.log("User in AppSidebar:", user);

  const isStudent = user?.role === "STUDENT";
  const isTeacher = user?.role === "TEACHER";

  // Sample course data for students
  const sampleCourses = [
    {
      title: "Introduction to Programming",
      url: "/courses/intro-programming",
    },
    {
      title: "Data Structures",
      url: "/courses/data-structures", 
    },
    {
      title: "Web Development",
      url: "/courses/web-development",
    },
    {
      title: "Database Systems",
      url: "/courses/database-systems",
    },
    {
      title: "Software Engineering",
      url: "/courses/software-engineering",
    },
  ];

  // Navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      {
        title: "Site Home",
        url: "/home",
        icon: Home,
        items: [
            {
              title: "School of Computer Engineering and Technology",
              url: "/Site-Home/SCET",
            }, 
            {
              title: "School of Electrical Engineering",
              url: "/Site-Home/SEE",
            },
            {
              title: "School of Chemical Engineering",
              url: "/Site-Home/SCE",
            },
            {
              title: "School of Humanities and Engineering Sciences",
              url: "/Site-Home/SHES",
            },
            {
              title: "School of Mechanical and Civil Engineering",
              url: "/Site-Home/SMCE",
            },
            {
              title: "School of Design",
              url: "/Site-Home/SD",
            },
          ]
      },
      {
        title: "Notifications",
        url: "/notifications",
        icon: Bell,
      },
    ];

    if (isStudent) {
      return [
        {
          title: "My Courses",
          url: "/courses",
          icon: BookOpen,
          items: [
            {
              title: "View All Courses",
              url: "/courses/all",
            }, 
           ...sampleCourses,
          ],
        },
          ...baseItems,
      ];
    }

    if (isTeacher) {
      return [
        {
          title: "Courses",
          url: "/courses",
          icon: BookOpen,
          items: [
            {
              title: "View All Courses",
              url: "/courses/all",
            },
            {
              title: "Add Course",
              url: "/courses/add",
            },
             ...sampleCourses,
          ],
        },
          ...baseItems,
      ];
    }

    return baseItems;
  };

  const data = {
    user: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      avatar: user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() ?? '',
    },
    teams: [
      {
        name: "AI Course",
        logo: GraduationCap,
        plan: "Education",
      },
    ],
    navMain: getNavItems(),
    projects: isStudent ? sampleCourses : [],
  };


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}