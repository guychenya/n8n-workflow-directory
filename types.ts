
export interface Workflow {
  id: number;
  title: string;
  description: string;
  category: string;
  fileName: string;
  services: string[];
  triggerType: string;
  operation: string;
  complexity: 'Simple' | 'Advanced' | 'Multi-step';
  tags: string[];
}

export interface FilterState {
  category: string;
  services: string[];
  triggerType: string;
  operation: string;
  complexity: string;
  searchTerm: string;
}

export interface ServiceCategory {
  name: string;
  services: string[];
  count: number;
}
