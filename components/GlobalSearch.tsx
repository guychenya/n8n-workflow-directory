import React, { useState, useEffect, useRef } from 'react';
import type { Workflow, FilterState } from '../types';

interface GlobalSearchProps {
  workflows: Workflow[];
  isOpen: boolean;
  onClose: () => void;
  onWorkflowSelect: (workflow: Workflow) => void;
  onApplyFilters: (filters: FilterState) => void;
  searchMode: 'global' | 'category'; // 'global' for Cmd+K, 'category' for /
  currentFilters: FilterState;
}

interface SearchResult {
  type: 'category' | 'workflow';
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  workflow?: Workflow;
  count?: number;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  workflows,
  isOpen,
  onClose,
  onWorkflowSelect,
  onApplyFilters,
  searchMode,
  currentFilters
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterState>(currentFilters);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Get unique categories with counts
  const categories = React.useMemo(() => {
    const categoryMap = new Map<string, number>();
    workflows.forEach(workflow => {
      categoryMap.set(workflow.category, (categoryMap.get(workflow.category) || 0) + 1);
    });
    return Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }));
  }, [workflows]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedIndex(0);
      setMultiSelectMode(false);
      setTempFilters(currentFilters);
    } else {
      setResults([]);
      setSearchTerm('');
      setSelectedIndex(0);
      setMultiSelectMode(false);
    }
  }, [isOpen, currentFilters]);

  // Generate search results
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const searchResults: SearchResult[] = [];

    if (searchMode === 'category' && searchTerm === '') {
      // Show all categories when / is pressed with no search term
      categories.forEach(({ name, count }) => {
        searchResults.push({
          type: 'category',
          id: `category-${name}`,
          title: name,
          subtitle: `${count} workflows`,
          category: name,
          count
        });
      });
    } else if (searchTerm.length > 0) {
      const searchLower = searchTerm.toLowerCase();
      
      // Add matching categories
      categories.forEach(({ name, count }) => {
        if (name.toLowerCase().includes(searchLower)) {
          searchResults.push({
            type: 'category',
            id: `category-${name}`,
            title: name,
            subtitle: `${count} workflows`,
            category: name,
            count
          });
        }
      });

      // Add matching workflows
      workflows.forEach(workflow => {
        const matchesTitle = workflow.title.toLowerCase().includes(searchLower);
        const matchesDescription = workflow.description.toLowerCase().includes(searchLower);
        const matchesServices = workflow.services.some(service => 
          service.toLowerCase().includes(searchLower)
        );
        const matchesTags = workflow.tags.some(tag => 
          tag.toLowerCase().includes(searchLower)
        );
        const matchesCategory = workflow.category.toLowerCase().includes(searchLower);

        if (matchesTitle || matchesDescription || matchesServices || matchesTags || matchesCategory) {
          searchResults.push({
            type: 'workflow',
            id: `workflow-${workflow.id}`,
            title: workflow.title,
            subtitle: `${workflow.category} • ${workflow.triggerType} • ${workflow.complexity}`,
            category: workflow.category,
            workflow
          });
        }
      });
    } else if (searchMode === 'global') {
      // Show recent/popular workflows or categories for global search
      categories.slice(0, 8).forEach(({ name, count }) => {
        searchResults.push({
          type: 'category',
          id: `category-${name}`,
          title: name,
          subtitle: `${count} workflows`,
          category: name,
          count
        });
      });
    }

    setResults(searchResults.slice(0, 10)); // Limit to 10 results
    setSelectedIndex(0);
  }, [searchTerm, searchMode, isOpen, categories, workflows]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (results.length > 0) {
            setSelectedIndex(prev => (prev + 1) % results.length);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (results.length > 0) {
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (results.length > 0 && results[selectedIndex]) {
            console.log('Enter pressed:', { shiftKey: e.shiftKey, multiSelectMode, selectedIndex, result: results[selectedIndex] });
            if (e.shiftKey || multiSelectMode) {
              handleMultiSelect(results[selectedIndex]);
            } else {
              handleResultSelect(results[selectedIndex]);
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, results, selectedIndex, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleResultSelect = (result: SearchResult) => {
    if (result.type === 'category') {
      // Apply category filter
      onApplyFilters({
        category: result.category!,
        services: [],
        triggerType: '',
        operation: '',
        complexity: '',
        searchTerm: ''
      });
    } else if (result.type === 'workflow' && result.workflow) {
      // Select workflow
      onWorkflowSelect(result.workflow);
    }
    onClose();
  };

  const handleMultiSelect = (result: SearchResult) => {
    if (result.type === 'category') {
      // Toggle category filter
      setTempFilters(prev => ({
        ...prev,
        category: prev.category === result.category ? 'All' : result.category!
      }));
    } else if (result.type === 'workflow' && result.workflow) {
      // Toggle service filters based on workflow services
      const workflow = result.workflow;
      setTempFilters(prev => {
        const newServices = [...prev.services];
        
        // Add services from this workflow that aren't already selected
        workflow.services.forEach(service => {
          if (!newServices.includes(service)) {
            newServices.push(service);
          }
        });
        
        return {
          ...prev,
          services: newServices,
          // Also set category if not already set
          category: prev.category === 'All' ? workflow.category : prev.category
        };
      });
    }
    setMultiSelectMode(true);
  };

  const applyTempFilters = () => {
    onApplyFilters(tempFilters);
    onClose();
  };

  const toggleMultiSelectMode = () => {
    setMultiSelectMode(!multiSelectMode);
  };

  const getResultIcon = (result: SearchResult) => {
    if (result.type === 'category') {
      return '🏷️';
    } else {
      return '⚡';
    }
  };

  const getSearchPlaceholder = () => {
    if (searchMode === 'category') {
      return 'Search categories and workflows...';
    } else {
      return 'Search workflows, categories, services...';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Search Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden
      backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95
      shadow-2xl shadow-black/30
      before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-transparent before:pointer-events-none before:rounded-xl
      border border-white/20 dark:border-slate-600/30">
        
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-slate-700">
          <div className="text-gray-400 dark:text-slate-500">
            {searchMode === 'category' ? '/' : '🔍'}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={multiSelectMode ? "Click items to select multiple filters..." : getSearchPlaceholder()}
            className="flex-1 bg-transparent text-text-light dark:text-text-dark placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none text-lg"
          />
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-500">
            {multiSelectMode && (
              <button
                onClick={applyTempFilters}
                className="px-2 py-1 bg-primary text-white rounded text-xs hover:bg-primary/90"
              >
                Apply ({Object.values(tempFilters).filter(v => v && v !== 'All' && (Array.isArray(v) ? v.length > 0 : true)).length})
              </button>
            )}
            <button
              onClick={toggleMultiSelectMode}
              className={`px-2 py-1 rounded text-xs ${multiSelectMode ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-700'}`}
            >
              Multi
            </button>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded border">↑↓</kbd>
            <span>navigate</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded border">{multiSelectMode ? 'Shift+' : ''}Enter</kbd>
            <span>select</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded border">Esc</kbd>
            <span>close</span>
          </div>
        </div>

        {/* Multi-select banner */}
        {multiSelectMode && (
          <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 border-b border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <span>🎯</span>
              <span>Multi-select mode: Click items to add filters. Green items are selected.</span>
            </div>
          </div>
        )}

        {/* Search Results */}
        <div 
          ref={resultsRef}
          className="max-h-96 overflow-y-auto"
        >
          {results.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-slate-400">
              {searchTerm ? 'No results found' : (searchMode === 'category' ? 'Browse categories' : 'Start typing to search')}
            </div>
          ) : (
            results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => multiSelectMode ? handleMultiSelect(result) : handleResultSelect(result)}
                className={`w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-slate-700 ${
                  index === selectedIndex 
                    ? 'bg-primary/10 dark:bg-primary/20 border-r-2 border-primary' 
                    : ''
                } ${
                  multiSelectMode && (
                    (result.type === 'category' && tempFilters.category === result.category) ||
                    (result.type === 'workflow' && result.workflow && 
                     result.workflow.services.some(service => tempFilters.services.includes(service)))
                  ) ? 'bg-green-100 dark:bg-green-900/30 border-l-2 border-green-500' : ''
                }`}
              >
                <div className="text-xl flex-shrink-0">
                  {getResultIcon(result)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-text-light dark:text-text-dark truncate">
                    {result.title}
                  </div>
                  {result.subtitle && (
                    <div className="text-sm text-gray-500 dark:text-slate-400 truncate">
                      {result.subtitle}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-400 dark:text-slate-500 flex-shrink-0">
                  {result.type === 'category' ? 'Category' : 'Workflow'}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};