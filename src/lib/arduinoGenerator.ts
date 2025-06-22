import * as Blockly from "blockly";

export const arduinoGenerator = new Blockly.Generator("Arduino");

export const setupArduinoGenerator = () => {
  // Setup/Loop Block
  arduinoGenerator["controls_setup"] = function (block: Blockly.Block) {
    const setupCode = arduinoGenerator.statementToCode(block, "SETUP");
    const loopCode = arduinoGenerator.statementToCode(block, "LOOP");
    const definitions = Object.values(arduinoGenerator.definitions_).join("");
    return `${definitions}void setup() {\n${setupCode}}\n\nvoid loop() {\n${loopCode}}\n`;
  };

  // LED Block
  arduinoGenerator["component_led"] = function (block: Blockly.Block) {
    const pin = block.getFieldValue("PIN");
    const state = block.getFieldValue("STATE");
    arduinoGenerator.definitions_[`pinMode_${pin}`] = `pinMode(${pin}, OUTPUT);\n`;
    return `digitalWrite(${pin}, ${state});\n`;
  };

  // IMU Block
  arduinoGenerator["component_imu"] = function (block: Blockly.Block) {
    const sensorType = block.getFieldValue("SENSOR_TYPE");
    arduinoGenerator.definitions_["include_LSM6DS3"] = `#include <Arduino_LSM6DS3.h>\n`;
    arduinoGenerator.definitions_["imu_setup"] = `void initIMU() { if (!IMU.begin()) { while (1); } }\n`;
    arduinoGenerator.definitions_["imu_call_setup"] = `initIMU();\n`;
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
    return [code, arduinoGenerator.ORDER_NONE];
  };

  // Microphone Block
  arduinoGenerator["component_microphone"] = function (block: Blockly.Block) {
    arduinoGenerator.definitions_["include_PDM"] = `#include <PDM.h>\n`;
    arduinoGenerator.definitions_["mic_buffer"] = `short sampleBuffer[256];\nvolatile int samplesRead;\n`;
    arduinoGenerator.definitions_["mic_setup"] = `
void initMicrophone() {
  PDM.onReceive(onPDMdata);
  if (!PDM.begin(1, 16000)) { while (1); }
}
void onPDMdata() {
  int bytesAvailable = PDM.available();
  PDM.read(sampleBuffer, bytesAvailable);
  samplesRead = bytesAvailable / 2;
}\n`;
    arduinoGenerator.definitions_["mic_call_setup"] = `initMicrophone();\n`;
    return ["samplesRead > 0 ? sampleBuffer[0] : 0", arduinoGenerator.ORDER_NONE];
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
