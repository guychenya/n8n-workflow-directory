import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { FilterSidebar } from './components/FilterSidebar';
import { WorkflowGrid } from './components/WorkflowGrid';
import { GlobalSearch } from './components/GlobalSearch';
import { EnhancedWorkflowModal } from './components/EnhancedWorkflowModal';
import { workflows as allWorkflows } from './data/workflows';
import type { FilterState, ServiceCategory, Workflow } from './types';

function App() {
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    services: [],
    triggerType: '',
    operation: '',
    complexity: '',
    searchTerm: ''
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(24); // Initial load: 24 workflows
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [globalSearchMode, setGlobalSearchMode] = useState<'global' | 'category'>('global');
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [workflowModalOpen, setWorkflowModalOpen] = useState(false);

  // Debug: Log workflow count (only in development)
  if (import.meta.env && import.meta.env.DEV) {
    console.log('Total workflows loaded:', allWorkflows.length);
    if (allWorkflows.length > 0) {
      console.log('First workflow:', allWorkflows[0]);
    }
  }

  // Generate filter options from workflow data
  const filterOptions = useMemo(() => {
    const categories = new Map<string, number>();
    const services = new Set<string>();
    const triggerTypes = new Set<string>();
    const operations = new Set<string>();

    allWorkflows.forEach(workflow => {
      // Count categories
      categories.set(workflow.category, (categories.get(workflow.category) || 0) + 1);
      
      // Collect services
      workflow.services.forEach(service => services.add(service));
      
      // Collect trigger types and operations
      triggerTypes.add(workflow.triggerType);
      operations.add(workflow.operation);
    });

    const serviceCategories: ServiceCategory[] = [
      { name: 'All', services: [], count: allWorkflows.length },
      ...Array.from(categories.entries()).map(([name, count]) => ({
        name,
        services: [],
        count
      }))
    ];

    return {
      serviceCategories,
      allServices: Array.from(services).sort(),
      triggerTypes: Array.from(triggerTypes).sort(),
      operations: Array.from(operations).sort()
    };
  }, []);

  // Filter workflows based on current filters
  const allFilteredWorkflows = useMemo(() => {
    return allWorkflows.filter(workflow => {
      // Category filter
      if (filters.category !== 'All' && workflow.category !== filters.category) {
        return false;
      }

      // Services filter
      if (filters.services.length > 0) {
        const hasMatchingService = filters.services.some(service =>
          workflow.services.includes(service)
        );
        if (!hasMatchingService) return false;
      }

      // Trigger type filter
      if (filters.triggerType && workflow.triggerType !== filters.triggerType) {
        return false;
      }

      // Operation filter
      if (filters.operation && workflow.operation !== filters.operation) {
        return false;
      }

      // Complexity filter
      if (filters.complexity && workflow.complexity !== filters.complexity) {
        return false;
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesTitle = workflow.title.toLowerCase().includes(searchLower);
        const matchesDescription = workflow.description.toLowerCase().includes(searchLower);
        const matchesServices = workflow.services.some(service => 
          service.toLowerCase().includes(searchLower)
        );
        const matchesTags = workflow.tags.some(tag => 
          tag.toLowerCase().includes(searchLower)
        );
        
        if (!matchesTitle && !matchesDescription && !matchesServices && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  // Apply pagination to filtered workflows
  const displayedWorkflows = useMemo(() => {
    return allFilteredWorkflows.slice(0, displayedCount);
  }, [allFilteredWorkflows, displayedCount]);

  // Reset displayed count when filters change
  const resetDisplayedCount = () => {
    setDisplayedCount(24);
  };

  // Load more workflows
  const loadMoreWorkflows = () => {
    setDisplayedCount(prev => prev + 24);
  };

  // Check if there are more workflows to load
  const hasMoreWorkflows = displayedCount < allFilteredWorkflows.length;

  // Reset displayed count when filters change
  React.useEffect(() => {
    resetDisplayedCount();
  }, [filters]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarCollapsed = () => setSidebarCollapsed(!sidebarCollapsed);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux) for global search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchMode('global');
        setGlobalSearchOpen(true);
      }
      // "/" for category/workflow quick search
      else if (e.key === '/' && !globalSearchOpen) {
        // Only trigger if not focused on an input element
        const activeElement = document.activeElement;
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setGlobalSearchMode('category');
          setGlobalSearchOpen(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [globalSearchOpen]);

  const handleWorkflowSelect = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setWorkflowModalOpen(true);
  };

  const handleGlobalSearchClose = () => {
    setGlobalSearchOpen(false);
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    resetDisplayedCount();
  };

  // Clear individual filters
  const clearCategoryFilter = () => {
    setFilters(prev => ({ ...prev, category: 'All' }));
  };

  const clearServiceFilter = (service: string) => {
    setFilters(prev => ({ 
      ...prev, 
      services: prev.services.filter(s => s !== service) 
    }));
  };

  const clearTriggerTypeFilter = () => {
    setFilters(prev => ({ ...prev, triggerType: '' }));
  };

  const clearOperationFilter = () => {
    setFilters(prev => ({ ...prev, operation: '' }));
  };

  const clearComplexityFilter = () => {
    setFilters(prev => ({ ...prev, complexity: '' }));
  };

  const clearSearchFilter = () => {
    setFilters(prev => ({ ...prev, searchTerm: '' }));
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark font-sans">
      <div className="flex">
        {/* Sidebar */}
        <FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          serviceCategories={filterOptions.serviceCategories}
          allServices={filterOptions.allServices}
          triggerTypes={filterOptions.triggerTypes}
          operations={filterOptions.operations}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <Header />
            
            {/* Desktop filter toggle */}
            <div className="hidden lg:block mb-6">
              <button
                onClick={toggleSidebarCollapsed}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-slate-800 text-text-light dark:text-text-dark rounded-md border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm
                backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90
                shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:via-white/5 before:to-transparent before:pointer-events-none before:rounded-md before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
                relative"
                aria-label={sidebarCollapsed ? 'Expand filters' : 'Collapse filters'}
              >
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 ${sidebarCollapsed ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                {sidebarCollapsed ? 'Show Filters' : 'Hide Filters'}
                {(filters.category !== 'All' || 
                  filters.services.length > 0 || 
                  filters.triggerType || 
                  filters.operation || 
                  filters.complexity ||
                  filters.searchTerm) && (
                  <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                    {sidebarCollapsed ? '!' : 'Active'}
                  </span>
                )}
              </button>
            </div>
            
            {/* Mobile filter toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={toggleSidebar}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-sidebar-light dark:bg-sidebar-bg text-text-light dark:text-text-dark rounded-md border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-sm sm:text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
                Filters
                {(filters.category !== 'All' || 
                  filters.services.length > 0 || 
                  filters.triggerType || 
                  filters.operation || 
                  filters.complexity ||
                  filters.searchTerm) && (
                  <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            </div>

            <main>
              {/* Results summary */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="bg-white/5 dark:bg-slate-800/50 px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700">
                    <span className="text-xl font-bold text-primary">
                      {displayedWorkflows.length}
                    </span>
                    <span className="ml-2 text-text-light dark:text-text-dark font-medium">
                      {displayedWorkflows.length === 1 ? 'workflow' : 'workflows'}
                    </span>
                    {allFilteredWorkflows.length > displayedWorkflows.length && (
                      <span className="ml-2 text-secondary font-semibold">
                        of {allFilteredWorkflows.length} total
                      </span>
                    )}
                    {filters.category !== 'All' && (
                      <span className="ml-2 text-accent font-medium">
                        in {filters.category}
                      </span>
                    )}
                  </div>
                  
                  {/* Active filters summary for desktop */}
                  <div className="hidden lg:flex items-center gap-2">
                    {(filters.category !== 'All' || 
                      filters.services.length > 0 || 
                      filters.triggerType || 
                      filters.operation || 
                      filters.complexity) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                        <span>Filtered by:</span>
                        {filters.category !== 'All' && (
                          <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium flex items-center gap-1 group">
                            {filters.category}
                            <button
                              onClick={clearCategoryFilter}
                              className="ml-1 hover:bg-primary/30 rounded-full p-0.5 opacity-60 hover:opacity-100 transition-opacity"
                              aria-label={`Clear ${filters.category} filter`}
                            >
                              ×
                            </button>
                          </span>
                        )}
                        {filters.services.slice(0, 2).map(service => (
                          <span key={service} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs flex items-center gap-1 group">
                            {service}
                            <button
                              onClick={() => clearServiceFilter(service)}
                              className="ml-1 hover:bg-blue-500/30 rounded-full p-0.5 opacity-60 hover:opacity-100 transition-opacity"
                              aria-label={`Clear ${service} filter`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        {filters.services.length > 2 && (
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                            +{filters.services.length - 2} more
                          </span>
                        )}
                        {filters.triggerType && (
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs flex items-center gap-1 group">
                            {filters.triggerType}
                            <button
                              onClick={clearTriggerTypeFilter}
                              className="ml-1 hover:bg-green-500/30 rounded-full p-0.5 opacity-60 hover:opacity-100 transition-opacity"
                              aria-label={`Clear ${filters.triggerType} filter`}
                            >
                              ×
                            </button>
                          </span>
                        )}
                        {filters.operation && (
                          <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs flex items-center gap-1 group">
                            {filters.operation}
                            <button
                              onClick={clearOperationFilter}
                              className="ml-1 hover:bg-purple-500/30 rounded-full p-0.5 opacity-60 hover:opacity-100 transition-opacity"
                              aria-label={`Clear ${filters.operation} filter`}
                            >
                              ×
                            </button>
                          </span>
                        )}
                        {filters.complexity && (
                          <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs flex items-center gap-1 group">
                            {filters.complexity}
                            <button
                              onClick={clearComplexityFilter}
                              className="ml-1 hover:bg-orange-500/30 rounded-full p-0.5 opacity-60 hover:opacity-100 transition-opacity"
                              aria-label={`Clear ${filters.complexity} filter`}
                            >
                              ×
                            </button>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* No results message */}
                {allWorkflows.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-slate-400 text-lg mb-2">Loading workflows...</div>
                    <div className="text-slate-500 text-sm">
                      If this persists, there may be an issue loading the workflow data.
                    </div>
                  </div>
                )}
                
                {allWorkflows.length > 0 && allFilteredWorkflows.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-slate-400 text-lg mb-2">No workflows found</div>
                    <div className="text-slate-500 text-sm">
                      Try adjusting your filters or search terms
                    </div>
                    <button
                      onClick={() => setFilters({
                        category: 'All',
                        services: [],
                        triggerType: '',
                        operation: '',
                        complexity: '',
                        searchTerm: ''
                      })}
                      className="mt-4 px-3 sm:px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm sm:text-base"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>

              <WorkflowGrid workflows={displayedWorkflows} />
              
              {/* Load More Button */}
              {hasMoreWorkflows && (
                <div className="text-center mt-8 mb-8">
                  <button
                    onClick={loadMoreWorkflows}
                    className="px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:from-primary/90 hover:to-accent/90 transition-all duration-200 font-semibold text-sm sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Load More Workflows
                    <span className="ml-2 sm:ml-3 text-xs sm:text-base bg-white/20 px-2 sm:px-3 py-1 rounded-full">
                      {allFilteredWorkflows.length - displayedWorkflows.length} remaining
                    </span>
                  </button>
                </div>
              )}
            </main>
            
            <footer className="text-center mt-12 text-slate-500 text-sm space-y-4 relative overflow-hidden">
              {/* Bottom water drops decoration */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-4 left-1/4 w-2.5 h-2.5 bg-primary/25 rounded-full blur-sm animate-pulse"></div>
                <div className="absolute bottom-8 right-1/3 w-3 h-3 bg-secondary/30 rounded-full blur-sm animate-pulse delay-1000"></div>
                <div className="absolute bottom-2 left-1/2 w-2 h-2 bg-accent/35 rounded-full blur-sm animate-pulse delay-500"></div>
                <div className="absolute bottom-12 right-1/4 w-1.5 h-1.5 bg-primary/40 rounded-full blur-sm animate-pulse delay-1500"></div>
                
                {/* Floating bottom drops */}
                <div className="absolute bottom-6 left-1/3 w-1 h-1 bg-blue-400/40 rounded-full blur-sm animate-bounce delay-300"></div>
                <div className="absolute bottom-10 right-1/2 w-2 h-2 bg-cyan-400/30 rounded-full blur-sm animate-bounce delay-700"></div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
                <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
                <a href="https://github.com/guychenya/n8n-workflow-directory" className="hover:text-primary transition-colors">GitHub</a>
              </div>
              <div className="space-y-2">
                <p>Built for the n8n community. Not affiliated with n8n GmbH.</p>
                <p className="text-xs text-slate-600">
                  All workflows are sourced from public repositories under MIT license. 
                  <br className="sm:hidden" /> 
                  Workflows are provided "as is" without warranty.
                </p>
                <p className="text-primary font-medium">
                  Made with ❤️ by <a href="https://www.guyc.dev" className="hover:text-accent transition-colors underline">Guy Chenya</a>
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch
        workflows={allWorkflows}
        isOpen={globalSearchOpen}
        onClose={handleGlobalSearchClose}
        onWorkflowSelect={handleWorkflowSelect}
        onApplyFilters={handleApplyFilters}
        searchMode={globalSearchMode}
      />

      {/* Enhanced Workflow Modal */}
      <EnhancedWorkflowModal 
        workflow={selectedWorkflow}
        isOpen={workflowModalOpen}
        onClose={() => {
          setWorkflowModalOpen(false);
          setSelectedWorkflow(null);
        }}
      />
    </div>
  );
}

export default App;