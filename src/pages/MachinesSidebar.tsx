import React from "react";
import { mockMachines } from "@/data/mockData";
import { Icon } from "@iconify/react"; // Optional für Icons

export default function MachinesToolbar() {
  const onDragStart = (event: React.DragEvent, machine: any) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(machine));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-full border-b p-2 bg-white shadow-sm overflow-x-auto">
      <div className="flex flex-col space-y-1">
        <h2 className="text-sm font-medium text-gray-500 px-2">Maschinen</h2>
        <div className="flex space-x-2 pb-1">
          {mockMachines.map((machine) => (
            <div
              key={machine.id}
              draggable
              onDragStart={(event) => onDragStart(event, machine)}
              className="flex items-center cursor-grab active:cursor-grabbing rounded-lg border border-gray-200 px-3 py-2 bg-white hover:bg-blue-50 transition-colors shadow-xs"
            >
              <Icon 
                icon={machine.icon || "mdi:factory"} 
                className="text-blue-500 mr-2" 
                width={18} 
              />
              <span className="text-sm whitespace-nowrap">{machine.name}</span>
              <span className="ml-2 text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                {machine.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}