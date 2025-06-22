import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  Upload,
  Trash2,
  Code,
  Eye,
  EyeOff,
  Bluetooth,
  HelpCircle,
  Save,
  FolderOpen,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface ToolbarProps {
  onDownload: () => void;
  onUpload: () => Promise<void>;
  onClear: () => void;
  onToggleCode: () => void;
  onShowTutorial: () => void;
  onSaveWorkspace: () => string; // Returns JSON string of workspace
  onLoadWorkspace: (json: string) => void; // Loads workspace from JSON
  showCodeViewer: boolean;
  isConnected: boolean;
}

export const Toolbar = ({
  onDownload,
  onUpload,
  onClear,
  onToggleCode,
  onShowTutorial,
  onSaveWorkspace,
  onLoadWorkspace,
  showCodeViewer,
  isConnected,
}: ToolbarProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(false);

  const handleUpload = useCallback(async () => {
    setIsUploading(true);
    try {
      await onUpload();
    } catch (error) {
      toast.error("Failed to upload code to Arduino");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  }, [onUpload]);

  const handleSaveWorkspace = useCallback(() => {
    try {
      const workspaceJson = onSaveWorkspace();
      const blob = new Blob([workspaceJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "blockly_workspace.json";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Workspace saved as blockly_workspace.json");
    } catch (error) {
      toast.error("Failed to save workspace");
      console.error("Save workspace error:", error);
    }
  }, [onSaveWorkspace]);

  const handleLoadWorkspace = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        setIsLoadingWorkspace(true);
        try {
          const text = await file.text();
          onLoadWorkspace(text);
          toast.success("Workspace loaded successfully");
        } catch (error) {
          toast.error("Failed to load workspace");
          console.error("Load workspace error:", error);
        } finally {
          setIsLoadingWorkspace(false);
        }
      }
    };
    input.click();
  }, [onLoadWorkspace]);

  return (
    <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-slate-900/30 backdrop-blur-sm">
      <div className="flex items-center space-x-2 flex-wrap gap-y-2">
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
          onClick={handleUpload}
          variant="outline"
          size="sm"
          disabled={!isConnected || isUploading}
          className={`border-green-500/30 text-green-300 ${
            isConnected && !isUploading
              ? "bg-green-500/20 hover:bg-green-500/30"
              : "bg-gray-500/20 text-gray-500"
          }`}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          {isUploading ? "Uploading..." : "Upload to Arduino"}
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
        <Button
          onClick={handleSaveWorkspace}
          variant="outline"
          size="sm"
          className="bg-teal-500/20 border-teal-500/30 text-teal-300 hover:bg-teal-500/30"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Workspace
        </Button>
        <Button
          onClick={handleLoadWorkspace}
          variant="outline"
          size="sm"
          disabled={isLoadingWorkspace}
          className={`border-cyan-500/30 text-cyan-300 ${
            isLoadingWorkspace
              ? "bg-gray-500/20 text-gray-500"
              : "bg-cyan-500/20 hover:bg-cyan-500/30"
          }`}
        >
          {isLoadingWorkspace ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <FolderOpen className="w-4 h-4 mr-2" />
          )}
          {isLoadingWorkspace ? "Loading..." : "Load Workspace"}
        </Button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Bluetooth className={`w-4 h-4 ${isConnected ? "text-green-400" : "text-gray-400"}`} />
          <span className={`text-sm ${isConnected ? "text-green-400" : "text-gray-400"}`}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <Button
          onClick={onToggleCode}
          variant="outline"
          size="sm"
          className="bg-purple-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30"
        >
          {showCodeViewer ? (
            <EyeOff className="w-4 h-4 mr-2" />
          ) : (
            <Eye className="w-4 h-4 mr-2" />
          )}
          {showCodeViewer ? "Hide Code" : "Show Code"}
        </Button>
      </div>
    </div>
  );
};
