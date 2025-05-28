
import * as Blockly from "blockly";

// Store registered block types to prevent re-registration
const registeredBlocks = new Set<string>();

export const defineArduinoBlocks = () => {
  console.log('Defining Arduino blocks...');

  // Only define blocks that haven't been registered yet
  const blockDefinitions = {
    'arduino_setup': {
      init: function() {
        this.appendDummyInput()
          .appendField("Setup (runs once)");
        this.appendStatementInput("SETUP_CODE")
          .setCheck(null);
        this.setColour("#3b82f6");
        this.setTooltip("Arduino setup function - runs once when the program starts");
        this.setHelpUrl("");
        this.setDeletable(false);
        this.setMovable(true);
      }
    },

    'arduino_loop': {
      init: function() {
        this.appendDummyInput()
          .appendField("Loop (runs forever)");
        this.appendStatementInput("LOOP_CODE")
          .setCheck(null);
        this.setColour("#3b82f6");
        this.setTooltip("Arduino loop function - runs continuously");
        this.setHelpUrl("");
        this.setDeletable(false);
        this.setMovable(true);
      }
    },

    'arduino_delay': {
      init: function() {
        this.appendDummyInput()
          .appendField("delay")
          .appendField(new Blockly.FieldNumber(1000, 1), "TIME")
          .appendField("milliseconds");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#3b82f6");
        this.setTooltip("Pause the program for specified milliseconds");
        this.setMovable(true);
      }
    },

    'arduino_pin_mode': {
      init: function() {
        this.appendDummyInput()
          .appendField("set pin")
          .appendField(new Blockly.FieldNumber(13, 0, 53), "PIN")
          .appendField("mode to")
          .appendField(new Blockly.FieldDropdown([
            ["OUTPUT", "OUTPUT"],
            ["INPUT", "INPUT"],
            ["INPUT_PULLUP", "INPUT_PULLUP"]
          ]), "MODE");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#10b981");
        this.setTooltip("Set pin mode (INPUT, OUTPUT, INPUT_PULLUP)");
        this.setMovable(true);
      }
    },

    'arduino_digital_write': {
      init: function() {
        this.appendDummyInput()
          .appendField("digital write pin")
          .appendField(new Blockly.FieldNumber(13, 0, 53), "PIN")
          .appendField("value")
          .appendField(new Blockly.FieldDropdown([
            ["HIGH", "HIGH"],
            ["LOW", "LOW"]
          ]), "STATE");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#10b981");
        this.setTooltip("Write HIGH or LOW to a digital pin");
        this.setMovable(true);
      }
    },

    'arduino_digital_read': {
      init: function() {
        this.appendDummyInput()
          .appendField("digital read pin")
          .appendField(new Blockly.FieldNumber(2, 0, 53), "PIN");
        this.setOutput(true, "Boolean");
        this.setColour("#10b981");
        this.setTooltip("Read the value of a digital pin");
        this.setMovable(true);
      }
    },

    'arduino_analog_read': {
      init: function() {
        this.appendDummyInput()
          .appendField("analog read pin")
          .appendField(new Blockly.FieldDropdown([
            ["A0", "A0"],
            ["A1", "A1"],
            ["A2", "A2"],
            ["A3", "A3"],
            ["A4", "A4"],
            ["A5", "A5"]
          ]), "PIN");
        this.setOutput(true, "Number");
        this.setColour("#f59e0b");
        this.setTooltip("Read analog value from pin (0-1023)");
        this.setMovable(true);
      }
    },

    'arduino_analog_write': {
      init: function() {
        this.appendDummyInput()
          .appendField("analog write pin")
          .appendField(new Blockly.FieldNumber(9, 0, 13), "PIN")
          .appendField("value")
          .appendField(new Blockly.FieldNumber(255, 0, 255), "VALUE");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#f59e0b");
        this.setTooltip("Write PWM value to pin (0-255)");
        this.setMovable(true);
      }
    },

    'arduino_serial_begin': {
      init: function() {
        this.appendDummyInput()
          .appendField("serial begin at")
          .appendField(new Blockly.FieldDropdown([
            ["9600", "9600"],
            ["19200", "19200"],
            ["38400", "38400"],
            ["57600", "57600"],
            ["115200", "115200"]
          ]), "BAUD")
          .appendField("baud");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#3b82f6");
        this.setTooltip("Initialize serial communication");
        this.setMovable(true);
      }
    },

    'arduino_serial_print': {
      init: function() {
        this.appendValueInput("TEXT")
          .setCheck(["String", "Number"])
          .appendField("serial print");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#3b82f6");
        this.setTooltip("Print text or number to serial monitor");
        this.setMovable(true);
      }
    },

    'arduino_led_builtin': {
      init: function() {
        this.appendDummyInput()
          .appendField("built-in LED")
          .appendField(new Blockly.FieldDropdown([
            ["ON", "HIGH"],
            ["OFF", "LOW"]
          ]), "STATE");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#10b981");
        this.setTooltip("Control the built-in LED");
        this.setMovable(true);
      }
    },

    'arduino_temperature_read': {
      init: function() {
        this.appendDummyInput()
          .appendField("read temperature (°C)");
        this.setOutput(true, "Number");
        this.setColour("#10b981");
        this.setTooltip("Read temperature from HTS221 sensor");
        this.setMovable(true);
      }
    },

    'arduino_humidity_read': {
      init: function() {
        this.appendDummyInput()
          .appendField("read humidity (%)");
        this.setOutput(true, "Number");
        this.setColour("#10b981");
        this.setTooltip("Read humidity from HTS221 sensor");
        this.setMovable(true);
      }
    },

    'arduino_imu_read': {
      init: function() {
        this.appendDummyInput()
          .appendField("read acceleration")
          .appendField(new Blockly.FieldDropdown([
            ["X", "x"],
            ["Y", "y"],
            ["Z", "z"]
          ]), "AXIS");
        this.setOutput(true, "Number");
        this.setColour("#10b981");
        this.setTooltip("Read acceleration data from IMU sensor");
        this.setMovable(true);
      }
    },

    'arduino_microphone_read': {
      init: function() {
        this.appendDummyInput()
          .appendField("read microphone level");
        this.setOutput(true, "Number");
        this.setColour("#10b981");
        this.setTooltip("Read microphone sound level");
        this.setMovable(true);
      }
    },

    'arduino_sensor_begin': {
      init: function() {
        this.appendDummyInput()
          .appendField("initialize sensors");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#10b981");
        this.setTooltip("Initialize sensor components");
        this.setMovable(true);
      }
    },

    'arduino_imu_begin': {
      init: function() {
        this.appendDummyInput()
          .appendField("initialize IMU sensor");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#10b981");
        this.setTooltip("Initialize IMU motion sensor");
        this.setMovable(true);
      }
    }
  };

  // Register each block definition
  Object.entries(blockDefinitions).forEach(([blockType, definition]) => {
    if (!registeredBlocks.has(blockType)) {
      try {
        Blockly.Blocks[blockType] = definition;
        registeredBlocks.add(blockType);
        console.log(`Registered block: ${blockType}`);
      } catch (error) {
        console.error(`Error registering block ${blockType}:`, error);
      }
    }
  });

  console.log('Arduino blocks defined successfully. Total registered:', registeredBlocks.size);
};

// Export function to check if blocks are registered
export const areBlocksRegistered = () => {
  return registeredBlocks.size > 0;
};

// Export function to get registered block types
export const getRegisteredBlockTypes = () => {
  return Array.from(registeredBlocks);
};
