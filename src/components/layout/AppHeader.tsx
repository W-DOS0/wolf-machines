import { Bell, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import UserNow from "../../pages/UsersNow";
import { useUser } from "@/context/UserContext";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { mockAlerts } from "@/data/mockData";

export function AppHeader() {
  const { showUser, setShowUser } = useUser();

  const navigate = useNavigate();
  const unacknowledgedAlerts = mockAlerts.filter(alert => !alert.acknowledged);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4">
        {/* Sidebar Toggle */}
        <SidebarTrigger 
          className="flex items-center justify-center rounded-md p-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Seitenmenü ein-/ausblenden"
        />

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Maschinen, Aufgaben oder Alerts suchen..."
            className="pl-10 pr-4 w-full"
            aria-label="Suchfeld"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
       
      {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              aria-label={`Benachrichtigungen${unacknowledgedAlerts.length > 0 ? ` (${unacknowledgedAlerts.length} neue)` : ''}`}
            >
              <Bell className="h-4 w-4" />
              {unacknowledgedAlerts.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-1.5 text-xs"
                >
                  {unacknowledgedAlerts.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end">
            <DropdownMenuLabel>Benachrichtigungen</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {unacknowledgedAlerts.length === 0 ? (
              <DropdownMenuItem className="text-muted-foreground">
                Keine neuen Benachrichtigungen
              </DropdownMenuItem>
            ) : (
              unacknowledgedAlerts.slice(0, 5).map((alert) => (
                <DropdownMenuItem 
                  key={alert.id} 
                  className="flex flex-col items-start gap-1 p-3"
                  onClick={() => navigate('/machines/machine-003')}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-sm font-medium">{alert.title}</span>
                    <Badge 
                      variant={
                        alert.severity === 'critical' ? 'destructive' :
                        alert.severity === 'warnung' ? 'default' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {alert.message}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {alert.machineName}
                  </span>
                </DropdownMenuItem>
              ))
            )}
            {unacknowledgedAlerts.length > 5 && (
              <DropdownMenuItem className="text-center text-sm text-primary">
                {unacknowledgedAlerts.length - 5} weitere anzeigen...
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2"
                aria-label="Benutzermenü"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Admin</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mein Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowUser(true)}>Profil</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {showUser && <UserNow />}

    </header>
  );
}