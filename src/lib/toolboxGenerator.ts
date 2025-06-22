import { Component } from "./types";

export const generateToolboxConfig = (
  availableBlocks: string[],
  selectedComponents: Component[]
) => {
  const toolbox = {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Logic",
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
        contents: [
          { kind: "block", type: "controls_repeat_ext" },
          { kind: "block", type: "controls_whileUntil" },
          { kind: "block", type: "controls_for" },
        ],
      },
      {
        kind: "category",
        name: "Math",
        contents: [
          { kind: "block", type: "math_number" },
          { kind: "block", type: "math_arithmetic" },
        ],
      },
      {
        kind: "category",
        name: "Components",
        contents: selectedComponents
          .filter((comp) => availableBlocks.includes(comp.type))
          .map((comp) => ({
            kind: "block",
            type: `component_${comp.type}`,
          })),
      },
    ],
  };
  return toolbox;
};
