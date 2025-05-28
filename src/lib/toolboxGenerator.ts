
export const generateToolboxConfig = (availableBlocks: string[] = [], selectedComponents: any[] = []) => {
  // Ensure availableBlocks is always an array
  const blocks = Array.isArray(availableBlocks) ? availableBlocks : [];
  
  console.log('Generating toolbox with blocks:', blocks);
  console.log('Selected components:', selectedComponents);

  let toolboxXml = '<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox">';

  // Arduino Basics (always available)
  toolboxXml += `
    <category name="Arduino Basics" colour="#3b82f6" categorystyle="arduino_blocks">
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

  // Component-specific categories
  if (selectedComponents && selectedComponents.length > 0) {
    selectedComponents.forEach(component => {
      if (component && component.blocks && component.blocks.length > 0) {
        const componentColor = getComponentColor(component.type);
        toolboxXml += `
          <category name="${component.name}" colour="${componentColor}">`;
        
        component.blocks.forEach((blockType: string) => {
          // Only add blocks that exist in availableBlocks
          if (blocks.includes(blockType)) {
            toolboxXml += `
            <block type="${blockType}"></block>`;
          }
        });
        
        toolboxXml += `
          </category>`;
      }
    });
  }

  // Digital I/O (always show if any components selected)
  const hasIOBlocks = blocks.some(block => 
    ['arduino_digital_write', 'arduino_digital_read', 'arduino_pin_mode'].includes(block)
  );
  
  if (hasIOBlocks || selectedComponents.length > 0) {
    toolboxXml += `
      <category name="Digital I/O" colour="#10b981" categorystyle="sensor_blocks">`;
    
    if (blocks.includes('arduino_pin_mode')) {
      toolboxXml += `
        <block type="arduino_pin_mode"></block>`;
    }
    if (blocks.includes('arduino_digital_write')) {
      toolboxXml += `
        <block type="arduino_digital_write"></block>`;
    }
    if (blocks.includes('arduino_digital_read')) {
      toolboxXml += `
        <block type="arduino_digital_read"></block>`;
    }
    
    // Always include built-in LED
    toolboxXml += `
        <block type="arduino_led_builtin"></block>`;
    toolboxXml += `
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
    <category name="Control" colour="#8b5cf6" categorystyle="control_blocks">
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
  
  console.log('Generated toolbox XML length:', toolboxXml.length);
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
