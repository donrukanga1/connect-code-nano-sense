import * as Blockly from "blockly";

export const arduinoGenerator = new Blockly.Generator("Arduino");

export const setupArduinoGenerator = () => {
  arduinoGenerator["controls_setup"] = function (block: Blockly.Block) {
    const setupCode = arduinoGenerator.statementToCode(block, "SETUP");
    const loopCode = arduinoGenerator.statementToCode(block, "LOOP");
    const definitions = Object.values(arduinoGenerator.definitions_).join("");
    return `${definitions}void setup() {\n${setupCode}}\n\nvoid loop() {\n${loopCode}}\n`;
  };

  arduinoGenerator["component_led"] = function (block: Blockly.Block) {
    const pin = block.getFieldValue("PIN");
    const state = block.getFieldValue("STATE");
    arduinoGenerator.definitions_[`pinMode_${pin}`] = `pinMode(${pin}, OUTPUT);\n`;
    return `digitalWrite(${pin}, ${state});\n`;
  };

  arduinoGenerator.scrub_ = function (block: Blockly.Block, code: string, opt_thisOnly?: boolean) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    let nextCode = "";
    if (nextBlock && !opt_thisOnly) {
      nextCode = this.blockToCode(nextBlock);
    }
    return code + nextCode;
  };

  arduinoGenerator.definitions_ = {};
};

export const generateArduinoCode = (workspace: Blockly.WorkspaceSvg): string => {
  try {
    const code = arduinoGenerator.workspaceToCode(workspace);
    return code || "// No blocks to generate code";
  } catch (error) {
    console.error("Error generating code:", error);
    return "// Error generating code";
  }
};
