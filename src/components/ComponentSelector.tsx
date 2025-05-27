
import { useState } from "react";
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
  X
} from "lucide-react";

interface Component {
  id: string;
  name: string;
  type: 'sensor' | 'actuator' | 'input';
  icon: React.ReactNode;
  description: string;
  blocks: string[];
}

interface ComponentSelectorProps {
  selectedComponents: Component[];
  onComponentAdd: (component: Component) => void;
  onComponentRemove: (componentId: string) => void;
}

const availableComponents: Component[] = [
  {
    id: 'led',
    name: 'LED',
    type: 'actuator',
    icon: <Lightbulb className="w-4 h-4" />,
    description: 'Light Emitting Diode',
    blocks: ['arduino_digital_write', 'arduino_pin_mode']
  },
  {
    id: 'button',
    name: 'Button',
    type: 'input',
    icon: <div className="w-4 h-4 bg-gray-400 rounded-sm" />,
    description: 'Push Button',
    blocks: ['arduino_digital_read', 'arduino_pin_mode']
  },
  {
    id: 'temperature',
    name: 'Temperature Sensor',
    type: 'sensor',
    icon: <Thermometer className="w-4 h-4" />,
    description: 'HTS221 Temperature',
    blocks: ['arduino_temperature_read', 'arduino_sensor_begin']
  },
  {
    id: 'humidity',
    name: 'Humidity Sensor',
    type: 'sensor',
    icon: <Gauge className="w-4 h-4" />,
    description: 'HTS221 Humidity',
    blocks: ['arduino_humidity_read', 'arduino_sensor_begin']
  },
  {
    id: 'imu',
    name: 'Motion Sensor',
    type: 'sensor',
    icon: <Activity className="w-4 h-4" />,
    description: 'IMU Accelerometer',
    blocks: ['arduino_imu_begin', 'arduino_imu_read']
  },
  {
    id: 'microphone',
    name: 'Microphone',
    type: 'sensor',
    icon: <Mic className="w-4 h-4" />,
    description: 'MP34DT05 Microphone',
    blocks: ['arduino_microphone_read', 'arduino_sensor_begin']
  }
];

export const ComponentSelector = ({ selectedComponents, onComponentAdd, onComponentRemove }: ComponentSelectorProps) => {
  const [expandedSection, setExpandedSection] = useState<string>('selected');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sensor': return 'bg-green-500/20 border-green-500/30';
      case 'actuator': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'input': return 'bg-blue-500/20 border-blue-500/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  const isComponentSelected = (component: Component) => {
    return selectedComponents.some(c => c.id === component.id);
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Components</h2>
        <p className="text-sm text-gray-400">Select components for your project</p>
      </div>

      {/* Selected Components */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white flex items-center justify-between">
            <span>Selected Components ({selectedComponents.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {selectedComponents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No components selected yet
            </p>
          ) : (
            <div className="space-y-2">
              {selectedComponents.map((component) => (
                <div
                  key={component.id}
                  className={`p-3 rounded-lg ${getTypeColor(component.type)} border`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {component.icon}
                      <span className="text-sm font-medium text-white">{component.name}</span>
                      <Badge variant="secondary" className="text-xs bg-slate-700">
                        {component.type}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => onComponentRemove(component.id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Components */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white">
            Available Components
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {availableComponents.map((component) => (
              <div
                key={component.id}
                className={`p-3 rounded-lg ${getTypeColor(component.type)} border cursor-pointer transition-all ${
                  isComponentSelected(component) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-opacity-30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {component.icon}
                    <span className="text-sm font-medium text-white">{component.name}</span>
                    <Badge variant="secondary" className="text-xs bg-slate-700">
                      {component.type}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => !isComponentSelected(component) && onComponentAdd(component)}
                    variant="ghost"
                    size="sm"
                    disabled={isComponentSelected(component)}
                    className="h-6 w-6 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/20 disabled:opacity-50"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-1">{component.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
        <h3 className="text-sm font-semibold text-blue-300 mb-2">How to Use</h3>
        <ol className="text-xs text-gray-300 space-y-1">
          <li>1. Select components you'll use</li>
          <li>2. Drag blocks from the workspace</li>
          <li>3. Connect blocks to create logic</li>
          <li>4. Generate and upload code</li>
        </ol>
      </div>
    </div>
  );
};
