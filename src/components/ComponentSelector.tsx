import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  Thermometer,
  Activity,
  Mic,
  Gauge,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface Component {
  id: string;
  name: string;
  type: "sensor" | "actuator" | "input";
  icon: React.ReactNode;
  description: string;
  blockType: string; // Maps to Blockly block type (e.g., component_led)
}

interface ComponentSection {
  id: string;
  title: string;
  components: Component[];
}

interface ComponentSelectorProps {
  selectedComponents: { id: string; type: string; name: string }[];
  onComponentAdd: (component: { id: string; type: string; name: string }) => void;
  onComponentRemove: (componentId: string) => void;
}

const componentSections: ComponentSection[] = [
  {
    id: "actuators",
    title: "Actuators",
    components: [
      {
        id: "led",
        name: "LED",
        type: "actuator",
        icon: <Lightbulb className="w-4 h-4 text-yellow-400" />,
        description: "Control a Light Emitting Diode",
        blockType: "component_led",
      },
    ],
  },
  {
    id: "inputs",
    title: "Inputs",
    components: [
      {
        id: "button",
        name: "Button",
        type: "input",
        icon: <div className="w-4 h-4 bg-blue-400 rounded-sm" />,
        description: "Read a push button state",
        blockType: "component_button",
      },
    ],
  },
  {
    id: "sensors",
    title: "Nano 33 BLE Sensors",
    components: [
      {
        id: "imu",
        name: "IMU",
        type: "sensor",
        icon: <Activity className="w-4 h-4 text-green-400" />,
        description: "LSM6DS3 motion sensor",
        blockType: "component_imu",
      },
      {
        id: "temperature",
        name: "Temperature",
        type: "sensor",
        icon: <Thermometer className="w-4 h-4 text-green-400" />,
        description: "HTS221 temperature sensor",
        blockType: "component_temperature",
      },
      {
        id: "humidity",
        name: "Humidity",
        type: "sensor",
        icon: <Gauge className="w-4 h-4 text-green-400" />,
        description: "HTS221 humidity sensor",
        blockType: "component_humidity",
      },
      {
        id: "pressure",
        name: "Pressure",
        type: "sensor",
        icon: <Gauge className="w-4 h-4 text-green-400" />,
        description: "LPS22HB pressure sensor",
        blockType: "component_pressure",
      },
      {
        id: "microphone",
        name: "Microphone",
        type: "sensor",
        icon: <Mic className="w-4 h-4 text-green-400" />,
        description: "MP34DT05 microphone",
        blockType: "component_microphone",
      },
    ],
  },
];

export const ComponentSelector = ({
  selectedComponents,
  onComponentAdd,
  onComponentRemove,
}: ComponentSelectorProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "actuators",
    "inputs",
    "sensors",
  ]);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((s) => s !== sectionId) : [...prev, sectionId]
    );
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "sensor":
        return "bg-green-500/20 border-green-500/30 text-green-300";
      case "actuator":
        return "bg-yellow-500/20 border-yellow-500/30 text-yellow-300";
      case "input":
        return "bg-blue-500/20 border-blue-500/30 text-blue-300";
      default:
        return "bg-gray-500/20 border-gray-500/30 text-gray-300";
    }
  };

  const handleAddComponent = (component: Component) => {
    if (["imu", "temperature", "humidity", "pressure", "microphone"].includes(component.id)) {
      if (selectedComponents.some((c) => c.type === component.id)) {
        toast.error(`${component.name} is already added (only one allowed)`);
        return;
      }
    }

    const instanceCount = selectedComponents.filter((c) => c.type === component.id).length + 1;
    const newComponent = {
      id: `${component.id}-${Date.now()}`,
      type: component.id,
      name: `${component.name} ${instanceCount}`,
    };
    onComponentAdd(newComponent);
    toast.success(`${newComponent.name} added`);
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, blockType: string) => {
    event.dataTransfer.setData("blockType", blockType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 bg-slate-900/30 backdrop-blur-sm">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Component Selector</h2>
        <p className="text-sm text-gray-400">Add components or drag to workspace</p>
      </div>

      {/* Selected Components */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white">
            Selected Components ({selectedComponents.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {selectedComponents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No components selected</p>
          ) : (
            <div className="space-y-2">
              {selectedComponents.map((component) => (
                <div
                  key={component.id}
                  className={`p-3 rounded-lg ${getTypeColor(component.type)} border flex items-center justify-between`}
                >
                  <div className="flex items-center space-x-2">
                    {componentSections
                      .flatMap((section) => section.components)
                      .find((c) => c.id === component.type)?.icon}
                    <span className="text-sm font-medium text-white">{component.name}</span>
                    <Badge variant="secondary" className="text-xs bg-slate-700">
                      {component.type}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => {
                      onComponentRemove(component.id);
                      toast.success(`${component.name} removed`);
                    }}
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Components */}
      {componentSections.map((section) => (
        <Card key={section.id} className="bg-slate-800/50 border-slate-700">
          <CardHeader
            className="pb-3 cursor-pointer"
            onClick={() => toggleSection(section.id)}
          >
            <CardTitle className="flex items-center justify-between text-sm text-white">
              <span>{section.title}</span>
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
                  const isDisabled = ["imu", "temperature", "humidity", "pressure", "microphone"].includes(component.id)
                    ? selectedComponents.some((c) => c.type === component.id)
                    : false;
                  return (
                    <div
                      key={component.id}
                      className={`p-3 rounded-lg ${getTypeColor(component.type)} border cursor-move transition-all ${
                        isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-30"
                      }`}
                      draggable={!isDisabled}
                      onDragStart={(e) => !isDisabled && handleDragStart(e, component.blockType)}
                      onClick={() => !isDisabled && handleAddComponent(component)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {component.icon}
                          <div>
                            <span className="text-sm font-medium text-white">{component.name}</span>
                            <p className="text-xs text-gray-400">{component.description}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`text-green-400 hover:text-green-300 hover:bg-green-500/20 ${
                            isDisabled ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={isDisabled}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddComponent(component);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
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
        <h3 className="text-sm font-semibold text-blue-300 mb-2">How to Use</h3>
        <ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside">
          <li>Add components for your project</li>
          <li>Drag components to the workspace as blocks</li>
          <li>Connect blocks to create logic</li>
          <li>Generate and upload code to Arduino</li>
        </ol>
      </div>
    </div>
  );
};
