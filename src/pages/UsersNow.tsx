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
import { User } from "lucide-react";

const mockCurrentUser = {
  id: "user-001",
  firstname: "Max",
  lastname: "Mustermann",
  email: "max.mustermann@example.com",
  userId: "maxm",
  role: "Admin",
  permissions: {
    addMachines: true,
    editUsers: true,
    viewLogs: false,
  },
  password: "",
};

export default function UserProfilePage() {
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    setFormData({ ...mockCurrentUser, password: "" });
  }, []);

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
    // API-Call oder Zustandsspeicherung hier ergänzen
  }

  if (!formData) return null;

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Mein Profil bearbeiten
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstname">Vorname</Label>
              <Input
                id="firstname"
                value={formData.firstname}
                onChange={(e) => handleChange("firstname", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="lastname">Nachname</Label>
              <Input
                id="lastname"
                value={formData.lastname}
                onChange={(e) => handleChange("lastname", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="userid">Benutzer-ID</Label>
          <Input
            id="userid-profile"
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
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="password">Passwort ändern</Label>
              <Input
                id="password"
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
    </div>
  );
}
