
import * as Blockly from "blockly";

export const defineArduinoBlocks = () => {
  // Arduino Setup Block
  Blockly.Blocks['arduino_setup'] = {
    init: function() {
      this.appendDummyInput()
        .appendField("Setup (runs once)");
      this.appendStatementInput("SETUP_CODE")
        .setCheck(null);
      this.setColour("#3b82f6");
      this.setTooltip("Arduino setup function - runs once when the program starts");
      this.setHelpUrl("");
      this.setDeletable(false);
    }
  };

  // Arduino Loop Block
  Blockly.Blocks['arduino_loop'] = {
    init: function() {
      this.appendDummyInput()
        .appendField("Loop (runs forever)");
      this.appendStatementInput("LOOP_CODE")
        .setCheck(null);
      this.setColour("#3b82f6");
      this.setTooltip("Arduino loop function - runs continuously");
      this.setHelpUrl("");
      this.setDeletable(false);
    }
  };

  // Delay Block
  Blockly.Blocks['arduino_delay'] = {
    init: function() {
      this.appendValueInput("DELAY_TIME")
        .setCheck("Number")
        .appendField("delay");
      this.appendDummyInput()
        .appendField("milliseconds");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#3b82f6");
      this.setTooltip("Pause the program for specified milliseconds");
    }
  };

  // Pin Mode Block
  Blockly.Blocks['arduino_pin_mode'] = {
    init: function() {
      this.appendValueInput("PIN")
        .setCheck("Number")
        .appendField("set pin");
      this.appendDummyInput()
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
    }
  };

  // Digital Write Block
  Blockly.Blocks['arduino_digital_write'] = {
    init: function() {
      this.appendValueInput("PIN")
        .setCheck("Number")
        .appendField("digital write pin");
      this.appendDummyInput()
        .appendField("value")
        .appendField(new Blockly.FieldDropdown([
          ["HIGH", "HIGH"],
          ["LOW", "LOW"]
        ]), "STATE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#10b981");
      this.setTooltip("Write HIGH or LOW to a digital pin");
    }
  };

  // Digital Read Block
  Blockly.Blocks['arduino_digital_read'] = {
    init: function() {
      this.appendValueInput("PIN")
        .setCheck("Number")
        .appendField("digital read pin");
      this.setOutput(true, "Boolean");
      this.setColour("#10b981");
      this.setTooltip("Read the value of a digital pin");
    }
  };

  // Analog Read Block
  Blockly.Blocks['arduino_analog_read'] = {
    init: function() {
      this.appendValueInput("PIN")
        .setCheck("Number")
        .appendField("analog read pin");
      this.setOutput(true, "Number");
      this.setColour("#f59e0b");
      this.setTooltip("Read analog value from pin (0-1023)");
    }
  };

  // Analog Write Block
  Blockly.Blocks['arduino_analog_write'] = {
    init: function() {
      this.appendValueInput("PIN")
        .setCheck("Number")
        .appendField("analog write pin");
      this.appendValueInput("VALUE")
        .setCheck("Number")
        .appendField("value");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#f59e0b");
      this.setTooltip("Write PWM value to pin (0-255)");
    }
  };

  // Serial Begin Block
  Blockly.Blocks['arduino_serial_begin'] = {
    init: function() {
      this.appendValueInput("BAUD_RATE")
        .setCheck("Number")
        .appendField("serial begin at");
      this.appendDummyInput()
        .appendField("baud");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#3b82f6");
      this.setTooltip("Initialize serial communication");
    }
  };

  // Serial Print Block
  Blockly.Blocks['arduino_serial_print'] = {
    init: function() {
      this.appendValueInput("TEXT")
        .setCheck(["String", "Number"])
        .appendField("serial print");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#3b82f6");
      this.setTooltip("Print text or number to serial monitor");
    }
  };

  // LED Built-in Block
  Blockly.Blocks['arduino_led_builtin'] = {
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
    }
  };

  // Map Value Block
  Blockly.Blocks['arduino_map_value'] = {
    init: function() {
      this.appendValueInput("VALUE")
        .setCheck("Number")
        .appendField("map");
      this.appendValueInput("FROM_MIN")
        .setCheck("Number")
        .appendField("from (");
      this.appendValueInput("FROM_MAX")
        .setCheck("Number")
        .appendField(",");
      this.appendValueInput("TO_MIN")
        .setCheck("Number")
        .appendField(") to (");
      this.appendValueInput("TO_MAX")
        .setCheck("Number")
        .appendField(",");
      this.appendDummyInput()
        .appendField(")");
      this.setOutput(true, "Number");
      this.setColour("#f59e0b");
      this.setTooltip("Map a value from one range to another");
    }
  };

  // Arduino Nano 33 BLE Sense specific blocks
  Blockly.Blocks['arduino_imu_begin'] = {
    init: function() {
      this.appendDummyInput()
        .appendField("initialize IMU sensor");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#ef4444");
      this.setTooltip("Initialize the built-in IMU sensor");
    }
  };

  Blockly.Blocks['arduino_imu_read'] = {
    init: function() {
      this.appendDummyInput()
        .appendField("read IMU")
        .appendField(new Blockly.FieldDropdown([
          ["acceleration X", "accelerationX"],
          ["acceleration Y", "accelerationY"],
          ["acceleration Z", "accelerationZ"],
          ["gyroscope X", "gyroscopeX"],
          ["gyroscope Y", "gyroscopeY"],
          ["gyroscope Z", "gyroscopeZ"]
        ]), "AXIS");
      this.setOutput(true, "Number");
      this.setColour("#ef4444");
      this.setTooltip("Read IMU sensor data");
    }
  };

  Blockly.Blocks['arduino_humidity_read'] = {
    init: function() {
      this.appendDummyInput()
        .appendField("read humidity sensor");
      this.setOutput(true, "Number");
      this.setColour("#ef4444");
      this.setTooltip("Read humidity percentage");
    }
  };

  Blockly.Blocks['arduino_temperature_read'] = {
    init: function() {
      this.appendDummyInput()
        .appendField("read temperature sensor");
      this.setOutput(true, "Number");
      this.setColour("#ef4444");
      this.setTooltip("Read temperature in Celsius");
    }
  };

  Blockly.Blocks['arduino_pressure_read'] = {
    init: function() {
      this.appendDummyInput()
        .appendField("read pressure sensor");
      this.setOutput(true, "Number");
      this.setColour("#ef4444");
      this.setTooltip("Read atmospheric pressure");
    }
  };

  Blockly.Blocks['arduino_microphone_read'] = {
    init: function() {
      this.appendDummyInput()
        .appendField("read microphone");
      this.setOutput(true, "Number");
      this.setColour("#ef4444");
      this.setTooltip("Read microphone sound level");
    }
  };
};
