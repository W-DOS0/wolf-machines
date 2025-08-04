
export interface Machine {
  id: string;
  name: string;
  type: 'production' | 'packaging' | 'quality' | 'assembly';
  status: 'running' | 'warning' | 'error' | 'maintenance' | 'offline';
  location: string;
  oee: number; // Overall Equipment Effectiveness (0-100)
  availability: number; // 0-100
  performance: number; // 0-100
  quality: number; // 0-100
  temperature: number;
  energyConsumption: number; // kW
  lastMaintenance: Date;
  nextMaintenance: Date;
  components: Component[];
  position?: { x: number; y: number }; // For machine editor
}

export interface Component {
  id: string;
  name: string;
  type: 'motor' | 'sensor' | 'belt' | 'bearing' | 'valve' | 'pump';
  condition: number; // 0-100 (100 = new, 0 = needs replacement)
  warningThreshold: number;
  errorThreshold: number;
  lastReplaced: Date;
  expectedLifetime: number; // days
}

export interface SensorData {
  timestamp: Date;
  machineId: string;
  type: 'temperature' | 'vibration' | 'pressure' | 'energy' | 'speed';
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface MaintenanceTask {
  id: string;
  machineId: string;
  machineName: string;
  type: 'preventive' | 'corrective' | 'predictive';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  estimatedDuration: number; // minutes
  scheduledDate: Date;
  completedDate?: Date;
  assignedTo: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  components: string[]; // component IDs
  notes?: string;
}

export interface KPI {
  id: string;
  name: string;
  value: number;
  unit: string;
  target: number;
  trend: 'up' | 'down' | 'stable';
  status: 'gut' | 'warning' | 'critical';
  change: number; // percentage change
}

export interface Alert {
  id: string;
  machineId: string;
  machineName: string;
  type: 'maintenance' | 'performance' | 'quality' | 'safety';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  resolvedDate?: Date;
}

export interface ProductionData {
  timestamp: Date;
  machineId: string;
  unitsProduced: number;
  defectiveUnits: number;
  targetProduction: number;
  efficiency: number;
}

// Chart data interfaces
export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface TimeSeriesData {
  name: string;
  data: ChartDataPoint[];
  color?: string;
}