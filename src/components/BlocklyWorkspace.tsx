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
  ({ onCodeChange, availableBlocks, selectedComponents }, ref) => {
    const blocklyDivRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

    useImperativeHandle(ref, () => ({
      clear: () => {
        if (workspaceRef.current) {
          workspaceRef.current.clear();
          onCodeChange("");
        }
      }
    }));

    useEffect(() => {
      if (!blocklyDivRef.current) return;

      // Define custom Arduino blocks
      defineArduinoBlocks();
      
      // Setup Arduino code generator
      setupArduinoGenerator();

      // Create workspace with dynamic toolbox
      const workspace = Blockly.inject(blocklyDivRef.current, {
        toolbox: generateToolboxConfig(availableBlocks, selectedComponents),
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
        oneBasedIndex: false
      });

      workspaceRef.current = workspace;

      // Listen for changes and generate code
      workspace.addChangeListener(() => {
        const code = generateArduinoCode(workspace);
        onCodeChange(code);
      });

      // Cleanup function
      return () => {
        if (workspaceRef.current) {
          workspaceRef.current.dispose();
        }
      };
    }, [onCodeChange, availableBlocks, selectedComponents]);

    // Update toolbox when available blocks change
    useEffect(() => {
      if (workspaceRef.current) {
        const newToolbox = generateToolboxConfig(availableBlocks, selectedComponents);
        workspaceRef.current.updateToolbox(newToolbox);
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

const getToolboxConfig = () => {
  return `
    <xml>
      <category name="Arduino Basics" colour="#3b82f6">
        <block type="arduino_setup"></block>
        <block type="arduino_loop"></block>
        <block type="arduino_delay"></block>
        <block type="arduino_serial_begin"></block>
        <block type="arduino_serial_print">
          <value name="TEXT">
            <block type="text">
              <field name="TEXT">Hello World</field>
            </block>
          </value>
        </block>
      </category>
      
      <category name="Digital I/O" colour="#10b981">
        <block type="arduino_pin_mode"></block>
        <block type="arduino_digital_write"></block>
        <block type="arduino_digital_read"></block>
        <block type="arduino_led_builtin"></block>
      </category>
      
      <category name="Analog I/O" colour="#f59e0b">
        <block type="arduino_analog_read"></block>
        <block type="arduino_analog_write"></block>
      </category>
      
      <category name="Values" colour="#84cc16">
        <block type="text">
          <field name="TEXT">hello</field>
        </block>
        <block type="math_number">
          <field name="NUM">123</field>
        </block>
      </category>
      
      <category name="Logic" colour="#06b6d4">
        <block type="logic_compare"></block>
        <block type="logic_operation"></block>
        <block type="logic_negate"></block>
        <block type="logic_boolean"></block>
      </category>
      
      <category name="Control" colour="#8b5cf6">
        <block type="controls_if"></block>
        <block type="controls_repeat_ext">
          <value name="TIMES">
            <block type="math_number">
              <field name="NUM">10</field>
            </block>
          </value>
        </block>
        <block type="controls_whileUntil"></block>
      </category>
      
      <category name="Variables" colour="#f97316" custom="VARIABLE"></category>
      
      <category name="Functions" colour="#ec4899" custom="PROCEDURE"></category>
    </xml>
  `;
};
