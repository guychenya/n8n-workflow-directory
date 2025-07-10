import React, { useState, useEffect, useRef } from 'react';
import type { FilterState, ServiceCategory } from '../types';

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  serviceCategories: ServiceCategory[];
  allServices: string[];
  triggerTypes: string[];
  operations: string[];
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  serviceCategories,
  allServices,
  triggerTypes,
  operations,
  isOpen,
  onClose,
  isCollapsed = false
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['categories', 'services', 'triggers', 'operations', 'complexity'])
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts for sidebar search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only work when sidebar is open/visible and not already focused on input
      if (!isOpen && isCollapsed) return;
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      
      // 's' key to focus search (common in many apps like GitHub, Slack)
      if (e.key === 's' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        console.log('S key pressed, focusing search input'); // Debug log
        searchInputRef.current?.focus();
      }
    };

    // Add listener when sidebar is visible (open on mobile OR not collapsed on desktop)
    if (isOpen || !isCollapsed) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, isCollapsed]);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? 'All' : category
    });
  };

  const handleServiceChange = (service: string) => {
    const currentServices = filters.services || [];
    const newServices = currentServices.includes(service)
      ? currentServices.filter(s => s !== service)
      : [...currentServices, service];
    
    onFiltersChange({
      ...filters,
      services: newServices
    });
  };

  const handleTriggerChange = (trigger: string) => {
    onFiltersChange({
      ...filters,
      triggerType: filters.triggerType === trigger ? '' : trigger
    });
  };

  const handleOperationChange = (operation: string) => {
    onFiltersChange({
      ...filters,
      operation: filters.operation === operation ? '' : operation
    });
  };

  const handleComplexityChange = (complexity: string) => {
    onFiltersChange({
      ...filters,
      complexity: filters.complexity === complexity ? '' : complexity
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: 'All',
      services: [],
      triggerType: '',
      operation: '',
      complexity: '',
      searchTerm: ''
    });
  };

  const FilterSection = ({ title, isExpanded, onToggle, children }: {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 dark:border-slate-700 pb-4 mb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left text-text-light dark:text-slate-200 hover:text-primary transition-colors"
      >
        <span className="font-semibold">{title}</span>
        <span className="text-sm">
          {isExpanded ? '−' : '+'}
        </span>
      </button>
      {isExpanded && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative lg:translate-x-0 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'lg:w-0 lg:overflow-hidden lg:p-0' : 'lg:w-80 lg:p-6'}
        top-0 left-0 h-full lg:h-auto bg-sidebar-light dark:bg-sidebar-bg border-r border-gray-200 dark:border-slate-700 
        w-80 max-w-[85vw] p-4 sm:p-6 overflow-y-auto z-50
        backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95
        shadow-2xl shadow-black/20
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:via-white/5 before:to-transparent before:pointer-events-none
      `}>
        <div className={`${isCollapsed ? 'lg:hidden' : ''}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-text-light dark:text-text-dark">Filters</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-500 dark:text-slate-400 hover:text-text-light dark:hover:text-slate-200 transition-colors"
            >
              Clear all
            </button>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 dark:text-slate-400 hover:text-text-light dark:hover:text-slate-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Search workflows
          </label>
          <input
            ref={searchInputRef}
            type="text"
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md text-text-light dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Search by title, service, or description... (Press 'S')"
          />
        </div>

        {/* Categories */}
        <FilterSection
          title="Categories"
          isExpanded={expandedSections.has('categories')}
          onToggle={() => toggleSection('categories')}
        >
          {serviceCategories.map(({ name, count }) => (
            <label key={name} className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 p-2 rounded">
              <input
                type="radio"
                name="category"
                checked={filters.category === name}
                onChange={() => handleCategoryChange(name)}
                className="mr-3 text-primary focus:ring-primary"
              />
              <span className="text-sm text-text-light dark:text-slate-300 flex-1">{name}</span>
              <span className="text-xs text-gray-500 dark:text-slate-500">({count})</span>
            </label>
          ))}
        </FilterSection>

        {/* Services */}
        <FilterSection
          title="Services"
          isExpanded={expandedSections.has('services')}
          onToggle={() => toggleSection('services')}
        >
          <div className="max-h-48 sm:max-h-64 overflow-y-auto">
            {allServices.slice(0, 20).map(service => (
              <label key={service} className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 p-2 rounded">
                <input
                  type="checkbox"
                  checked={filters.services?.includes(service) || false}
                  onChange={() => handleServiceChange(service)}
                  className="mr-3 text-primary focus:ring-primary flex-shrink-0"
                />
                <span className="text-sm text-text-light dark:text-slate-300 break-words">{service}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Trigger Types */}
        <FilterSection
          title="Trigger Types"
          isExpanded={expandedSections.has('triggers')}
          onToggle={() => toggleSection('triggers')}
        >
          {triggerTypes.map(trigger => (
            <label key={trigger} className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 p-2 rounded">
              <input
                type="radio"
                name="triggerType"
                checked={filters.triggerType === trigger}
                onChange={() => handleTriggerChange(trigger)}
                className="mr-3 text-primary focus:ring-primary"
              />
              <span className="text-sm text-text-light dark:text-slate-300">{trigger}</span>
            </label>
          ))}
        </FilterSection>

        {/* Operations */}
        <FilterSection
          title="Operations"
          isExpanded={expandedSections.has('operations')}
          onToggle={() => toggleSection('operations')}
        >
          {operations.map(operation => (
            <label key={operation} className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 p-2 rounded">
              <input
                type="radio"
                name="operation"
                checked={filters.operation === operation}
                onChange={() => handleOperationChange(operation)}
                className="mr-3 text-primary focus:ring-primary"
              />
              <span className="text-sm text-text-light dark:text-slate-300">{operation}</span>
            </label>
          ))}
        </FilterSection>

        {/* Complexity */}
        <FilterSection
          title="Complexity"
          isExpanded={expandedSections.has('complexity')}
          onToggle={() => toggleSection('complexity')}
        >
          {['Simple', 'Advanced', 'Multi-step'].map(complexity => (
            <label key={complexity} className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 p-2 rounded">
              <input
                type="radio"
                name="complexity"
                checked={filters.complexity === complexity}
                onChange={() => handleComplexityChange(complexity)}
                className="mr-3 text-primary focus:ring-primary"
              />
              <span className="text-sm text-text-light dark:text-slate-300">{complexity}</span>
            </label>
          ))}
        </FilterSection>

        {/* Active Filters Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
          <h3 className="text-sm font-medium text-text-light dark:text-slate-300 mb-3">Active Filters</h3>
          <div className="flex flex-wrap gap-2">
            {filters.category !== 'All' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/20 text-primary">
                {filters.category}
                <button
                  onClick={() => handleCategoryChange('All')}
                  className="ml-1 hover:text-primary/70"
                >
                  ✕
                </button>
              </span>
            )}
            {filters.services?.map(service => (
              <span key={service} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                {service}
                <button
                  onClick={() => handleServiceChange(service)}
                  className="ml-1 hover:text-blue-400/70"
                >
                  ✕
                </button>
              </span>
            ))}
            {filters.triggerType && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                {filters.triggerType}
                <button
                  onClick={() => handleTriggerChange('')}
                  className="ml-1 hover:text-green-400/70"
                >
                  ✕
                </button>
              </span>
            )}
            {filters.operation && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400">
                {filters.operation}
                <button
                  onClick={() => handleOperationChange('')}
                  className="ml-1 hover:text-purple-400/70"
                >
                  ✕
                </button>
              </span>
            )}
            {filters.complexity && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-500/20 text-orange-400">
                {filters.complexity}
                <button
                  onClick={() => handleComplexityChange('')}
                  className="ml-1 hover:text-orange-400/70"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        </div>
        </div>
      </div>
    </>
  );
};