
import * as Blockly from "blockly";

export const arduinoGenerator = new Blockly.Generator("Arduino");

// Create a custom definitions object since definitions_ is protected
const definitions: { [key: string]: string } = {};

export const setupArduinoGenerator = () => {
  // Clear definitions
  Object.keys(definitions).forEach(key => delete definitions[key]);

  // Setup/Loop Block
  arduinoGenerator.forBlock["controls_setup"] = function (block: Blockly.Block) {
    const setupCode = arduinoGenerator.statementToCode(block, "SETUP");
    const loopCode = arduinoGenerator.statementToCode(block, "LOOP");
    const definitionsCode = Object.values(definitions).join("");
    return `${definitionsCode}void setup() {\n${setupCode}}\n\nvoid loop() {\n${loopCode}}\n`;
  };

  // LED Block
  arduinoGenerator.forBlock["component_led"] = function (block: Blockly.Block) {
    const pin = block.getFieldValue("PIN");
    const state = block.getFieldValue("STATE");
    definitions[`pinMode_${pin}`] = `  pinMode(${pin}, OUTPUT);\n`;
    return `digitalWrite(${pin}, ${state});\n`;
  };

  // IMU Block - Returns tuple for value blocks
  arduinoGenerator.forBlock["component_imu"] = function (block: Blockly.Block) {
    const sensorType = block.getFieldValue("SENSOR_TYPE");
    definitions["include_LSM6DS3"] = `#include <Arduino_LSM6DS3.h>\n`;
    definitions["imu_setup"] = `void initIMU() { if (!IMU.begin()) { while (1); } }\n`;
    definitions["imu_call_setup"] = `  initIMU();\n`;
    let code = "";
    switch (sensorType) {
      case "ACC_X":
        code = "float ax; IMU.readAcceleration(ax, 0, 0); ax";
        break;
      case "ACC_Y":
        code = "float ay; IMU.readAcceleration(0, ay, 0); ay";
        break;
      case "ACC_Z":
        code = "float az; IMU.readAcceleration(0, 0, az); az";
        break;
      case "GYRO_X":
        code = "float gx; IMU.readGyroscope(gx, 0, 0); gx";
        break;
      case "GYRO_Y":
        code = "float gy; IMU.readGyroscope(0, gy, 0); gy";
        break;
      case "GYRO_Z":
        code = "float gz; IMU.readGyroscope(0, 0, gz); gz";
        break;
      default:
        code = "0";
    }
    return [code, 0]; // Return tuple for value blocks
  };

  // Microphone Block - Returns tuple for value blocks
  arduinoGenerator.forBlock["component_microphone"] = function (block: Blockly.Block) {
    definitions["include_PDM"] = `#include <PDM.h>\n`;
    definitions["mic_buffer"] = `short sampleBuffer[256];\nvolatile int samplesRead;\n`;
    definitions["mic_setup"] = `
void initMicrophone() {
  PDM.onReceive(onPDMdata);
  if (!PDM.begin(1, 16000)) { while (1); }
}
void onPDMdata() {
  int bytesAvailable = PDM.available();
  PDM.read(sampleBuffer, bytesAvailable);
  samplesRead = bytesAvailable / 2;
}\n`;
    definitions["mic_call_setup"] = `  initMicrophone();\n`;
    return ["samplesRead > 0 ? sampleBuffer[0] : 0", 0]; // Return tuple for value blocks
  };

  arduinoGenerator.scrub_ = function (block: Blockly.Block, code: string, opt_thisOnly?: boolean) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    let nextCode = "";
    if (nextBlock && !opt_thisOnly) {
      nextCode = arduinoGenerator.blockToCode(nextBlock);
    }
    return code + nextCode;
  };
};

export const generateArduinoCode = (workspace: Blockly.WorkspaceSvg): string => {
  try {
    const result = arduinoGenerator.workspaceToCode(workspace);
    // Handle both string and tuple returns from workspaceToCode
    let code: string;
    if (Array.isArray(result)) {
      code = result[0] || "// No blocks to generate code";
    } else {
      code = result || "// No blocks to generate code";
    }
    return code;
  } catch (error) {
    console.error("Error generating code:", error);
    return "// Error generating code";
  }
};
