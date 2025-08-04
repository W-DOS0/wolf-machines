import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { mockUsers } from "@/data/mockData";

export default function UsersPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    mockUsers[0]?.id || null
  );
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const user = mockUsers.find((u) => u.id === selectedUserId);
    if (user) {
      setFormData({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        userId: user.userId,
        role: user.role,
        permissions: { ...user.permissions },
        password: "",
      });
    }
  }, [selectedUserId]);

  function handleChange(field: string, value: string) {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  }

  function handlePermissionChange(field: string, checked: boolean) {
    setFormData((prev: any) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [field]: checked,
      },
    }));
  }

  function handleSave() {
    console.log("Daten speichern:", formData);
    // Hier später API-Call oder Zustandsspeicherung implementieren
  }

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>Benutzerliste</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`block w-full text-left rounded px-3 py-2 text-sm hover:bg-muted ${
                    user.id === selectedUserId ? "bg-muted font-semibold" : ""
                  }`}
                >
                  {user.firstname} {user.lastname}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          {formData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Benutzer bearbeiten
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstname">Vorname</Label>
                  <Input
  id={`firstname-${selectedUserId}`}
  value={formData.firstname}
  onChange={(e) => handleChange("firstname", e.target.value)}
/>
                  </div>

                  <div>
                    <Label htmlFor="lastname">Nachname</Label>
                    <Input
                    id={`lastname-${selectedUserId}`}
                      value={formData.lastname}
                      onChange={(e) => handleChange("lastname", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="userid">Benutzer-ID</Label>
                    <Input
                      id="userid"
                      value={formData.userId}
                      onChange={(e) => handleChange("userId", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Rolle</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleChange("role", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Rolle auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Mitarbeiter">Mitarbeiter</SelectItem>
                        <SelectItem value="Praktikant">Praktikant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Berechtigungen</Label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                      <Checkbox
                        id="perm1"
                        checked={formData.permissions.addMachines}
                        onCheckedChange={(checked) =>
                          handlePermissionChange("addMachines", Boolean(checked))
                        }
                      />
                      <span>Kann Maschinen hinzufügen</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        id="perm2"
                        checked={formData.permissions.editUsers}
                        onCheckedChange={(checked) =>
                          handlePermissionChange("editUsers", Boolean(checked))
                        }
                      />
                      <span>Kann Benutzer bearbeiten</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        id="perm3"
                        checked={formData.permissions.viewLogs}
                        onCheckedChange={(checked) =>
                          handlePermissionChange("viewLogs", Boolean(checked))
                        }
                      />
                      <span>Hat Zugriff auf Logs</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">E-Mail</Label>
                    <Input
                      id="emails"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Passwort ändern</Label>
                    <Input
                      id="passwords"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="Neues Passwort"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={handleSave}>Speichern</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Kein Benutzer ausgewählt
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
