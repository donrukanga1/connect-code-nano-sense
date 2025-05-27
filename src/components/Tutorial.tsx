
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Play, Download, Upload } from "lucide-react";

interface TutorialProps {
  onClose: () => void;
}

export const Tutorial = ({ onClose }: TutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to Arduino Blockly Studio!",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            This visual programming platform lets you create Arduino code using drag-and-drop blocks 
            instead of writing text code.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-300 mb-2">What you'll learn:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• How to drag blocks to create programs</li>
              <li>• Using Arduino Nano 33 BLE sensors</li>
              <li>• Generating and uploading code</li>
              <li>• Connecting via Bluetooth</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Step 1: Start with Setup and Loop",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Every Arduino program needs two essential blocks:
          </p>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <h4 className="font-semibold text-blue-300">Setup Block</h4>
              <p className="text-sm text-gray-300">Runs once when Arduino starts. Put initialization code here.</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
              <h4 className="font-semibold text-purple-300">Loop Block</h4>
              <p className="text-sm text-gray-300">Runs continuously. Put your main program logic here.</p>
            </div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <p className="text-sm text-green-300">
              <strong>Try it:</strong> Drag "Setup" and "Loop" blocks from "Arduino Basics" to the workspace.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Step 2: Add Sensors and Actions",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            The Arduino Nano 33 BLE has built-in sensors you can use:
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
              <h5 className="font-semibold text-green-300">IMU</h5>
              <p className="text-gray-300">Motion & orientation</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded p-2">
              <h5 className="font-semibold text-red-300">Temperature</h5>
              <p className="text-gray-300">Environmental sensing</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
              <h5 className="font-semibold text-yellow-300">Humidity</h5>
              <p className="text-gray-300">Air moisture</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded p-2">
              <h5 className="font-semibold text-purple-300">Microphone</h5>
              <p className="text-gray-300">Sound detection</p>
            </div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <p className="text-sm text-green-300">
              <strong>Try it:</strong> Drag sensor blocks from "Sensors (Nano 33 BLE)" category.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Step 3: Connect Blocks Together",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Blocks connect together like puzzle pieces:
          </p>
          <div className="space-y-3">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <h4 className="font-semibold text-blue-300">Stack blocks vertically</h4>
              <p className="text-sm text-gray-300">Actions that happen in sequence</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
              <h4 className="font-semibold text-purple-300">Plug values into slots</h4>
              <p className="text-sm text-gray-300">Sensor readings, numbers, and conditions</p>
            </div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <p className="text-sm text-green-300">
              <strong>Try it:</strong> Drag a "Serial Print" block inside the Loop, then connect a sensor reading to it.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Step 4: Generate and Upload Code",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Once your blocks are connected, you can see the generated Arduino code and upload it:
          </p>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <Download className="w-5 h-5 text-blue-300" />
              <div>
                <h4 className="font-semibold text-blue-300">Download .ino</h4>
                <p className="text-sm text-gray-300">Save the code file to your computer</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <Upload className="w-5 h-5 text-green-300" />
              <div>
                <h4 className="font-semibold text-green-300">Upload to Arduino</h4>
                <p className="text-sm text-gray-300">Send code directly via Bluetooth (when connected)</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-sm text-yellow-300">
              <strong>Note:</strong> Make sure your Arduino Nano 33 BLE is paired via Bluetooth first!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "You're Ready to Start!",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Great! You now know the basics of using Arduino Blockly Studio.
          </p>
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-300 mb-3">Quick Reference:</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• <strong>Left Panel:</strong> Component library with all available blocks</li>
              <li>• <strong>Center:</strong> Visual workspace for building your program</li>
              <li>• <strong>Right Panel:</strong> Live Arduino code preview</li>
              <li>• <strong>Top Toolbar:</strong> Download, upload, and workspace controls</li>
            </ul>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <p className="text-sm text-green-300">
              <strong>Start building:</strong> Try making the built-in LED blink, or read sensor data!
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl text-white">
            {tutorialSteps[currentStep].title}
          </CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {tutorialSteps[currentStep].content}
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <div className="flex space-x-1">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-blue-500' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                size="sm"
                className="bg-slate-800 border-slate-600"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              
              {currentStep === tutorialSteps.length - 1 ? (
                <Button
                  onClick={onClose}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Start Building
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="sm"
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
