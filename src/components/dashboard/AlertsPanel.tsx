import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2,
  Clock,
  ExternalLink
} from "lucide-react";
import { Alert } from "@/types";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface AlertsPanelProps {
  alerts: Alert[];
  maxItems?: number;
}

export function AlertsPanel({ alerts, maxItems = 5 }: AlertsPanelProps) {
  const navigate = useNavigate();

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warnung':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'info':
        return <Info className="h-4 w-4 text-primary" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
      case 'error':
        return 'destructive';
      case 'warnung':
        return 'warnung';
      case 'info':
        return 'secondary';
      default:
        return 'secondary';
    }
  };
  

  const getTypeText = (type: Alert['type']) => {
    switch (type) {
      case 'maintenance':
        return 'Wartung';
      case 'performance':
        return 'Leistung';
      case 'quality':
        return 'Qualität';
      case 'safety':
        return 'Sicherheit';
      default:
        return 'System';
    }
  };

  const sortedAlerts = alerts
    .sort((a, b) => {
      // Unacknowledged first, then by severity, then by timestamp
      if (a.acknowledged !== b.acknowledged) {
        return a.acknowledged ? 1 : -1;
      }
      
      const severityOrder = { critical: 0, error: 1, warnung: 2, info: 3 };
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    })
    .slice(0, maxItems);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
          <div className="flex items-center gap-2">
  <Bell className="h-5 w-5" />
  <span>Nachrichten</span>
</div>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-8 w-8 text-success mb-2" />
            <p className="text-sm text-muted-foreground">
              Keine aktiven Meldungen
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] scrollbar-thin">
            <div className="space-y-3">
              {sortedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-lg border p-3 transition-smooth hover:shadow-sm ${
                    !alert.acknowledged ? 'border-l-4 border-l-destructive bg-destructive/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium text-foreground line-clamp-1">
                            {alert.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {alert.machineName}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge 
                            variant={getSeverityColor(alert.severity) as any}
                            className="text-xs"
                          >
                            {getTypeText(alert.type)}
                          </Badge>
                          {!alert.acknowledged && (
                            <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {alert.message}
                      </p>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {format(alert.timestamp, 'dd.MM.yyyy HH:mm', { locale: de })}
                        </span>
                        {alert.resolvedDate && (
                          <span className="text-success ml-2">
                            • Behoben
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}