import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { mockAlerts } from "@/data/mockData";

export default function Alerts() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <AlertsPanel alerts={mockAlerts} />
    </div>
  );
}
