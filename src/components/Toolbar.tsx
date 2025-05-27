
import { Button } from "@/components/ui/button";
import { Download, Upload, Trash2, Code, Eye, EyeOff, Bluetooth, HelpCircle } from "lucide-react";

interface ToolbarProps {
  onDownload: () => void;
  onUpload: () => void;
  onClear: () => void;
  onToggleCode: () => void;
  onShowTutorial: () => void;
  showCodeViewer: boolean;
  isConnected: boolean;
}

export const Toolbar = ({ 
  onDownload, 
  onUpload, 
  onClear, 
  onToggleCode, 
  onShowTutorial,
  showCodeViewer,
  isConnected 
}: ToolbarProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-slate-900/30 backdrop-blur-sm">
      <div className="flex items-center space-x-4">
        <Button
          onClick={onShowTutorial}
          variant="outline"
          size="sm"
          className="bg-purple-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Tutorial
        </Button>
        
        <Button
          onClick={onDownload}
          variant="outline"
          size="sm"
          className="bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30"
        >
          <Download className="w-4 h-4 mr-2" />
          Download .ino
        </Button>
        
        <Button
          onClick={onUpload}
          variant="outline"
          size="sm"
          disabled={!isConnected}
          className={`border-green-500/30 text-green-300 ${
            isConnected 
              ? 'bg-green-500/20 hover:bg-green-500/30' 
              : 'bg-gray-500/20 text-gray-500'
          }`}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload to Arduino
        </Button>
        
        <Button
          onClick={onClear}
          variant="outline"
          size="sm"
          className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Bluetooth className={`w-4 h-4 ${isConnected ? 'text-green-400' : 'text-gray-400'}`} />
          <span className={`text-sm ${isConnected ? 'text-green-400' : 'text-gray-400'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        <Button
          onClick={onToggleCode}
          variant="outline"
          size="sm"
          className="bg-purple-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30"
        >
          {showCodeViewer ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
          {showCodeViewer ? 'Hide Code' : 'Show Code'}
        </Button>
      </div>
    </div>
  );
};
