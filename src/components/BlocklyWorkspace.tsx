
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { defineArduinoBlocks } from "@/lib/arduinoBlocks";
import { setupArduinoGenerator } from "@/lib/arduinoGenerator";
import { generateToolboxConfig } from "@/lib/toolboxGenerator";

interface BlocklyWorkspaceProps {
  onCodeChange: (code: string) => void;
  availableBlocks: string[];
  selectedComponents: any[];
}

export const BlocklyWorkspace = forwardRef<any, BlocklyWorkspaceProps>(
  ({ onCodeChange, availableBlocks = [], selectedComponents = [] }, ref) => {
    const blocklyDivRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    const initializationRef = useRef(false);

    useImperativeHandle(ref, () => ({
      clear: () => {
        if (workspaceRef.current) {
          workspaceRef.current.clear();
          onCodeChange("");
        }
      }
    }));

    useEffect(() => {
      if (!blocklyDivRef.current || initializationRef.current) return;

      const initializeWorkspace = () => {
        try {
          console.log('Initializing Blockly workspace...');
          
          // Define custom Arduino blocks first
          defineArduinoBlocks();
          
          // Setup Arduino code generator
          setupArduinoGenerator();

          // Wait a bit for blocks to be registered
          setTimeout(() => {
            try {
              // Generate initial toolbox
              const toolboxXML = generateToolboxConfig(availableBlocks, selectedComponents);
              console.log('Creating workspace with toolbox...');

              // Create workspace with configuration
              const workspace = Blockly.inject(blocklyDivRef.current!, {
                toolbox: toolboxXML,
                theme: getCustomTheme(),
                grid: {
                  spacing: 20,
                  length: 3,
                  colour: "#ccc",
                  snap: true
                },
                zoom: {
                  controls: true,
                  wheel: true,
                  startScale: 1.0,
                  maxScale: 3,
                  minScale: 0.3,
                  scaleSpeed: 1.2
                },
                trashcan: true,
                scrollbars: true,
                sounds: false,
                oneBasedIndex: false,
                move: {
                  scrollbars: {
                    horizontal: true,
                    vertical: true
                  },
                  drag: true,
                  wheel: true
                },
                renderer: 'zelos'
              });

              workspaceRef.current = workspace;
              initializationRef.current = true;
              console.log('Workspace initialized successfully');

              // Listen for changes and generate code
              const changeListener = (event: any) => {
                try {
                  console.log('Blockly event:', event.type, event);
                  
                  // Generate code for all meaningful changes
                  if (event.type === Blockly.Events.BLOCK_MOVE || 
                      event.type === Blockly.Events.BLOCK_CREATE || 
                      event.type === Blockly.Events.BLOCK_DELETE ||
                      event.type === Blockly.Events.BLOCK_CHANGE ||
                      event.type === Blockly.Events.VAR_CREATE ||
                      event.type === Blockly.Events.VAR_DELETE) {
                    
                    // Small delay to ensure block is fully processed
                    setTimeout(() => {
                      const code = generateArduinoCode(workspace);
                      onCodeChange(code);
                    }, 10);
                  }
                } catch (error) {
                  console.error("Error in change listener:", error);
                  onCodeChange("// Error generating code");
                }
              };

              workspace.addChangeListener(changeListener);

              // Generate initial code
              const initialCode = generateArduinoCode(workspace);
              onCodeChange(initialCode);

            } catch (error) {
              console.error("Error creating workspace:", error);
            }
          }, 100);

        } catch (error) {
          console.error("Error initializing Blockly workspace:", error);
        }
      };

      initializeWorkspace();

      // Cleanup function
      return () => {
        try {
          if (workspaceRef.current) {
            workspaceRef.current.dispose();
            workspaceRef.current = null;
            initializationRef.current = false;
          }
        } catch (error) {
          console.error("Error disposing workspace:", error);
        }
      };
    }, [onCodeChange]);

    // Update toolbox when available blocks change
    useEffect(() => {
      if (workspaceRef.current && initializationRef.current) {
        try {
          console.log('Updating toolbox with blocks:', availableBlocks);
          const newToolbox = generateToolboxConfig(availableBlocks, selectedComponents);
          workspaceRef.current.updateToolbox(newToolbox);
          console.log('Toolbox updated successfully');
        } catch (error) {
          console.error("Error updating toolbox:", error);
        }
      }
    }, [availableBlocks, selectedComponents]);

    const generateArduinoCode = (workspace: Blockly.WorkspaceSvg): string => {
      try {
        const code = javascriptGenerator.workspaceToCode(workspace);
        return code || "// No blocks to generate code";
      } catch (error) {
        console.error("Error generating code:", error);
        return "// Error generating code";
      }
    };

    return (
      <div className="w-full h-full bg-slate-800/50 backdrop-blur-sm">
        <div ref={blocklyDivRef} className="w-full h-full" />
      </div>
    );
  }
);

const getCustomTheme = () => {
  return Blockly.Theme.defineTheme("arduino_dark", {
    name: "arduino_dark",
    base: Blockly.Themes.Classic,
    componentStyles: {
      workspaceBackgroundColour: "#1e293b",
      toolboxBackgroundColour: "#334155",
      toolboxForegroundColour: "#e2e8f0",
      flyoutBackgroundColour: "#475569",
      flyoutForegroundColour: "#e2e8f0",
      flyoutOpacity: 0.9,
      scrollbarColour: "#64748b",
      insertionMarkerColour: "#06b6d4",
      insertionMarkerOpacity: 0.8
    },
    blockStyles: {
      arduino_blocks: {
        colourPrimary: "#3b82f6",
        colourSecondary: "#1e40af",
        colourTertiary: "#1e3a8a"
      },
      sensor_blocks: {
        colourPrimary: "#10b981",
        colourSecondary: "#047857",
        colourTertiary: "#064e3b"
      },
      actuator_blocks: {
        colourPrimary: "#f59e0b",
        colourSecondary: "#d97706",
        colourTertiary: "#92400e"
      },
      control_blocks: {
        colourPrimary: "#8b5cf6",
        colourSecondary: "#7c3aed",
        colourTertiary: "#5b21b6"
      }
    }
  });
};
