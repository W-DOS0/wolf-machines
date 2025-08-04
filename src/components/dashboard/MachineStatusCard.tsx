import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Thermometer, 
  Zap, 
  Calendar, 
  MapPin, 
  Settings, 
  ExternalLink,
  AlertTriangle
} from "lucide-react";
import { Machine } from "@/types";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface MachineStatusCardProps {
  machine: Machine;
}

export function MachineStatusCard({ machine }: MachineStatusCardProps) {
  const navigate = useNavigate();

  const getStatusColor = () => {
    switch (machine.status) {
      case 'running':
        return 'success';
      case 'warnung':
        return 'warnung';
      case 'error':
        return 'destructive';
      case 'maintenance':
        return 'secondary';
      case 'offline':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusText = () => {
    switch (machine.status) {
      case 'running':
        return 'Läuft';
      case 'warnung':
        return 'Warnung';
      case 'error':
        return 'Fehler';
      case 'maintenance':
        return 'Wartung';
      case 'offline':
        return 'Offline';
      default:
        return 'Unbekannt';
    }
  };

  const needsAttention = machine.status === 'error' || machine.status === 'warnung';

  return (
    <Card className={`transition-smooth hover:shadow-md ${needsAttention ? 'border-l-4 border-l-destructive' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <CardTitle className="text-lg font-semibold truncate">
              {machine.name}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{machine.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {needsAttention && (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            )}
            <Badge variant={getStatusColor() as any} className="whitespace-nowrap">
              {getStatusText()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* GAE Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium truncate">GAE</span>
            <span className="font-bold">{machine.gae}%</span>
          </div>
          <Progress 
            value={machine.gae} 
            className="h-2"
            style={{
              ['--progress-foreground' as any]: machine.gae >= 80 ? 'hsl(var(--success))' :
                machine.gae >= 60 ? 'hsl(var(--warnung))' : 'hsl(var(--destructive))'
            }}
          />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1 min-w-0">
            <div className="text-muted-foreground text-xs">Verfügbarkeit</div>
            <div className="font-semibold">{machine.availability}%</div>
          </div>
          <div className="space-y-1 min-w-0">
            <div className="text-muted-foreground text-xs">Leistung</div>
            <div className="font-semibold">{machine.performance}%</div>
          </div>
          <div className="space-y-1 min-w-0">
            <div className="text-muted-foreground text-xs">Qualität</div>
            <div className="font-semibold">{machine.quality}%</div>
          </div>
          <div className="space-y-1 min-w-0">
            <div className="text-muted-foreground text-xs">Typ</div>
            <div className="font-semibold capitalize truncate">{machine.type}</div>
          </div>
        </div>

        {/* Sensor Data */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-4 text-sm min-w-0">
            <div className="flex items-center gap-1 min-w-0">
              <Thermometer className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="whitespace-nowrap">{machine.temperature.toFixed(1)}°C</span>
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <Zap className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="whitespace-nowrap">{machine.energyConsumption.toFixed(1)} kW</span>
            </div>
          </div>
        </div>

        {/* Maintenance Info */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              Nächste Wartung: {format(machine.nextMaintenance, 'dd.MM.yyyy', { locale: de })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => navigate(`/machines/${machine.id}`)}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}