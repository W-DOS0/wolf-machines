import { Machine, Component, MaintenanceTask, KPI, Alert, SensorData } from '@/types';
import { subDays, addDays, subHours, addHours } from 'date-fns';

// Mock Machines
export const mockMachines: Machine[] = [
  {
    id: "machine-001",
    name: "Produktionslinie A1",
    type: "produktion",
    status: "running",
    location: "Halle 1, Bereich A",
    gae: 87,
    availability: 92,
    performance: 89,
    quality: 96,
    temperature: 42.5,
    energyConsumption: 145.2,
    lastMaintenance: subDays(new Date(), 15),
    nextMaintenance: addDays(new Date(), 20),
    components: [
      {
        id: "comp-001",
        name: "Hauptmotor",
        type: "motor",
        condition: 78,
        warningThreshold: 30,
        errorThreshold: 15,
        lastReplaced: subDays(new Date(), 120),
        expectedLifetime: 365,
      },
      {
        id: "comp-002",
        name: "Förderband",
        type: "gürtel",
        condition: 65,
        warningThreshold: 25,
        errorThreshold: 10,
        lastReplaced: subDays(new Date(), 90),
        expectedLifetime: 180,
      },
    ],
    position: { x: 100, y: 50 },
  },
  {
    id: "machine-002",
    name: "Verpackungsanlage B2",
    type: "verpackung",
    status: "warnung",
    location: "Halle 2, Bereich B",
    gae: 73,
    availability: 88,
    performance: 82,
    quality: 94,
    temperature: 38.1,
    energyConsumption: 98.7,
    lastMaintenance: subDays(new Date(), 8),
    nextMaintenance: addDays(new Date(), 5),
    components: [
      {
        id: "comp-003",
        name: "Siegeleinheit",
        type: "sensor",
        condition: 25,
        warningThreshold: 30,
        errorThreshold: 15,
        lastReplaced: subDays(new Date(), 200),
        expectedLifetime: 240,
      },
    ],
    position: { x: 300, y: 150 },
  },
  {
    id: "machine-003",
    name: "Qualitätskontrolle C1",
    type: "qualität",
    status: "error",
    location: "Halle 1, Bereich C",
    gae: 45,
    availability: 65,
    performance: 70,
    quality: 98,
    temperature: 35.8,
    energyConsumption: 67.3,
    lastMaintenance: subDays(new Date(), 3),
    nextMaintenance: new Date(),
    components: [
      {
        id: "comp-004",
        name: "Kamera System",
        type: "sensor",
        condition: 12,
        warningThreshold: 20,
        errorThreshold: 10,
        lastReplaced: subDays(new Date(), 300),
        expectedLifetime: 365,
      },
    ],
    position: { x: 200, y: 250 },
  },
];


// Mock KPIs
export const mockKPIs: KPI[] = [
  {
    id: 'kpi-gae',
    name: 'Gesamt GAE',
    value: 82.3,
    unit: '%',
    target: 85,
    trend: 'up',
    status: 'warnung',
    change: 2.1
  },
  {
    id: 'kpi-availability',
    name: 'Verfügbarkeit',
    value: 91.5,
    unit: '%',
    target: 95,
    trend: 'stable',
    status: 'gut',
    change: 0.3
  },
  {
    id: 'kpi-energy',
    name: 'Energieverbrauch',
    value: 311.2,
    unit: 'kW',
    target: 350,
    trend: 'down',
    status: 'gut',
    change: -5.2
  },
  {
    id: 'kpi-efficiency',
    name: 'Produktionseffizienz',
    value: 88.7,
    unit: '%',
    target: 90,
    trend: 'up',
    status: 'gut',
    change: 3.4
  }
];

// Mock Maintenance Tasks
export const mockMaintenanceTasks: MaintenanceTask[] = [
  {
    id: 'task-001',
    machineId: 'machine-003',
    machineName: 'Qualitätskontrolle C1',
    type: 'corrective',
    priority: 'critical',
    title: 'Kamera System Austausch',
    description: 'Defektes Kamera System ersetzen - Qualitätskontrolle beeinträchtigt',
    estimatedDuration: 180,
    scheduledDate: new Date(),
    assignedTo: 'Max Mustermann',
    status: 'scheduled',
    components: ['comp-004']
  },
  {
    id: 'task-002',
    machineId: 'machine-002',
    machineName: 'Verpackungsanlage B2',
    type: 'preventive',
    priority: 'high',
    title: 'Siegeleinheit Wartung',
    description: 'Präventive Wartung der Siegeleinheit - Verschleiß erkannt',
    estimatedDuration: 120,
    scheduledDate: addDays(new Date(), 2),
    assignedTo: 'Anna Schmidt',
    status: 'scheduled',
    components: ['comp-003']
  },
  {
    id: 'task-003',
    machineId: 'machine-001',
    machineName: 'Produktionslinie A1',
    type: 'preventive',
    priority: 'medium',
    title: 'Planmäßige Inspektion',
    description: 'Vierteljährliche Inspektion aller Komponenten',
    estimatedDuration: 240,
    scheduledDate: addDays(new Date(), 15),
    assignedTo: 'Peter Weber',
    status: 'scheduled',
    components: ['comp-001', 'comp-002']
  },
  {
    id: 'task-004',
    machineId: 'machine-001',
    machineName: 'Produktionslinie A1',
    type: 'corrective',
    priority: 'low',
    title: 'Ölwechsel Hauptmotor',
    description: 'Routinemäßiger Ölwechsel des Hauptmotors',
    estimatedDuration: 60,
    scheduledDate: subDays(new Date(), 2),
    completedDate: subDays(new Date(), 2),
    assignedTo: 'Lisa Müller',
    status: 'completed',
    components: ['comp-001'],
    notes: 'Ölwechsel erfolgreich durchgeführt. Keine Auffälligkeiten.'
  }
];

// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    machineId: 'machine-003',
    machineName: 'Qualitätskontrolle C1',
    type: 'quality',
    severity: 'critical',
    title: 'Kamera System Ausfall',
    message: 'Qualitätskontrolle-Kamera nicht erreichbar. Produktion gestoppt.',
    timestamp: subHours(new Date(), 2),
    acknowledged: false
  },
  {
    id: 'alert-002',
    machineId: 'machine-002',
    machineName: 'Verpackungsanlage B2',
    type: 'maintenance',
    severity: 'warnung',
    title: 'Wartung fällig',
    message: 'Siegeleinheit erreicht Verschleißgrenze. Wartung in 5 Tagen geplant.',
    timestamp: subHours(new Date(), 6),
    acknowledged: true
  },
  {
    id: 'alert-003',
    machineId: 'machine-001',
    machineName: 'Produktionslinie A1',
    type: 'performance',
    severity: 'info',
    title: 'Effizienz verbessert',
    message: 'GAE-Wert um 2.1% gestiegen. Zielwert fast erreicht.',
    timestamp: subHours(new Date(), 12),
    acknowledged: true
  }
];

// Mock Sensor Data for Charts
export const generateMockSensorData = (machineId: string, hours: number = 24): SensorData[] => {
  const data: SensorData[] = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = subHours(now, i);
    
    data.push(
      {
        timestamp,
        machineId,
        type: 'temperature',
        value: 35 + Math.random() * 15 + Math.sin(i / 4) * 5,
        unit: '°C',
        status: 'normal'
      },
      {
        timestamp,
        machineId,
        type: 'energy',
        value: 100 + Math.random() * 100 + Math.sin(i / 6) * 30,
        unit: 'kW',
        status: 'normal'
      },
      {
        timestamp,
        machineId,
        type: 'vibration',
        value: Math.random() * 10 + Math.sin(i / 3) * 2,
        unit: 'mm/s',
        status: Math.random() > 0.9 ? 'warnung' : 'normal'
      }
    );
  }
  
  return data;
};

export const mockUsers = [
  {
    id: "u1",
    firstname: "Max",
    lastname: "Mustermann",
    email: "max@example.com",
    userId: "max123",
    role: "Admin",
    permissions: {
      addMachines: true,
      editUsers: true,
      viewLogs: true,
    },
  },
  {
    id: "u2",
    firstname: "Julia",
    lastname: "Beispiel",
    email: "julia@example.com",
    userId: "julia456",
    role: "Mitarbeiter",
    permissions: {
      addMachines: true,
      editUsers: false,
      viewLogs: true,
    },
  },
  {
    id: "u3",
    firstname: "Tom",
    lastname: "Lehrling",
    email: "tom@example.com",
    userId: "tom789",
    role: "Praktikant",
    permissions: {
      addMachines: false,
      editUsers: false,
      viewLogs: false,
    },
  },
];


export const mockReports = [
  {
    id: "1",
    machine: "Fräse A1",
    date: "2025-07-15",
    summary: "Wartung durchgeführt, keine Fehler festgestellt.",
    details: "Volle Inspektion durchgeführt. Alle Parameter im Normbereich. Schmierstoffe nachgefüllt.",
  },
  {
    id: "2",
    machine: "Drucker B3",
    date: "2025-07-10",
    summary: "Druckkopf gereinigt, Kalibrierung erfolgreich.",
    details: "Reinigung des Druckkopfes durchgeführt. Softwareupdate auf Version 2.4.3 eingespielt.",
  },
  {
    id: "3",
    machine: "Laser C7",
    date: "2025-06-30",
    summary: "Laserfokus angepasst, Temperaturwarnung erkannt.",
    details: "Laser justiert. Temperaturspitzen während Schicht 3 festgestellt. Empfehlung: zusätzliche Kühlung.",
  },
];


export const mockMaintenance = [
  {
    id: "m1",
    title: "Ölwechsel",
    machineId: "A1",
    machineName: "Produktionslinie A1",
    start: new Date(),
    end: new Date(new Date().getTime() + 1000 * 60 * 60),
  },
  {
    id: "m2",
    title: "Filter tauschen",
    machineId: "B2",
    machineName: "Verpackungsanlage B2",
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    end: new Date(new Date().setDate(new Date().getDate() + 2)),
  },
];
