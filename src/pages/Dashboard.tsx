import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Legend } from "recharts";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

import { 
  Activity, 
  TrendingUp, 
  Users, 
  Zap,
  RefreshCw,
  BarChart3,
  AlertTriangle
} from "lucide-react";

import { KPICard } from "../components/dashboard/KPICard";
import { MachineStatusCard } from "../components/dashboard/MachineStatusCard";
import { AlertsPanel } from "../components/dashboard/AlertsPanel";

import { 
  mockKPIs, 
  mockMachines, 
  mockAlerts,
  generateMockSensorData 
} from "../data/mockData";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";

export default function Dashboard() {
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate chart data
  const energyData = generateMockSensorData('all', 24)
    .filter(data => data.type === 'energy')
    .map(data => ({
      time: new Date(data.timestamp).toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      value: Math.round(data.value),
      timestamp: data.timestamp
    }))
    .slice(0, 12); // Last 12 hours

  const machineStatusData = mockMachines.map(machine => ({
    name: machine.name.split(' ')[0], // Short name
    gae: machine.gae,
    availability: machine.availability,
    performance: machine.performance,
    quality: machine.quality
  }));

const statusDistribution = [
  { name: 'Läuft', value: 4, color: '#10b981' },        
  { name: 'Warnung', value: 2, color: '#efc729ff' },       
  { name: 'Fehler', value: 1, color: '#ef4444' },       
  { name: 'Wartung', value: 1, color: '#6b7280' },      
  { name: 'Offline', value: 0, color: '#1964d5ff' },     
].filter(item => item.value > 0);


  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const activeAlerts = mockAlerts.filter(alert => !alert.acknowledged);
  const criticalMachines = mockMachines.filter(machine => 
    machine.status === 'error' || machine.status === 'warning'
  );

  const chartConfig = {
    energy: {
      label: "Energieverbrauch",
      color: "hsl(var(--primary))",
    },
    gae: {
      label: "GAE",
      color: "hsl(var(--primary))",
    },
    availability: {
      label: "Verfügbarkeit",
      color: "hsl(var(--success))",
    },
    performance: {
      label: "Leistung",
      color: "hsl(var(--warnung))",
    },
    quality: {
      label: "Qualität",
      color: "hsl(var(--accent))",
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </h1>
          <p className="text-muted-foreground">
            Übersicht über alle Produktionsanlagen und KPIs
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            Zuletzt aktualisiert: {lastUpdated.toLocaleTimeString('de-DE')}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Aktualisieren
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
 {activeAlerts.length > 0 && (
      <Card
        className="border-l-4 border-l-destructive bg-destructive/5 cursor-pointer"
        onClick={() => navigate('/machines/machine-003')}
      >
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <h3 className="font-semibold text-destructive">
                {activeAlerts.length} aktive Meldung{activeAlerts.length !== 1 ? 'en' : ''}
              </h3>
              <p className="text-sm text-muted-foreground">
                Sofortige Aufmerksamkeit erforderlich
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )}

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockKPIs.map((kpi) => (
          <KPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="machines">Maschinen</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Energy Consumption Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-5 w-5 text-primary" />
                  Energieverbrauch (24h)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-[280px] w-full">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={energyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="time" 
                          fontSize={12}
                          tickMargin={8}
                          axisLine={false}
                        />
                        <YAxis 
                          fontSize={12}
                          tickMargin={8}
                          axisLine={false}
                          width={40}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

          {/* Machine Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-5 w-5 text-primary" />
                Maschinenstatus
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[280px] w-full lg:w-[450px]"> 
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: -20, right: 20, bottom: -20, left: 20 }}>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        formatter={(value: any, entry: any) => {
                          const color = entry?.color || "#000";
                          return <span style={{ color }}>{value}</span>;
                        }}
                        wrapperStyle={{ marginTop: 10 }}  
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

           </div>

          {/* Alerts Panel */}
          <AlertsPanel alerts={mockAlerts} />
          </TabsContent>

          {/* Machines Tab */}
          <TabsContent value="machines" className="space-y-6">
            {criticalMachines.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-destructive">
                  Maschinen mit Problemen ({criticalMachines.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {criticalMachines.map((machine) => (
                    <MachineStatusCard key={machine.id} machine={machine} />
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Alle Maschinen ({mockMachines.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockMachines.map((machine) => (
                  <MachineStatusCard key={machine.id} machine={machine} />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  GAE Vergleich
                </CardTitle>
              </CardHeader>
            <CardContent className="p-4 overflow-hidden">
              <div className="h-[100%] w-full">
                <div className="flex justify-around text-sm font-medium mb-2">
  {machineStatusData.map((d) => (
    <span key={d.name}>{d.name}</span>
  ))}
</div>

                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={machineStatusData} 
                      margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                      barCategoryGap="20%"
                    >
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis hide />

                      <YAxis 
                        domain={[0, 100]} 
                        fontSize={12}
                        tickMargin={8}
                        axisLine={false}
                        width={40}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend 
                        content={<ChartLegendContent />} 
                        wrapperStyle={{ fontSize: '12px' }}
                      />
                      <Bar dataKey="gae" fill="hsl(var(--primary))" name="gae" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="availability" fill="hsl(var(--success))" name="Verfügbarkeit" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="performance" fill="hsl(var(--warnung))" name="Leistung" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="quality" fill="hsl(var(--accent))" name="Qualität" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}