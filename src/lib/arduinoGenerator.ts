
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
    const pin = block.getFieldValue('PIN');
    const mode = block.getFieldValue('MODE');
    return `  pinMode(${pin}, ${mode});\n`;
  };

  // Digital Write Block
  javascriptGenerator.forBlock['arduino_digital_write'] = function(block: any) {
    const pin = block.getFieldValue('PIN');
    const state = block.getFieldValue('STATE');
    return `  digitalWrite(${pin}, ${state});\n`;
  };

  // Digital Read Block
  javascriptGenerator.forBlock['arduino_digital_read'] = function(block: any) {
    const pin = block.getFieldValue('PIN');
    return [`digitalRead(${pin})`, 0];
  };

  // Analog Read Block
  javascriptGenerator.forBlock['arduino_analog_read'] = function(block: any) {
    const pin = block.getFieldValue('PIN');
    return [`analogRead(${pin})`, 0];
  };

  // Analog Write Block
  javascriptGenerator.forBlock['arduino_analog_write'] = function(block: any) {
    const pin = block.getFieldValue('PIN');
    const value = block.getFieldValue('VALUE');
    return `  analogWrite(${pin}, ${value});\n`;
  };

  // Delay Block
  javascriptGenerator.forBlock['arduino_delay'] = function(block: any) {
    const time = block.getFieldValue('TIME');
    return `  delay(${time});\n`;
  };

  // Serial Begin Block
  javascriptGenerator.forBlock['arduino_serial_begin'] = function(block: any) {
    const baud = block.getFieldValue('BAUD');
    return `  Serial.begin(${baud});\n`;
  };

  // Serial Print Block
  javascriptGenerator.forBlock['arduino_serial_print'] = function(block: any) {
    const text = javascriptGenerator.valueToCode(block, 'TEXT', 0) || '""';
    return `  Serial.println(${text});\n`;
  };

  // Built-in LED Block
  javascriptGenerator.forBlock['arduino_led_builtin'] = function(block: any) {
    const state = block.getFieldValue('STATE');
    return `  digitalWrite(LED_BUILTIN, ${state});\n`;
  };

  // Text Block
  javascriptGenerator.forBlock['text'] = function(block: any) {
    const text = block.getFieldValue('TEXT');
    return [`"${text}"`, 0];
  };

  // Number Block
  javascriptGenerator.forBlock['math_number'] = function(block: any) {
    const number = block.getFieldValue('NUM');
    return [number, 0];
  };
};
