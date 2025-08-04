"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { mockReports } from "@/data/mockData";
import { BarChart3 } from "lucide-react";

export default function Reports() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function downloadReport(type: "csv", report: any) {
    const blob = new Blob(
      [toCSV(report)],
      { type: "text/csv" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.machine}-${report.date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function toCSV(report: any): string {
    return `Maschine,Datum,Zusammenfassung,Details\n"${report.machine}","${report.date}","${report.summary}","${report.details}"`;
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
  <BarChart3 className="h-5 w-5" />
  <span>Berichte</span>
</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockReports.map((report) => (
            <div
              key={report.id}
              className="border rounded p-4 space-y-2 bg-background shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-lg">{report.machine}</div>
                  <div className="text-sm text-muted-foreground">
                    {report.date}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleExpand(report.id)}
                  >
                    {expandedId === report.id ? (
                      <>
                        Weniger <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Mehr <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadReport("csv", report)}
                  >
                    CSV
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">{report.summary}</div>

              {expandedId === report.id && (
                <div className="text-sm whitespace-pre-wrap">{report.details}</div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
