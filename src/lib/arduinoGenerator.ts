
import { javascriptGenerator } from "blockly/javascript";

export const setupArduinoGenerator = () => {
  // Arduino Setup
  javascriptGenerator.forBlock['arduino_setup'] = function(block: any) {
    const statements_setup_code = javascriptGenerator.statementToCode(block, 'SETUP_CODE');
    const code = `void setup() {\n${statements_setup_code}}\n\n`;
    return code;
  };

  // Arduino Loop
  javascriptGenerator.forBlock['arduino_loop'] = function(block: any) {
    const statements_loop_code = javascriptGenerator.statementToCode(block, 'LOOP_CODE');
    const code = `void loop() {\n${statements_loop_code}}\n\n`;
    return code;
  };

  // Delay
  javascriptGenerator.forBlock['arduino_delay'] = function(block: any) {
    const value_delay_time = javascriptGenerator.valueToCode(block, 'DELAY_TIME', javascriptGenerator.ORDER_ATOMIC);
    const code = `  delay(${value_delay_time || 1000});\n`;
    return code;
  };

  // Pin Mode
  javascriptGenerator.forBlock['arduino_pin_mode'] = function(block: any) {
    const value_pin = javascriptGenerator.valueToCode(block, 'PIN', javascriptGenerator.ORDER_ATOMIC);
    const dropdown_mode = block.getFieldValue('MODE');
    const code = `  pinMode(${value_pin || 13}, ${dropdown_mode});\n`;
    return code;
  };

  // Digital Write
  javascriptGenerator.forBlock['arduino_digital_write'] = function(block: any) {
    const value_pin = javascriptGenerator.valueToCode(block, 'PIN', javascriptGenerator.ORDER_ATOMIC);
    const dropdown_state = block.getFieldValue('STATE');
    const code = `  digitalWrite(${value_pin || 13}, ${dropdown_state});\n`;
    return code;
  };

  // Digital Read
  javascriptGenerator.forBlock['arduino_digital_read'] = function(block: any) {
    const value_pin = javascriptGenerator.valueToCode(block, 'PIN', javascriptGenerator.ORDER_ATOMIC);
    const code = `digitalRead(${value_pin || 2})`;
    return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
  };

  // Analog Read
  javascriptGenerator.forBlock['arduino_analog_read'] = function(block: any) {
    const value_pin = javascriptGenerator.valueToCode(block, 'PIN', javascriptGenerator.ORDER_ATOMIC);
    const code = `analogRead(${value_pin || 'A0'})`;
    return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
  };

  // Analog Write
  javascriptGenerator.forBlock['arduino_analog_write'] = function(block: any) {
    const value_pin = javascriptGenerator.valueToCode(block, 'PIN', javascriptGenerator.ORDER_ATOMIC);
    const value_value = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
    const code = `  analogWrite(${value_pin || 9}, ${value_value || 0});\n`;
    return code;
  };

  // Serial Begin
  javascriptGenerator.forBlock['arduino_serial_begin'] = function(block: any) {
    const value_baud_rate = javascriptGenerator.valueToCode(block, 'BAUD_RATE', javascriptGenerator.ORDER_ATOMIC);
    const code = `  Serial.begin(${value_baud_rate || 9600});\n`;
    return code;
  };

  // Serial Print
  javascriptGenerator.forBlock['arduino_serial_print'] = function(block: any) {
    const value_text = javascriptGenerator.valueToCode(block, 'TEXT', javascriptGenerator.ORDER_ATOMIC);
    const code = `  Serial.println(${value_text || '"Hello World"'});\n`;
    return code;
  };

  // LED Built-in
  javascriptGenerator.forBlock['arduino_led_builtin'] = function(block: any) {
    const dropdown_state = block.getFieldValue('STATE');
    const code = `  digitalWrite(LED_BUILTIN, ${dropdown_state});\n`;
    return code;
  };

  // Map Value
  javascriptGenerator.forBlock['arduino_map_value'] = function(block: any) {
    const value_value = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
    const value_from_min = javascriptGenerator.valueToCode(block, 'FROM_MIN', javascriptGenerator.ORDER_ATOMIC);
    const value_from_max = javascriptGenerator.valueToCode(block, 'FROM_MAX', javascriptGenerator.ORDER_ATOMIC);
    const value_to_min = javascriptGenerator.valueToCode(block, 'TO_MIN', javascriptGenerator.ORDER_ATOMIC);
    const value_to_max = javascriptGenerator.valueToCode(block, 'TO_MAX', javascriptGenerator.ORDER_ATOMIC);
    const code = `map(${value_value || 0}, ${value_from_min || 0}, ${value_from_max || 1023}, ${value_to_min || 0}, ${value_to_max || 255})`;
    return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
  };

  // Arduino Nano 33 BLE Sense specific generators
  javascriptGenerator.forBlock['arduino_imu_begin'] = function(block: any) {
    const code = `  if (!IMU.begin()) {\n    Serial.println("Failed to initialize IMU!");\n    while (1);\n  }\n`;
    return code;
  };

  javascriptGenerator.forBlock['arduino_imu_read'] = function(block: any) {
    const dropdown_axis = block.getFieldValue('AXIS');
    let code = '';
    
    switch(dropdown_axis) {
      case 'accelerationX':
        code = 'IMU.readAcceleration(x, y, z); x';
        break;
      case 'accelerationY':
        code = 'IMU.readAcceleration(x, y, z); y';
        break;
      case 'accelerationZ':
        code = 'IMU.readAcceleration(x, y, z); z';
        break;
      case 'gyroscopeX':
        code = 'IMU.readGyroscope(x, y, z); x';
        break;
      case 'gyroscopeY':
        code = 'IMU.readGyroscope(x, y, z); y';
        break;
      case 'gyroscopeZ':
        code = 'IMU.readGyroscope(x, y, z); z';
        break;
    }
    
    return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['arduino_humidity_read'] = function(block: any) {
    const code = 'HTS.readHumidity()';
    return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['arduino_temperature_read'] = function(block: any) {
    const code = 'HTS.readTemperature()';
    return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['arduino_pressure_read'] = function(block: any) {
    const code = 'BARO.readPressure()';
    return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['arduino_microphone_read'] = function(block: any) {
    const code = 'PDM.available() ? PDM.read() : 0';
    return [code, javascriptGenerator.ORDER_CONDITIONAL];
  };
};
