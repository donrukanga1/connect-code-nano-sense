
export const generateToolboxConfig = (availableBlocks: string[] = [], selectedComponents: any[] = []) => {
  // Ensure availableBlocks is always an array
  const blocks = Array.isArray(availableBlocks) ? availableBlocks : [];
  
  console.log('DEBUG: Generating toolbox with blocks:', blocks);
  console.log('DEBUG: Selected components:', selectedComponents);

  let toolboxXml = '<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox">';

  try {
    // Arduino Basics (always available) - removed categorystyle to fix conflicts
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
    console.log('DEBUG: Added Arduino Basics category');

    // Component-specific categories
    if (selectedComponents && selectedComponents.length > 0) {
      console.log('DEBUG: Processing', selectedComponents.length, 'selected components');
      selectedComponents.forEach((component, index) => {
        console.log(`DEBUG: Processing component ${index}:`, component?.name, component?.type);
        if (component && component.blocks && component.blocks.length > 0) {
          const componentColor = getComponentColor(component.type);
          toolboxXml += `
            <category name="${component.name}" colour="${componentColor}">`;
          
          console.log(`DEBUG: Adding blocks for ${component.name}:`, component.blocks);
          component.blocks.forEach((blockType: string) => {
            // Only add blocks that exist in availableBlocks
            if (blocks.includes(blockType)) {
              toolboxXml += `
              <block type="${blockType}"></block>`;
              console.log(`DEBUG: Added block ${blockType} to ${component.name}`);
            } else {
              console.log(`DEBUG: Block ${blockType} not in available blocks, skipping`);
            }
          });
          
          toolboxXml += `
            </category>`;
        } else {
          console.log(`DEBUG: Component ${index} missing blocks or invalid:`, component);
        }
      });
    } else {
      console.log('DEBUG: No selected components to process');
    }

    // Digital I/O (always show if any components selected) - removed categorystyle
    const hasIOBlocks = blocks.some(block => 
      ['arduino_digital_write', 'arduino_digital_read', 'arduino_pin_mode'].includes(block)
    );
    
    console.log('DEBUG: Has IO blocks:', hasIOBlocks, 'Components selected:', selectedComponents.length > 0);
    if (hasIOBlocks || selectedComponents.length > 0) {
      toolboxXml += `
        <category name="Digital I/O" colour="#10b981">`;
      
      if (blocks.includes('arduino_pin_mode')) {
        toolboxXml += `
          <block type="arduino_pin_mode"></block>`;
        console.log('DEBUG: Added arduino_pin_mode to Digital I/O');
      }
      if (blocks.includes('arduino_digital_write')) {
        toolboxXml += `
          <block type="arduino_digital_write"></block>`;
        console.log('DEBUG: Added arduino_digital_write to Digital I/O');
      }
      if (blocks.includes('arduino_digital_read')) {
        toolboxXml += `
          <block type="arduino_digital_read"></block>`;
        console.log('DEBUG: Added arduino_digital_read to Digital I/O');
      }
      
      // Always include built-in LED
      toolboxXml += `
          <block type="arduino_led_builtin"></block>`;
      console.log('DEBUG: Added arduino_led_builtin to Digital I/O');
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
    console.log('DEBUG: Added Values category');

    // Logic (always available)
    toolboxXml += `
      <category name="Logic" colour="#06b6d4">
        <block type="logic_compare"></block>
        <block type="logic_operation"></block>
        <block type="logic_negate"></block>
        <block type="logic_boolean"></block>
      </category>`;
    console.log('DEBUG: Added Logic category');

    // Control (always available) - removed categorystyle
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
    console.log('DEBUG: Added Control category');

    // Variables and Functions (always available)
    toolboxXml += `
      <category name="Variables" colour="#f97316" custom="VARIABLE"></category>
      <category name="Functions" colour="#ec4899" custom="PROCEDURE"></category>`;
    console.log('DEBUG: Added Variables and Functions categories');

    toolboxXml += '</xml>';
    
    console.log('DEBUG: Generated toolbox XML length:', toolboxXml.length);
    console.log('DEBUG: Final toolbox XML preview:', toolboxXml.substring(0, 300) + '...');
    return toolboxXml;

  } catch (error) {
    console.error('DEBUG: Error generating toolbox:', error);
    console.error('DEBUG: Toolbox generation error stack:', error.stack);
    
    // Return basic toolbox on error
    return `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox">
      <category name="Arduino Basics" colour="#3b82f6">
        <block type="arduino_setup"></block>
        <block type="arduino_loop"></block>
      </category>
    </xml>`;
  }
};

const getComponentColor = (type: string): string => {
  const colors = {
    'sensor': '#10b981',
    'actuator': '#f59e0b', 
    'input': '#3b82f6'
  };
  const color = colors[type as keyof typeof colors] || '#6b7280';
  console.log('DEBUG: Component color for type', type, ':', color);
  return color;
};
