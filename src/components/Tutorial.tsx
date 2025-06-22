import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Download,
  Upload,
  Puzzle,
  Bluetooth,
  Cpu,
} from "lucide-react";
import { toast } from "sonner";

interface TutorialProps {
  onClose: () => void;
  onAddBlock?: (blockType: string) => void; // Optional: Add block to workspace
  onShowBluetoothDialog?: () => void; // Optional: Open Bluetooth dialog
}

export const Tutorial = ({ onClose, onAddBlock, onShowBluetoothDialog }: TutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to Arduino Blockly Studio!",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Create Arduino programs for the Nano 33 BLE Sense Rev2 using a visual, drag-and-drop interface.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-300 mb-2">What you'll learn:</h4>
            <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
              <li>Drag and connect blocks to build programs</li>
              <li>Use onboard sensors (IMU, temperature, microphone)</li>
              <li>Generate and upload code via Bluetooth</li>
              <li>Save and share your projects</li>
            </ul>
          </div>
          {/* Placeholder for image/gif */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
            <Puzzle className="w-12 h-12 mx-auto text-purple-400 mb-2" />
            <p className="text-sm text-gray-400">Visual programming interface overview</p>
          </div>
        </div>
      ),
    },
    {
      title: "Step 1: Add Setup Block",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Every Arduino program starts with a <strong>Setup</strong> block, which runs once to initialize your board.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-300 mb-2">Setup Block</h4>
            <p className="text-sm text-gray-300">Configure pins, sensors, and communication here.</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center justify-between">
            <p className="text-sm text-green-300">
              <strong>Try it:</strong> Add a Setup block to the workspace.
            </p>
            {onAddBlock && (
              <Button
                onClick={() => {
                  onAddBlock("controls_setup");
                  toast.success("Setup block added!");
                }}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                Add Setup
              </Button>
            )}
          </div>
          {/* Placeholder for image/gif */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
            <Cpu className="w-12 h-12 mx-auto text-blue-400 mb-2" />
            <p className="text-sm text-gray-400">Setup block in workspace</p>
          </div>
        </div>
      ),
    },
    {
      title: "Step 2: Select Components",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Add components like sensors or LEDs from the Component Selector to enable their blocks.
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
              <h5 className="font-semibold text-green-300">IMU</h5>
              <p className="text-gray-300">Detect motion and orientation</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
              <h5 className="font-semibold text-red-300">Temperature</h5>
              <p className="text-gray-300">Measure environmental temperature</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
              <h5 className="font-semibold text-yellow-300">Microphone</h5>
              <p className="text-gray-300">Capture sound levels</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded p-3">
              <h5 className="font-semibold text-purple-300">LED</h5>
              <p className="text-gray-300">Control lights or signals</p>
            </div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-sm text-green-300">
              <strong>Try it:</strong> Open the Component Selector (left panel) and add a Temperature sensor.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Step 3: Build Your Program",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Connect blocks to create your program logic, like reading sensors or controlling outputs.
          </p>
          <div className="space-y-3">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-blue-300">Stack Blocks</h4>
              <p className="text-sm text-gray-300">Drag blocks vertically for sequential actions.</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-purple-300">Connect Values</h4>
              <p className="text-sm text-gray-300">Plug sensor readings or numbers into inputs.</p>
            </div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center justify-between">
            <p className="text-sm text-green-300">
              <strong>Try it:</strong> Add a Temperature block and connect it to a Serial Print block.
            </p>
            {onAddBlock && (
              <Button
                onClick={() => {
                  onAddBlock("component_temperature");
                  toast.success("Temperature block added!");
                }}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                Add Temperature
              </Button>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Step 4: Connect via Bluetooth",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Connect your Arduino Nano 33 BLE Sense Rev2 to upload code wirelessly.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-300">Bluetooth Setup</h4>
            <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
              <li>Ensure your Arduino is powered on</li>
              <li>Click the Bluetooth button in the toolbar</li>
              <li>Select your Nano 33 BLE from the browser prompt</li>
            </ul>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center justify-between">
            <p className="text-sm text-green-300">
              <strong>Try it:</strong> Open the Bluetooth connection dialog.
            </p>
            {onShowBluetoothDialog && (
              <Button
                onClick={() => {
                  onShowBluetoothDialog();
                  toast.info("Bluetooth dialog opened");
                }}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Bluetooth className="w-4 h-4 mr-2" />
                Connect
              </Button>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Step 5: Upload and Run",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Generate Arduino code from your blocks and upload it to your board.
          </p>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <Download className="w-5 h-5 text-blue-300" />
              <div>
                <h4 className="font-semibold text-blue-300">Download .ino</h4>
                <p className="text-sm text-gray-300">Save your code to edit in Arduino IDE.</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <Upload className="w-5 h-5 text-green-300" />
              <div>
                <h4 className="font-semibold text-green-300">Upload to Arduino</h4>
                <p className="text-sm text-gray-300">Send code via Bluetooth when connected.</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-sm text-yellow-300">
              <strong>Note:</strong> Ensure your Arduino is connected via Bluetooth before uploading.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "You're Ready to Build!",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            You're all set to create amazing projects with Arduino Blockly Studio!
          </p>
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-300 mb-3">Quick Reference:</h4>
            <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
              <li>
                <strong>Component Selector (Left):</strong> Add sensors and actuators
              </li>
              <li>
                <strong>Workspace (Center):</strong> Drag and connect blocks
              </li>
              <li>
                <strong>Code Viewer (Right):</strong> Preview generated Arduino code
              </li>
              <li>
                <strong>Toolbar (Top):</strong> Connect, upload, and manage projects
              </li>
            </ul>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-sm text-green-300">
              <strong>Next Project:</strong> Try blinking an LED or reading temperature data!
            </p>
          </div>
        </div>
      ),
    },
  ];

  const nextStep = useCallback(() => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, tutorialSteps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-labelledby="tutorial-title"
    >
      <Card className="w-full max-w-2xl bg-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle id="tutorial-title" className="text-xl text-white">
            {tutorialSteps[currentStep].title}
          </CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            aria-label="Close tutorial"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={progress} className="w-full" />
          {tutorialSteps[currentStep].content}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <div className="flex space-x-1">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? "bg-blue-500" : "bg-slate-600"
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                size="sm"
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              {currentStep === tutorialSteps.length - 1 ? (
                <Button
                  onClick={onClose}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                  aria-label="Start building"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Start Building
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="sm"
                  aria-label="Next step"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
