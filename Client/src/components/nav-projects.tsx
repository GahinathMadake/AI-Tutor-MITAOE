import {
  type LucideIcon,
} from "lucide-react"
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

export function NavProjects({
  item,
}: {
  item: {
    name: string
    url: string
    icon: LucideIcon
  }
}) {

  return (
    <SidebarMenuItem key={item.name}>
      <SidebarMenuButton asChild>
        <Link to={item.url}>
          <item.icon />
          <span>{item.name}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
