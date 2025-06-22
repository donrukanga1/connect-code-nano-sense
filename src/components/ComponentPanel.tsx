import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Cpu,
  Lightbulb,
  Thermometer,
  Activity,
  Mic,
  Gauge,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useComponentManager } from "@/hooks/useComponentManager";
import { Component } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

interface ComponentSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  components: ComponentTemplate[];
}

interface ComponentTemplate {
  id: string;
  type: 'sensor' | 'actuator' | 'input';
  name: string;
  description: string;
  icon?: React.ReactNode;
  blockType: string;
}

export const ComponentSelector = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(["basics", "sensors", "io"]);
  const { selectedComponents, addComponent, removeComponent } = useComponentManager();

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  }, []);

  const componentSections: ComponentSection[] = [
    {
      id: "basics",
      title: "Arduino Basics",
      icon: <Cpu className="w-4 h-4" />,
      color: "bg-blue-500/20 border-blue-500/30",
      components: [
        {
          id: "setup",
          type: "actuator",
          name: "Setup",
          description: "Initialization code",
          blockType: "controls_setup",
        },
      ],
    },
    {
      id: "sensors",
      title: "Nano 33 BLE Sensors",
      icon: <Activity className="w-4 h-4" />,
      color: "bg-green-500/20 border-green-500/30",
      components: [
        {
          id: "imu",
          type: "sensor",
          name: "IMU",
          description: "Motion sensor (LSM6DS3)",
          icon: <Activity className="w-3 h-3" />,
          blockType: "component_imu",
        },
        {
          id: "microphone",
          type: "sensor",
          name: "Microphone",
          description: "MP34DT05 sensor",
          icon: <Mic className="w-3 h-3" />,
          blockType: "component_microphone",
        },
      ],
    },
    {
      id: "io",
      title: "Digital/Analog I/O",
      icon: <Lightbulb className="w-4 h-4" />,
      color: "bg-yellow-500/20 border-yellow-500/30",
      components: [
        {
          id: "led",
          type: "actuator",
          name: "LED",
          description: "Control LED output",
          blockType: "component_led",
        },
      ],
    },
  ];

  const handleAddComponent = (componentTemplate: ComponentTemplate) => {
    const newComponent: Component = {
      id: crypto.randomUUID(),
      type: componentTemplate.type,
      name: `${componentTemplate.name} ${selectedComponents.length + 1}`,
      description: componentTemplate.description,
      icon: componentTemplate.icon,
      blocks: [componentTemplate.blockType],
    };
    addComponent(newComponent);
    toast.success(`${componentTemplate.name} added to workspace`);
  };

  const handleRemoveComponent = (componentId: string) => {
    const component = selectedComponents.find((c) => c.id === componentId);
    if (component) {
      removeComponent(componentId);
      toast.success(`${component.name} removed from workspace`);
    }
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, blockType: string) => {
    event.dataTransfer.setData("blockType", blockType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 bg-slate-900/30 backdrop-blur-sm">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Component Library</h2>
        <p className="text-sm text-gray-400">Select or drag blocks to workspace</p>
      </div>

      {componentSections.map((section) => (
        <Card key={section.id} className="bg-slate-800/50 border-slate-700">
          <CardHeader
            className="pb-3 cursor-pointer"
            onClick={() => toggleSection(section.id)}
          >
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                {section.icon}
                <span className="text-white">{section.title}</span>
              </div>
              {expandedSections.includes(section.id) ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </CardTitle>
          </CardHeader>
          {expandedSections.includes(section.id) && (
            <CardContent className="pt-0">
              <div className="space-y-2">
                {section.components.map((component) => {
                  const isSelected = selectedComponents.some((c) => c.type === component.type);
                  return (
                    <div
                      key={component.id}
                      className={`p-3 rounded-lg ${section.color} border cursor-move hover:bg-opacity-30 transition-all flex items-center justify-between ${
                        isSelected ? "opacity-75" : ""
                      }`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, component.blockType)}
                      onClick={() => handleAddComponent(component)}
                    >
                      <div className="flex items-center space-x-2">
                        {component.icon || <div className="w-3 h-3" />}
                        <div>
                          <span className="text-sm font-medium text-white">{component.name}</span>
                          <p className="text-xs text-gray-400">{component.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-slate-700"
                        >
                          Block
                        </Badge>
                        {isSelected && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:text-red-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              const comp = selectedComponents.find((c) => c.type === component.type);
                              if (comp) handleRemoveComponent(comp.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
        <h3 className="text-sm font-semibold text-blue-300 mb-2">Quick Start</h3>
        <ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside">
          <li>Add a Setup block from Arduino Basics</li>
          <li>Select sensors or I/O components</li>
          <li>Drag blocks to the workspace</li>
          <li>Connect to Arduino and upload code</li>
        </ol>
      </div>
    </div>
  );
};
