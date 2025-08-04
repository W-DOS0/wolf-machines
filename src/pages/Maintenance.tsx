"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { de } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useState } from "react";
import { mockMaintenance } from "@/data/mockData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";

const locales = {
  de,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function Maintenance() {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const events = mockMaintenance.map((e) => ({
    ...e,
    title: completedIds.includes(e.id) ? `✔ ${e.title}` : e.title,
    resource: e,
  }));

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event.resource);
  };

  const markAsDone = () => {
    if (selectedEvent) {
      setCompletedIds((prev) => [...prev, selectedEvent.id]);
      setSelectedEvent(null);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            Wartungsplaner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            onSelectEvent={handleSelectEvent}
            selectable
            views={["month", "week", "day"]}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: completedIds.includes(event.id)
                  ? "#ccc"
                  : "#2563eb",
                color: "#fff",
                textDecoration: completedIds.includes(event.id)
                  ? "line-through"
                  : "none",
              },
            })}
            popup
            longPressThreshold={300}
          />

        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          {selectedEvent && (
            <>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
              <DialogDescription asChild>
                <div id="dialog-description" className="sr-only">
                  Wartungsaufgabe Details
                </div>
              </DialogDescription>
              <DialogContent 
                className="max-w-md"
                aria-describedby="dialog-description"
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Aufgabenbeschreibung:</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedEvent.title || "Keine zusätzliche Beschreibung vorhanden"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Maschine:</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedEvent.machineName} ({selectedEvent.machineId})
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Datum:</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(selectedEvent.start), "PPPpp", { locale: locales.de })}
                    </p>
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  {completedIds.includes(selectedEvent.id) ? (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setCompletedIds((prev) => prev.filter((id) => id !== selectedEvent.id));
                        setSelectedEvent(null);
                      }}
                    >
                      Als unerledigt markieren
                    </Button>
                  ) : (
                    <Button onClick={markAsDone}>Als erledigt markieren</Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </>
          )}
        </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}