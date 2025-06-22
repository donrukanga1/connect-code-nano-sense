
export interface Component {
  id: string;
  name: string;
  type: 'sensor' | 'actuator' | 'input';
  icon?: React.ReactNode;
  description: string;
  blocks: string[];
}
