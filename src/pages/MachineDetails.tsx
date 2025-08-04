"use client";

import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Thermometer, Zap, Calendar, MapPin, AlertTriangle } from "lucide-react";
import { mockMachines } from "@/data/mockData";
import { format, subDays, addDays } from "date-fns";
import { de } from "date-fns/locale";
import MachineModelViewer from "./MachineModelViewer";

export default function MachineDetails() {
  const { id } = useParams();
  const machine = mockMachines.find((m) => m.id === id);

  if (!machine) {
    return (
      <div className="flex-1 p-6">
        <p>Maschine mit ID <strong>{id}</strong> nicht gefunden.</p>
      </div>
    );
  }

  const getStatusColor = () => {
    switch (machine.status) {
      case "running":
        return "success";
      case "warnung":
        return "warnung";
      case "error":
        return "destructive";
      case "maintenance":
      case "offline":
      default:
        return "secondary";
    }
  };

  const getStatusText = () => {
    switch (machine.status) {
      case "running":
        return "Läuft";
      case "warnung":
        return "Warnung";
      case "error":
        return "Fehler";
      case "maintenance":
        return "Wartung";
      case "offline":
        return "Offline";
      default:
        return "Unbekannt";
    }
  };

  const needsAttention = machine.status === "error" || machine.status === "warnung";

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <Card className={`${needsAttention ? "border-l-4 border-l-destructive" : ""}`}>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl font-semibold">{machine.name}</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4" />
                <span>{machine.location}</span>
              </div>
            </div>
            <Badge variant={getStatusColor()} className="uppercase text-sm">
              {getStatusText()}
            </Badge>
            {needsAttention && <AlertTriangle className="h-5 w-5 text-destructive" />}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
           {/* 3D MODEL ANSICHT */}
          <section>
            <h3 className="font-semibold mb-2">3D Ansicht</h3>
              <MachineModelViewer modelPath={`${import.meta.env.BASE_URL}media/${machine.type}.glb`} />
          </section>
          {/* GAE */}
          <section>
            <h3 className="font-semibold mb-2">Gesamtanlageneffektivität (GAE)</h3>
            <div className="flex justify-between text-sm mb-1">
              <span>GAE</span>
              <span className="font-bold">{machine.gae}%</span>
            </div>
            <Progress
              value={machine.gae}
              className="h-3 rounded"
              style={{
                ["--progress-foreground" as any]:
                  machine.gae >= 80
                    ? "hsl(var(--success))"
                    : machine.gae >= 60
                    ? "hsl(var(--warnung))"
                    : "hsl(var(--destructive))",
              }}
            />
          </section>

          {/* KPIs */}
          <section className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground text-xs">Verfügbarkeit</div>
              <div className="font-semibold">{machine.availability}%</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Leistung</div>
              <div className="font-semibold">{machine.performance}%</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Qualität</div>
              <div className="font-semibold">{machine.quality}%</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Maschinentyp</div>
              <div className="font-semibold capitalize">{machine.type}</div>
            </div>
          </section>

          {/* Sensor Daten */}
          <section className="flex gap-6 text-sm text-muted-foreground border-t border-border pt-4">
            <div className="flex items-center gap-1">
              <Thermometer className="h-5 w-5" />
              <span>{machine.temperature.toFixed(1)}°C</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-5 w-5" />
              <span>{machine.energyConsumption.toFixed(1)} kW</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-5 w-5" />
              <span>
                Nächste Wartung: {format(machine.nextMaintenance, "dd.MM.yyyy", { locale: de })}
              </span>
            </div>
          </section>

          {/* Komponenten */}
          <section>
            <h3 className="font-semibold mb-2">Komponenten</h3>
            <div className="space-y-3 max-h-64 overflow-auto border border-border rounded p-3 bg-muted">
              {machine.components.map((comp) => {
                const conditionPercent = comp.condition;
                let color = "text-success";
                if (conditionPercent < comp.errorThreshold) color = "text-destructive";
                else if (conditionPercent < comp.warnungThreshold) color = "text-warning";

                return (
                  <div key={comp.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                    <div>
                      <p className="font-semibold">{comp.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{comp.type}</p>
                      <p className="text-xs text-muted-foreground">
                        Letzter Austausch: {format(comp.lastReplaced, "dd.MM.yyyy", { locale: de })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${color}`}
                        title={`Zustand: ${conditionPercent}% (Warnung: ${comp.warnungThreshold}%, Fehler: ${comp.errorThreshold}%)`}
                      >
                        Zustand: {conditionPercent}%
                      </p>
                      <Progress
                        value={conditionPercent}
                        className="h-2 rounded"
                        style={{
                          ["--progress-foreground" as any]:
                            conditionPercent >= comp.warnungThreshold
                              ? "hsl(var(--success))"
                              : conditionPercent >= comp.errorThreshold
                              ? "hsl(var(--warnung))"
                              : "hsl(var(--destructive))",
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Erwartete Lebensdauer: {comp.expectedLifetime} Tage
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
