
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
    setSelectedComponents(prev => {
      if (prev.some(c => c.id === component.id)) {
        return prev; // Component already selected
      }
      return [...prev, component];
    });
  }, []);

  const removeComponent = useCallback((componentId: string) => {
    setSelectedComponents(prev => prev.filter(c => c.id !== componentId));
  }, []);

  const getAvailableBlocks = useCallback(() => {
    const blocks = new Set<string>();
    
    // Always include basic Arduino blocks
    blocks.add('arduino_setup');
    blocks.add('arduino_loop');
    blocks.add('arduino_delay');
    blocks.add('arduino_serial_begin');
    blocks.add('arduino_serial_print');
    
    // Add blocks for selected components
    selectedComponents.forEach(component => {
      component.blocks.forEach(block => blocks.add(block));
    });
    
    return Array.from(blocks);
  }, [selectedComponents]);

  const clearComponents = useCallback(() => {
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
