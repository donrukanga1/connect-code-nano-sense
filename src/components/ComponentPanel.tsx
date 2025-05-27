
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cpu, 
  Lightbulb, 
  Thermometer, 
  Activity, 
  Mic, 
  Gauge,
  ChevronDown,
  ChevronRight
} from "lucide-react";

export const ComponentPanel = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['basics', 'sensors']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const componentSections = [
    {
      id: 'basics',
      title: 'Arduino Basics',
      icon: <Cpu className="w-4 h-4" />,
      color: 'bg-blue-500/20 border-blue-500/30',
      components: [
        { name: 'Setup', description: 'Initialization code' },
        { name: 'Loop', description: 'Main program loop' },
        { name: 'Delay', description: 'Wait for time' },
        { name: 'Serial', description: 'Communication' }
      ]
    },
    {
      id: 'sensors',
      title: 'Nano 33 BLE Sensors',
      icon: <Activity className="w-4 h-4" />,
      color: 'bg-green-500/20 border-green-500/30',
      components: [
        { name: 'IMU', description: 'Motion sensor', icon: <Activity className="w-3 h-3" /> },
        { name: 'Temperature', description: 'HTS221', icon: <Thermometer className="w-3 h-3" /> },
        { name: 'Humidity', description: 'HTS221', icon: <Gauge className="w-3 h-3" /> },
        { name: 'Pressure', description: 'LPS22HB', icon: <Gauge className="w-3 h-3" /> },
        { name: 'Microphone', description: 'MP34DT05', icon: <Mic className="w-3 h-3" /> }
      ]
    },
    {
      id: 'io',
      title: 'Digital/Analog I/O',
      icon: <Lightbulb className="w-4 h-4" />,
      color: 'bg-yellow-500/20 border-yellow-500/30',
      components: [
        { name: 'Digital Write', description: 'Control outputs' },
        { name: 'Digital Read', description: 'Read inputs' },
        { name: 'Analog Read', description: 'Read sensors' },
        { name: 'PWM Write', description: 'Control servos/LEDs' }
      ]
    }
  ];

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Component Library</h2>
        <p className="text-sm text-gray-400">Drag blocks to workspace</p>
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
              {expandedSections.includes(section.id) ? 
                <ChevronDown className="w-4 h-4 text-gray-400" /> : 
                <ChevronRight className="w-4 h-4 text-gray-400" />
              }
            </CardTitle>
          </CardHeader>
          
          {expandedSections.includes(section.id) && (
            <CardContent className="pt-0">
              <div className="space-y-2">
                {section.components.map((component, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${section.color} border cursor-pointer hover:bg-opacity-30 transition-all`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {component.icon}
                        <span className="text-sm font-medium text-white">{component.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-slate-700">
                        Block
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{component.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
        <h3 className="text-sm font-semibold text-blue-300 mb-2">Quick Start</h3>
        <ol className="text-xs text-gray-300 space-y-1">
          <li>1. Add Setup and Loop blocks</li>
          <li>2. Configure sensors and pins</li>
          <li>3. Add your logic</li>
          <li>4. Generate and upload code</li>
        </ol>
      </div>
    </div>
  );
};
