import * as Blockly from "blockly";

export const defineArduinoBlocks = () => {
  Blockly.Blocks["controls_setup"] = {
    init: function () {
      this.appendDummyInput().appendField("Arduino Setup & Loop");
      this.appendStatementInput("SETUP").appendField("Setup");
      this.appendStatementInput("LOOP").appendField("Loop");
      this.setColour(120);
      this.setTooltip("Define Arduino setup and loop functions.");
    },
  };

  Blockly.Blocks["component_led"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Set LED on pin")
        .appendField(new Blockly.FieldNumber(13, 0, 21), "PIN")
        .appendField("to")
        .appendField(new Blockly.FieldDropdown([["ON", "HIGH"], ["OFF", "LOW"]]), "STATE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Set the state of an LED.");
    },
  };
};

export const areBlocksRegistered = () => {
  return !!Blockly.Blocks["controls_setup"] && !!Blockly.Blocks["component_led"];
};
