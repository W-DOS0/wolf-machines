import { MachineStatusCard } from "@/components/dashboard/MachineStatusCard";
import { mockMachines } from "@/data/mockData";
import { LayoutDashboard } from "lucide-react";

export default function Machines() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
       <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <LayoutDashboard className="h-5 w-5" />
              <span>Maschinen</span>
            </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockMachines.map(machine => (
          <MachineStatusCard key={machine.id} machine={machine} />
        ))}
      </div>
    </div>
  );
}
