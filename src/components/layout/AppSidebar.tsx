import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Cog,
  Wrench,
  Settings,
  Bell,
  BarChart3,
  Users,
  ChevronRight
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    description: "Übersicht & KPIs"
  },
  {
    title: "Maschinen",
    url: "/machines",
    icon: Cog,
    description: "Maschinendetails"
  },
  {
    title: "Wartungsplaner",
    url: "/maintenance",
    icon: Wrench,
    description: "Wartungsaufgaben"
  },
  {
    title: "Maschinen-Editor",
    url: "/editor",
    icon: Settings,
    description: "Layout bearbeiten"
  },
];

const secondaryItems = [
  {
    title: "Nachrichten",
    url: "/alerts",
    icon: Bell,
    description: "Benachrichtigungen"
  },
  {
    title: "Berichte",
    url: "/reports",
    icon: BarChart3,
    description: "Analysen & Reports"
  },
  {
    title: "Benutzer",
    url: "/users",
    icon: Users,
    description: "Benutzerverwaltung"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (active: boolean) =>
    `group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    }`;

  return (
    <Sidebar
      className={`border-r border-border transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
      collapsible="icon"
    >
    <SidebarHeader className="border-b border-border p-4">
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <img
            src={`${import.meta.env.BASE_URL}media/smartWhite.png`}
            alt="Logo"
            className="h-6 w-6 object-contain"
          />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold text-sidebar-foreground">
            Wolf Machines
          </h1>
          <p className="text-xs text-sidebar-foreground/60">
            Industrie Cockpit
          </p>
        </div>
      )}
    </div>
  </SidebarHeader>


      <SidebarContent className="px-3 py-4">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Hauptmenü
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={getNavClassName(active)}
                        title={collapsed ? `${item.title} - ${item.description}` : undefined}
                        aria-label={`${item.title} - ${item.description}`}
                      >
                        <item.icon 
                          className={`h-4 w-4 ${active ? "text-primary-foreground" : ""}`}
                          aria-hidden="true"
                        />
                        {!collapsed && (
                          <>
                            <span className="truncate">{item.title}</span>
                            {active && (
                              <ChevronRight className="ml-auto h-3 w-3 opacity-60" />
                            )}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary Navigation */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Erweitert
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={getNavClassName(active)}
                        title={collapsed ? `${item.title} - ${item.description}` : undefined}
                        aria-label={`${item.title} - ${item.description}`}
                      >
                        <item.icon 
                          className={`h-4 w-4 ${active ? "text-primary-foreground" : ""}`}
                          aria-hidden="true"
                        />
                        {!collapsed && (
                          <>
                            <span className="truncate">{item.title}</span>
                            {active && (
                              <ChevronRight className="ml-auto h-3 w-3 opacity-60" />
                            )}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}