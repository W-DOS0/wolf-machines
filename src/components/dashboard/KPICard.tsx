import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { KPI } from "@/types";

interface KPICardProps {
  kpi: KPI;
}

export function KPICard({ kpi }: KPICardProps) {
  const getTrendIcon = () => {
    switch (kpi.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />;
      case 'down':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (kpi.status) {
      case 'gut':
        return 'success';
      case 'warnung':
        return 'warnung';
      case 'critical':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getTrendColor = () => {
    if (kpi.trend === 'up' && kpi.value >= kpi.target) return 'text-success';
    if (kpi.trend === 'down' && kpi.value < kpi.target) return 'text-destructive';
    if (kpi.trend === 'up') return 'text-success';
    if (kpi.trend === 'down') return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <Card className="transition-smooth hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {kpi.name}
        </CardTitle>
        <Badge variant={getStatusColor() as any} className="text-xs">
          {kpi.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground truncate">
                  {kpi.value.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {kpi.unit}
                </span>
              </div>
              <div className="text-xs text-muted-foreground truncate">
                Ziel: {kpi.target.toLocaleString()} {kpi.unit}
              </div>
            </div>
            <div className={`flex items-center gap-1 text-sm flex-shrink-0 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="font-medium whitespace-nowrap">
                {kpi.change > 0 ? '+' : ''}{kpi.change}%
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Fortschritt</span>
              <span>{Math.round((kpi.value / kpi.target) * 100)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  kpi.status === 'gut' ? 'bg-success' :
                  kpi.status === 'warnung' ? 'bg-warnung' : 'bg-destructive'
                }`}
                style={{
                  width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}