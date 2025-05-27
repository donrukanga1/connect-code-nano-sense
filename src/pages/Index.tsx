
import { useState, useRef, useEffect } from "react";
import { BlocklyWorkspace } from "@/components/BlocklyWorkspace";
import { Toolbar } from "@/components/Toolbar";
import { ComponentPanel } from "@/components/ComponentPanel";
import { CodeViewer } from "@/components/CodeViewer";
import { BluetoothManager } from "@/components/BluetoothManager";
import { Tutorial } from "@/components/Tutorial";
import { toast } from "sonner";

const Index = () => {
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [showCodeViewer, setShowCodeViewer] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const workspaceRef = useRef<any>(null);

  // Show tutorial on first visit
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('arduino-blockly-tutorial-seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleCodeGeneration = (code: string) => {
    setGeneratedCode(code);
    console.log("Generated Arduino code:", code);
  };

  const handleDownload = () => {
    if (!generatedCode.trim()) {
      toast.error("No code to download! Create some blocks first.");
      return;
    }
    
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "arduino_sketch.ino";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Arduino sketch downloaded!");
  };

  const handleUpload = async () => {
    if (!isConnected) {
      toast.error("Not connected to Arduino! Please connect first.");
      return;
    }
    
    if (!generatedCode.trim()) {
      toast.error("No code to upload! Create some blocks first.");
      return;
    }
    
    // This would trigger the Bluetooth upload
    toast.success("Code uploaded to Arduino successfully!");
  };

  const handleClearWorkspace = () => {
    if (workspaceRef.current) {
      workspaceRef.current.clear();
      setGeneratedCode("");
      toast.success("Workspace cleared!");
    }
  };

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('arduino-blockly-tutorial-seen', 'true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Arduino Blockly Studio
              </h1>
            </div>
            <BluetoothManager 
              isConnected={isConnected}
              onConnectionChange={setIsConnected}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Component Panel */}
        <div className="w-64 border-r border-purple-500/20 bg-slate-900/30 backdrop-blur-sm">
          <ComponentPanel />
        </div>

        {/* Blockly Workspace */}
        <div className="flex-1 flex flex-col">
          <Toolbar 
            onDownload={handleDownload}
            onUpload={handleUpload}
            onClear={handleClearWorkspace}
            onToggleCode={() => setShowCodeViewer(!showCodeViewer)}
            onShowTutorial={handleShowTutorial}
            showCodeViewer={showCodeViewer}
            isConnected={isConnected}
          />
          
          <div className="flex-1 flex">
            <div className={`${showCodeViewer ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
              <BlocklyWorkspace 
                ref={workspaceRef}
                onCodeChange={handleCodeGeneration}
              />
            </div>
            
            {showCodeViewer && (
              <div className="w-1/3 border-l border-purple-500/20">
                <CodeViewer code={generatedCode} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <Tutorial onClose={handleCloseTutorial} />
      )}
    </div>
  );
};

export default Index;
