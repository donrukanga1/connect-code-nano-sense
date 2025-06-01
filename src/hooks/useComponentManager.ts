
import { useState, useCallback } from 'react';

interface Component {
  id: string;
  name: string;
  type: 'sensor' | 'actuator' | 'input';
  icon: React.ReactNode;
  description: string;
  blocks: string[];
}

export const useComponentManager = () => {
  const [selectedComponents, setSelectedComponents] = useState<Component[]>([]);

  const addComponent = useCallback((component: Component) => {
    console.log('DEBUG useComponentManager: addComponent called with:', {
      id: component.id,
      name: component.name,
      type: component.type,
      blocks: component.blocks,
      hasBlocks: !!component.blocks,
      blocksLength: component.blocks?.length || 0,
      fullComponent: component
    });

    if (!component.blocks) {
      console.error('❌ ERROR: Component being stored is missing blocks!', component);
    }

    setSelectedComponents(prev => {
      const alreadyExists = prev.some(c => c.id === component.id);
      if (alreadyExists) {
        console.log('DEBUG: Component already selected, not adding again');
        return prev; // Component already selected
      }
      
      const newComponents = [...prev, component];
      console.log('DEBUG useComponentManager: Updated selectedComponents:', newComponents);
      
      // Verify the stored component has blocks
      const storedComponent = newComponents.find(c => c.id === component.id);
      if (storedComponent && !storedComponent.blocks) {
        console.error('❌ ERROR: Stored component is missing blocks!', storedComponent);
      }
      
      return newComponents;
    });
  }, []);

  const removeComponent = useCallback((componentId: string) => {
    console.log('DEBUG useComponentManager: Removing component with id:', componentId);
    setSelectedComponents(prev => {
      const filtered = prev.filter(c => c.id !== componentId);
      console.log('DEBUG useComponentManager: Components after removal:', filtered);
      return filtered;
    });
  }, []);

  const getAvailableBlocks = useCallback(() => {
    console.log('DEBUG useComponentManager: getAvailableBlocks called');
    console.log('DEBUG: Current selectedComponents when getting blocks:', selectedComponents);
    
    const blocks = new Set<string>();
    
    // Always include basic Arduino blocks
    blocks.add('arduino_setup');
    blocks.add('arduino_loop');
    blocks.add('arduino_delay');
    blocks.add('arduino_serial_begin');
    blocks.add('arduino_serial_print');
    
    // Add blocks for selected components
    selectedComponents.forEach((component, index) => {
      console.log(`DEBUG: Processing component ${index} for blocks:`, {
        id: component.id,
        name: component.name,
        blocks: component.blocks,
        hasBlocks: !!component.blocks
      });
      
      if (!component.blocks) {
        console.error(`❌ ERROR: Component "${component.name}" has no blocks array!`);
      } else {
        component.blocks.forEach(block => {
          blocks.add(block);
          console.log(`DEBUG: Added block "${block}" from component "${component.name}"`);
        });
      }
    });
    
    const result = Array.from(blocks);
    console.log('DEBUG useComponentManager: Final available blocks:', result);
    return result;
  }, [selectedComponents]);

  const clearComponents = useCallback(() => {
    console.log('DEBUG useComponentManager: Clearing all components');
    setSelectedComponents([]);
  }, []);

  return {
    selectedComponents,
    addComponent,
    removeComponent,
    getAvailableBlocks,
    clearComponents
  };
};
