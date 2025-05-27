
import { javascriptGenerator } from 'blockly/javascript';

export const setupArduinoGenerator = () => {
  // Arduino Setup Block
  javascriptGenerator.forBlock['arduino_setup'] = function(block: any) {
    const statements = javascriptGenerator.statementToCode(block, 'SETUP_CODE');
    return `void setup() {\n${statements}}\n\n`;
  };

  // Arduino Loop Block
  javascriptGenerator.forBlock['arduino_loop'] = function(block: any) {
    const statements = javascriptGenerator.statementToCode(block, 'LOOP_CODE');
    return `void loop() {\n${statements}}\n`;
  };

  // Pin Mode Block
  javascriptGenerator.forBlock['arduino_pin_mode'] = function(block: any) {
    const pin = javascriptGenerator.valueToCode(block, 'PIN', 0) || '13';
    const mode = block.getFieldValue('MODE');
    return `  pinMode(${pin}, ${mode});\n`;
  };

  // Digital Write Block
  javascriptGenerator.forBlock['arduino_digital_write'] = function(block: any) {
    const pin = javascriptGenerator.valueToCode(block, 'PIN', 0) || '13';
    const value = block.getFieldValue('VALUE');
    return `  digitalWrite(${pin}, ${value});\n`;
  };

  // Digital Read Block
  javascriptGenerator.forBlock['arduino_digital_read'] = function(block: any) {
    const pin = javascriptGenerator.valueToCode(block, 'PIN', 0) || '13';
    return [`digitalRead(${pin})`, 0];
  };

  // Analog Read Block
  javascriptGenerator.forBlock['arduino_analog_read'] = function(block: any) {
    const pin = javascriptGenerator.valueToCode(block, 'PIN', 0) || 'A0';
    return [`analogRead(${pin})`, 0];
  };

  // Analog Write Block
  javascriptGenerator.forBlock['arduino_analog_write'] = function(block: any) {
    const pin = javascriptGenerator.valueToCode(block, 'PIN', 0) || '9';
    const value = javascriptGenerator.valueToCode(block, 'VALUE', 0) || '0';
    return `  analogWrite(${pin}, ${value});\n`;
  };

  // Delay Block
  javascriptGenerator.forBlock['arduino_delay'] = function(block: any) {
    const time = javascriptGenerator.valueToCode(block, 'TIME', 0) || '1000';
    return `  delay(${time});\n`;
  };

  // Serial Begin Block
  javascriptGenerator.forBlock['arduino_serial_begin'] = function(block: any) {
    const baud = block.getFieldValue('BAUD') || '9600';
    return `  Serial.begin(${baud});\n`;
  };

  // Serial Print Block
  javascriptGenerator.forBlock['arduino_serial_print'] = function(block: any) {
    const text = javascriptGenerator.valueToCode(block, 'TEXT', 0) || '""';
    return `  Serial.println(${text});\n`;
  };

  // Built-in LED Block
  javascriptGenerator.forBlock['arduino_led_builtin'] = function(block: any) {
    return ['LED_BUILTIN', 0];
  };

  // Map Value Block
  javascriptGenerator.forBlock['arduino_map_value'] = function(block: any) {
    const value = javascriptGenerator.valueToCode(block, 'VALUE', 0) || '0';
    const fromLow = javascriptGenerator.valueToCode(block, 'FROM_LOW', 0) || '0';
    const fromHigh = javascriptGenerator.valueToCode(block, 'FROM_HIGH', 0) || '1023';
    const toLow = javascriptGenerator.valueToCode(block, 'TO_LOW', 0) || '0';
    const toHigh = javascriptGenerator.valueToCode(block, 'TO_HIGH', 0) || '255';
    return [`map(${value}, ${fromLow}, ${fromHigh}, ${toLow}, ${toHigh})`, 0];
  };

  // IMU Begin Block
  javascriptGenerator.forBlock['arduino_imu_begin'] = function(block: any) {
    return `  if (!IMU.begin()) {\n    Serial.println("Failed to initialize IMU!");\n    while (1);\n  }\n`;
  };

  // IMU Read Block
  javascriptGenerator.forBlock['arduino_imu_read'] = function(block: any) {
    const axis = block.getFieldValue('AXIS');
    const sensor = block.getFieldValue('SENSOR');
    
    let code = '';
    if (sensor === 'ACCELEROMETER') {
      code = `  if (IMU.accelerationAvailable()) {\n    IMU.readAcceleration(x, y, z);\n  }\n`;
    } else if (sensor === 'GYROSCOPE') {
      code = `  if (IMU.gyroscopeAvailable()) {\n    IMU.readGyroscope(x, y, z);\n  }\n`;
    } else if (sensor === 'MAGNETOMETER') {
      code = `  if (IMU.magneticFieldAvailable()) {\n    IMU.readMagneticField(x, y, z);\n  }\n`;
    }
    
    return [axis.toLowerCase(), 0];
  };

  // Temperature Read Block
  javascriptGenerator.forBlock['arduino_temperature_read'] = function(block: any) {
    return [`HTS.readTemperature()`, 0];
  };

  // Humidity Read Block
  javascriptGenerator.forBlock['arduino_humidity_read'] = function(block: any) {
    return [`HTS.readHumidity()`, 0];
  };

  // Pressure Read Block
  javascriptGenerator.forBlock['arduino_pressure_read'] = function(block: any) {
    return [`BARO.readPressure()`, 0];
  };

  // Microphone Read Block
  javascriptGenerator.forBlock['arduino_microphone_read'] = function(block: any) {
    return [`PDM.available()`, 0];
  };
};
