
import { Component } from "./types";

export const generateToolboxConfig = (
  availableBlocks: string[],
  selectedComponents: Component[]
) => {
  console.log('DEBUG: Generating toolbox with available blocks:', availableBlocks);
  console.log('DEBUG: Selected components:', selectedComponents);

  const toolbox = {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Arduino Basics",
        colour: "#3b82f6",
        contents: [
          { kind: "block", type: "controls_setup" },
        ],
      },
      {
        kind: "category", 
        name: "Digital I/O",
        colour: "#f59e0b",
        contents: [
          { kind: "block", type: "component_led" },
        ],
      },
      {
        kind: "category",
        name: "Sensors",
        colour: "#10b981", 
        contents: [
          { kind: "block", type: "component_imu" },
          { kind: "block", type: "component_microphone" },
        ],
      },
      {
        kind: "category",
        name: "Logic",
        colour: "#8b5cf6",
        contents: [
          { kind: "block", type: "controls_if" },
          { kind: "block", type: "logic_compare" },
          { kind: "block", type: "logic_operation" },
          { kind: "block", type: "logic_negate" },
          { kind: "block", type: "logic_boolean" },
        ],
      },
      {
        kind: "category",
        name: "Loops",
        colour: "#ec4899",
        contents: [
          { kind: "block", type: "controls_repeat_ext" },
          { kind: "block", type: "controls_whileUntil" },
          { kind: "block", type: "controls_for" },
        ],
      },
      {
        kind: "category",
        name: "Math",
        colour: "#06b6d4",
        contents: [
          { kind: "block", type: "math_number" },
          { kind: "block", type: "math_arithmetic" },
        ],
      },
      {
        kind: "category",
        name: "Variables",
        colour: "#a855f7",
        custom: "VARIABLE",
      },
      {
        kind: "category",
        name: "Functions", 
        colour: "#ef4444",
        custom: "PROCEDURE",
      },
    ],
  };

  console.log('DEBUG: Generated toolbox config:', toolbox);
  return toolbox;
};
