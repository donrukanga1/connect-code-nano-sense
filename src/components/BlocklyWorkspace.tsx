import { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { defineArduinoBlocks, areBlocksRegistered } from "@/lib/arduinoBlocks";
import { setupArduinoGenerator } from "@/lib/arduinoGenerator";
import { generateToolboxConfig } from "@/lib/toolboxGenerator";

interface BlocklyWorkspaceProps {
  onCodeChange: (code: string) => void;
  availableBlocks: string[];
  selectedComponents: any[];
}

export interface BlocklyWorkspaceRef {
  clear: () => void;
  save: () => Element | null;
  load: (xml: Element) => void;
  saveAsXml: () => string;
  loadFromXml: (xmlString: string) => void;
}

// Debounce utility function
const debounce = (fn: Function, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

export const BlocklyWorkspace = forwardRef<BlocklyWorkspaceRef, BlocklyWorkspaceProps>(
  ({ onCodeChange, availableBlocks = [], selectedComponents = [] }, ref) => {
    const blocklyDivRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    const initializationRef = useRef(false);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    // Debounced code generation
    const debouncedCodeUpdate = useCallback(
      debounce(() => {
        if (workspaceRef.current) {
          try {
            const code = generateArduinoCode(workspaceRef.current);
            console.log('DEBUG: Generated code length:', code.length);
            onCodeChange(code);
          } catch (codeError) {
            console.error('DEBUG: Error generating code:', codeError);
            onCodeChange("// Error generating code: " + codeError);
          }
        }
      }, 100),
      [onCodeChange]
    );

    useImperativeHandle(ref, () => ({
      clear: () => {
        console.log('DEBUG: Clear workspace called');
        if (workspaceRef.current) {
          const blockCount = workspaceRef.current.getAllBlocks().length;
          console.log('DEBUG: Clearing workspace with', blockCount, 'blocks');
          workspaceRef.current.clear();
          onCodeChange("");
          console.log('DEBUG: Workspace cleared successfully');
        }
      },
      save: () => {
        if (workspaceRef.current) {
          return Blockly.Xml.workspaceToDom(workspaceRef.current);
        }
        return null;
      },
      load: (xml: Element) => {
        if (workspaceRef.current) {
          workspaceRef.current.clear();
          Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
          debouncedCodeUpdate();
        }
      },
      saveAsXml: () => {
        if (workspaceRef.current) {
          const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
          return Blockly.Xml.domToText(xml);
        }
        return "";
      },
      loadFromXml: (xmlString: string) => {
        if (workspaceRef.current && xmlString) {
          try {
            const xml = Blockly.utils.xml.textToDom(xmlString);
            workspaceRef.current.clear();
            Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
            debouncedCodeUpdate();
          } catch (error) {
            console.error('DEBUG: Error loading XML:', error);
          }
        }
      }
    }));

    // Handle workspace resize
    const handleResize = useCallback(() => {
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    }, []);

    useEffect(() => {
      if (!blocklyDivRef.current || initializationRef.current) {
        console.log('DEBUG: Skipping initialization - div exists:', !!blocklyDivRef.current, 'already initialized:', initializationRef.current);
        return;
      }

      const initializeWorkspace = async () => {
        try {
          console.log('DEBUG: Starting workspace initialization...');
          console.log('DEBUG: Available blocks:', availableBlocks);
          console.log('DEBUG: Selected components:', selectedComponents);
          
          // Define custom Arduino blocks first
          console.log('DEBUG: Defining Arduino blocks...');
          defineArduinoBlocks();
          
          // Setup Arduino code generator
          console.log('DEBUG: Setting up Arduino generator...');
          setupArduinoGenerator();

          // Wait for blocks to be registered
          await new Promise(resolve => setTimeout(resolve, 100));

          if (!areBlocksRegistered()) {
            console.error('DEBUG: ERROR - Blocks not properly registered');
            return;
          }
          console.log('DEBUG: Blocks registered successfully');

          // Generate initial toolbox
          console.log('DEBUG: Generating toolbox configuration...');
          const toolboxXML = generateToolboxConfig(availableBlocks, selectedComponents);
          console.log('DEBUG: Toolbox XML generated, length:', toolboxXML.length);

          console.log('DEBUG: Creating Blockly workspace...');
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

          console.log('DEBUG: Workspace created successfully');
          console.log('DEBUG: Workspace ID:', workspace.id);
          console.log('DEBUG: Workspace blocks count:', workspace.getAllBlocks().length);

          workspaceRef.current = workspace;
          initializationRef.current = true;

          // Set up resize observer for the blockly container
          if (blocklyDivRef.current) {
            resizeObserverRef.current = new ResizeObserver(() => {
              handleResize();
            });
            resizeObserverRef.current.observe(blocklyDivRef.current);
          }

          // Add window resize listener as fallback
          window.addEventListener('resize', handleResize);

          // Listen for changes and generate code
          const changeListener = (event: any) => {
            try {
              console.log('DEBUG: Blockly event received:', event.type, 'blockId:', event.blockId);
              
              if (event.type === Blockly.Events.BLOCK_DELETE) {
                console.log('DEBUG: Block deleted - ID:', event.blockId);
                console.log('DEBUG: Remaining blocks count:', workspace.getAllBlocks().length);
              }
              
              if (event.type === Blockly.Events.BLOCK_CREATE) {
                console.log('DEBUG: Block created - ID:', event.blockId, 'type:', event.xml?.getAttribute?.('type'));
                console.log('DEBUG: Total blocks count:', workspace.getAllBlocks().length);
              }

              if (event.type === Blockly.Events.BLOCK_MOVE) {
                console.log('DEBUG: Block moved - ID:', event.blockId);
                if (event.newParentId === null && event.oldParentId !== null) {
                  console.log('DEBUG: Block disconnected from parent');
                }
              }
              
              // Generate code for meaningful changes using debounced function
              if (event.type === Blockly.Events.BLOCK_MOVE || 
                  event.type === Blockly.Events.BLOCK_CREATE || 
                  event.type === Blockly.Events.BLOCK_DELETE ||
                  event.type === Blockly.Events.BLOCK_CHANGE ||
                  event.type === Blockly.Events.VAR_CREATE ||
                  event.type === Blockly.Events.VAR_DELETE) {
                
                debouncedCodeUpdate();
              }
            } catch (error) {
              console.error("DEBUG: Error in change listener:", error);
              onCodeChange("// Error in change listener: " + error);
            }
          };

          workspace.addChangeListener(changeListener);
          console.log('DEBUG: Change listener added');

          // Generate initial code
          const initialCode = generateArduinoCode(workspace);
          console.log('DEBUG: Initial code generated, length:', initialCode.length);
          onCodeChange(initialCode);

          console.log('DEBUG: Workspace initialization completed successfully');

        } catch (error) {
          console.error("DEBUG: Error initializing Blockly workspace:", error);
          console.error("DEBUG: Error stack:", error.stack);
        }
      };

      initializeWorkspace();

      // Cleanup function
      return () => {
        try {
          console.log('DEBUG: Cleanup function called');
          
          // Remove resize listeners
          window.removeEventListener('resize', handleResize);
          if (resizeObserverRef.current) {
            resizeObserverRef.current.disconnect();
            resizeObserverRef.current = null;
          }
          
          if (workspaceRef.current) {
            console.log('DEBUG: Disposing workspace...');
            workspaceRef.current.dispose();
            workspaceRef.current = null;
            initializationRef.current = false;
            console.log('DEBUG: Workspace disposed successfully');
          }
        } catch (error) {
          console.error("DEBUG: Error disposing workspace:", error);
        }
      };
    }, [onCodeChange, handleResize, debouncedCodeUpdate]);

    // Update toolbox when available blocks change
    useEffect(() => {
      if (!workspaceRef.current || !initializationRef.current) {
        return;
      }

      try {
        console.log('DEBUG: Updating toolbox...');
        console.log('DEBUG: New available blocks:', availableBlocks);
        console.log('DEBUG: New selected components:', selectedComponents);
        const newToolbox = generateToolboxConfig(availableBlocks, selectedComponents);
        console.log('DEBUG: New toolbox generated, length:', newToolbox.length);
        
        const blockCountBefore = workspaceRef.current.getAllBlocks().length;
        console.log('DEBUG: Blocks count before toolbox update:', blockCountBefore);
        
        workspaceRef.current.updateToolbox(newToolbox);
        
        const blockCountAfter = workspaceRef.current.getAllBlocks().length;
        console.log('DEBUG: Blocks count after toolbox update:', blockCountAfter);
        
        if (blockCountBefore !== blockCountAfter) {
          console.warn('DEBUG: WARNING - Block count changed during toolbox update!', 
            'Before:', blockCountBefore, 'After:', blockCountAfter);
        }
        
        console.log('DEBUG: Toolbox updated successfully');
      } catch (error) {
        console.error("DEBUG: Error updating toolbox:", error);
        console.error("DEBUG: Toolbox update error stack:", error.stack);
      }
    }, [availableBlocks, selectedComponents]);

    const generateArduinoCode = (workspace: Blockly.WorkspaceSvg): string => {
      try {
        console.log('DEBUG: Generating Arduino code...');
        const allBlocks = workspace.getAllBlocks();
        console.log('DEBUG: Total blocks in workspace:', allBlocks.length);
        allBlocks.forEach((block, index) => {
          console.log(`DEBUG: Block ${index}: type=${block.type}, id=${block.id}, deletable=${block.isDeletable()}`);
        });
        
        const code = javascriptGenerator.workspaceToCode(workspace);
        console.log('DEBUG: Code generation completed');
        return code || "// No blocks to generate code";
      } catch (error) {
        console.error("DEBUG: Error generating code:", error);
        return "// Error generating code: " + error;
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
