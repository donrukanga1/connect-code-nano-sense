import {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import * as Blockly from "blockly";
import { WorkspaceSvg, Theme } from "blockly";
import { defineArduinoBlocks, areBlocksRegistered } from "@/lib/arduinoBlocks";
import { setupArduinoGenerator, generateArduinoCode } from "@/lib/arduinoGenerator";
import { generateToolboxConfig } from "@/lib/toolboxGenerator";
import { toast } from "sonner";

interface Component {
  id: string;
  type: string;
  name: string;
}

interface BlocklyWorkspaceProps {
  onCodeChange: (code: string) => void;
  availableBlocks: string[];
  selectedComponents: Component[];
}

export interface BlocklyWorkspaceRef {
  clear: () => void;
  save: () => Element | null;
  load: (xml: Element) => void;
  saveAsXml: () => string;
  loadFromXml: (xmlString: string) => void;
}

const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

export const BlocklyWorkspace = forwardRef<BlocklyWorkspaceRef, BlocklyWorkspaceProps>(
  ({ onCodeChange, availableBlocks = [], selectedComponents = [] }, ref) => {
    const blocklyDivRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<WorkspaceSvg | null>(null);
    const initializationRef = useRef(false);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    const debouncedCodeUpdate = useCallback(
      debounce(() => {
        if (workspaceRef.current) {
          try {
            const code = generateArduinoCode(workspaceRef.current);
            onCodeChange(code);
          } catch (error) {
            console.error("Error generating code:", error);
            toast.error("Failed to generate code. Check console for details.");
            onCodeChange("// Error generating code");
          }
        }
      }, 100),
      [onCodeChange]
    );

    useImperativeHandle(ref, () => ({
      clear: () => {
        if (workspaceRef.current) {
          workspaceRef.current.clear();
          onCodeChange("");
          toast.success("Workspace cleared!");
        }
      },
      save: () => {
        return workspaceRef.current
          ? Blockly.Xml.workspaceToDom(workspaceRef.current)
          : null;
      },
      load: (xml: Element) => {
        if (workspaceRef.current) {
          workspaceRef.current.clear();
          Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
          debouncedCodeUpdate();
          toast.success("Workspace loaded!");
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
            toast.success("Workspace loaded from XML!");
          } catch (error) {
            console.error("Error loading XML:", error);
            toast.error("Failed to load workspace. Invalid XML format.");
          }
        }
      },
    }));

    const handleResize = useCallback(() => {
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    }, []);

    const toolboxConfig = useMemo(() => {
      return generateToolboxConfig(availableBlocks, selectedComponents);
    }, [availableBlocks, selectedComponents]);

    useEffect(() => {
      if (!blocklyDivRef.current || initializationRef.current) {
        return;
      }

      const initializeWorkspace = async () => {
        try {
          defineArduinoBlocks();
          setupArduinoGenerator();
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (!areBlocksRegistered()) {
            throw new Error("Blocks not properly registered");
          }

          const workspace = Blockly.inject(blocklyDivRef.current!, {
            toolbox: toolboxConfig,
            theme: getCustomTheme(),
            grid: {
              spacing: 20,
              length: 3,
              colour: "#ccc",
              snap: true,
            },
            zoom: {
              controls: true,
              wheel: true,
              startScale: 1.0,
              maxScale: 3,
              minScale: 0.3,
              scaleSpeed: 1.2,
              pinch: true,
            },
            trashcan: true,
            scrollbars: {
              horizontal: true,
              vertical: true,
            },
            sounds: false,
            oneBasedIndex: false,
            move: {
              scrollbars: true,
              drag: true,
              wheel: true,
            },
            renderer: "zelos",
          });

          workspaceRef.current = workspace;
          initializationRef.current = true;

          // Initialize with a setup/loop block
          const setupBlock = workspace.newBlock("controls_setup");
          setupBlock.initSvg();
          setupBlock.render();
          setupBlock.setDeletable(false);
          setupBlock.moveBy(50, 50);

          if (blocklyDivRef.current) {
            resizeObserverRef.current = new ResizeObserver(handleResize);
            resizeObserverRef.current.observe(blocklyDivRef.current);
          }

          window.addEventListener("resize", handleResize);

          const changeListener = (event: Blockly.Events.Abstract) => {
            try {
              if (
                event instanceof Blockly.Events.BlockMove ||
                event instanceof Blockly.Events.BlockCreate ||
                event instanceof Blockly.Events.BlockDelete ||
                event instanceof Blockly.Events.BlockChange ||
                event instanceof Blockly.Events.VarCreate ||
                event instanceof Blockly.Events.VarDelete
              ) {
                debouncedCodeUpdate();
              }
            } catch (error) {
              console.error("Error in change listener:", error);
              toast.error("Error processing workspace change.");
            }
          };

          workspace.addChangeListener(changeListener);

          debouncedCodeUpdate();
        } catch (error) {
          console.error("Error initializing workspace:", error);
          toast.error("Failed to initialize workspace.");
        }
      };

      initializeWorkspace();

      return () => {
        window.removeEventListener("resize", handleResize);
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }
        if (workspaceRef.current) {
          workspaceRef.current.dispose();
          workspaceRef.current = null;
          initializationRef.current = false;
        }
      };
    }, [toolboxConfig, debouncedCodeUpdate, handleResize]);

    useEffect(() => {
      if (workspaceRef.current && initializationRef.current) {
        try {
          workspaceRef.current.updateToolbox(toolboxConfig);
        } catch (error) {
          console.error("Error updating toolbox:", error);
          toast.error("Failed to update toolbox.");
        }
      }
    }, [toolboxConfig]);

    return (
      <div className="w-full h-full bg-slate-800/50 backdrop-blur-sm">
        <div ref={blocklyDivRef} className="w-full h-full" />
      </div>
    );
  }
);

BlocklyWorkspace.displayName = "BlocklyWorkspace";

const getCustomTheme = (): Theme => {
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
      insertionMarkerOpacity: 0.8,
    },
    blockStyles: {
      arduino_blocks: {
        colourPrimary: "#3b82f6",
        colourSecondary: "#1e40af",
        colourTertiary: "#1e3a8a",
      },
      sensor_blocks: {
        colourPrimary: "#10b981",
        colourSecondary: "#047857",
        colourTertiary: "#064e3b",
      },
      actuator_blocks: {
        colourPrimary: "#f59e0b",
        colourSecondary: "#d97706",
        colourTertiary: "#92400e",
      },
      control_blocks: {
        colourPrimary: "#8b5cf6",
        colourSecondary: "#7c3aed",
        colourTertiary: "#5b21b6",
      },
    },
  });
};
