import * as Blockly from "blockly";

export const defineArduinoBlocks = () => {
  // Setup/Loop Block
  Blockly.Blocks["controls_setup"] = {
    init: function () {
      this.appendDummyInput().appendField("Arduino Setup & Loop");
      this.appendStatementInput("SETUP").appendField("Setup");
      this.appendStatementInput("LOOP").appendField("Loop");
      this.setColour(120);
      this.setTooltip("Define Arduino setup and loop functions.");
    },
  };

  // LED Block
  Blockly.Blocks["component_led"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Set LED on pin")
        .appendField(new Blockly.FieldNumber(13, 0, 21, 1), "PIN")
        .appendField("to")
        .appendField(new Blockly.FieldDropdown([["ON", "HIGH"], ["OFF", "LOW"]]), "STATE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Set the state of an LED.");
    },
  };

  // IMU (LSM6DS3) Block
  Blockly.Blocks["component_imu"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Read IMU")
        .appendField(
          new Blockly.FieldDropdown([
            ["Accelerometer X", "ACC_X"],
            ["Accelerometer Y", "ACC_Y"],
            ["Accelerometer Z", "ACC_Z"],
            ["Gyroscope X", "GYRO_X"],
            ["Gyroscope Y", "GYRO_Y"],
            ["Gyroscope Z", "GYRO_Z"],
          ]),
          "SENSOR_TYPE"
        );
      this.setOutput(true, "Number");
      this.setColour(200); // Sensor block color
      this.setTooltip("Read accelerometer or gyroscope data from the IMU sensor.");
    },
  };

  // Microphone (MP34DT05) Block
  Blockly.Blocks["component_microphone"] = {
    init: function () {
      this.appendDummyInput().appendField("Read Microphone Level");
      this.setOutput(true, "Number");
      this.setColour(200); // Sensor block color
      this.setTooltip("Read the audio level from the onboard microphone.");
    },
  };
};

export const areBlocksRegistered = () => {
  return (
    !!Blockly.Blocks["controls_setup"] &&
    !!Blockly.Blocks["component_led"] &&
    !!Blockly.Blocks["component_imu"] &&
    !!Blockly.Blocks["component_microphone"]
  );
};
