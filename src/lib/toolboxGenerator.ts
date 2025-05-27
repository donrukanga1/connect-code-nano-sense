
export const generateToolboxConfig = (availableBlocks: string[], selectedComponents: any[]) => {
  const hasBasicBlocks = availableBlocks.includes('arduino_setup');
  const hasSensorBlocks = availableBlocks.some(block => 
    ['arduino_temperature_read', 'arduino_humidity_read', 'arduino_imu_read', 'arduino_microphone_read'].includes(block)
  );
  const hasIOBlocks = availableBlocks.some(block => 
    ['arduino_digital_write', 'arduino_digital_read', 'arduino_pin_mode'].includes(block)
  );

  let toolboxXml = '<xml>';

  // Arduino Basics (always available)
  if (hasBasicBlocks) {
    toolboxXml += `
      <category name="Arduino Basics" colour="#3b82f6">
        <block type="arduino_setup"></block>
        <block type="arduino_loop"></block>
        <block type="arduino_delay"></block>
        <block type="arduino_serial_begin"></block>
        <block type="arduino_serial_print">
          <value name="TEXT">
            <block type="text">
              <field name="TEXT">Hello World</field>
            </block>
          </value>
        </block>
      </category>`;
  }

  // Component-specific categories
  if (selectedComponents.length > 0) {
    selectedComponents.forEach(component => {
      const componentColor = getComponentColor(component.type);
      toolboxXml += `
        <category name="${component.name}" colour="${componentColor}">`;
      
      component.blocks.forEach((blockType: string) => {
        if (availableBlocks.includes(blockType)) {
          toolboxXml += `<block type="${blockType}"></block>`;
        }
      });
      
      toolboxXml += '</category>';
    });
  }

  // Digital I/O (if any IO components are selected)
  if (hasIOBlocks) {
    toolboxXml += `
      <category name="Digital I/O" colour="#10b981">
        ${availableBlocks.includes('arduino_pin_mode') ? '<block type="arduino_pin_mode"></block>' : ''}
        ${availableBlocks.includes('arduino_digital_write') ? '<block type="arduino_digital_write"></block>' : ''}
        ${availableBlocks.includes('arduino_digital_read') ? '<block type="arduino_digital_read"></block>' : ''}
        <block type="arduino_led_builtin"></block>
      </category>`;
  }

  // Values (always available)
  toolboxXml += `
    <category name="Values" colour="#84cc16">
      <block type="text">
        <field name="TEXT">hello</field>
      </block>
      <block type="math_number">
        <field name="NUM">123</field>
      </block>
    </category>`;

  // Logic (always available)
  toolboxXml += `
    <category name="Logic" colour="#06b6d4">
      <block type="logic_compare"></block>
      <block type="logic_operation"></block>
      <block type="logic_negate"></block>
      <block type="logic_boolean"></block>
    </category>`;

  // Control (always available)
  toolboxXml += `
    <category name="Control" colour="#8b5cf6">
      <block type="controls_if"></block>
      <block type="controls_repeat_ext">
        <value name="TIMES">
          <block type="math_number">
            <field name="NUM">10</field>
          </block>
        </value>
      </block>
      <block type="controls_whileUntil"></block>
    </category>`;

  // Variables and Functions (always available)
  toolboxXml += `
    <category name="Variables" colour="#f97316" custom="VARIABLE"></category>
    <category name="Functions" colour="#ec4899" custom="PROCEDURE"></category>`;

  toolboxXml += '</xml>';
  return toolboxXml;
};

const getComponentColor = (type: string): string => {
  switch (type) {
    case 'sensor': return '#10b981';
    case 'actuator': return '#f59e0b';
    case 'input': return '#3b82f6';
    default: return '#6b7280';
  }
};
