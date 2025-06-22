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
