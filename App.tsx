import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterSidebar } from './components/FilterSidebar';
import { WorkflowGrid } from './components/WorkflowGrid';
import { workflows as allWorkflows } from './data/workflows';
import type { FilterState, ServiceCategory } from './types';

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
  const [displayedCount, setDisplayedCount] = useState(24); // Initial load: 24 workflows

  // Debug: Log workflow count (only in development)
  if (import.meta.env.DEV) {
    console.log('Total workflows loaded:', allWorkflows.length);
    if (allWorkflows.length > 0) {
      console.log('First workflow:', allWorkflows[0]);
      console.log('Displayed workflows:', displayedWorkflows.length);
      console.log('Has more workflows:', hasMoreWorkflows);
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
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <Header />
            
            {/* Mobile filter toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={toggleSidebar}
                className="flex items-center gap-2 px-4 py-2 bg-sidebar-light dark:bg-sidebar-bg text-text-light dark:text-text-dark rounded-md border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
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
                  <span className="bg-brand-primary text-white text-xs px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            </div>

            <main>
              {/* Results summary */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-slate-300">
                    <span className="text-lg font-semibold text-slate-100">
                      {displayedWorkflows.length}
                    </span>
                    <span className="ml-2">
                      {displayedWorkflows.length === 1 ? 'workflow' : 'workflows'}
                    </span>
                    {allFilteredWorkflows.length > displayedWorkflows.length && (
                      <span className="ml-2 text-slate-400">
                        of {allFilteredWorkflows.length} total
                      </span>
                    )}
                    {filters.category !== 'All' && (
                      <span className="ml-2 text-slate-400">
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
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>Filtered by:</span>
                        {filters.category !== 'All' && (
                          <span className="bg-brand-primary/20 text-brand-primary px-2 py-1 rounded text-xs">
                            {filters.category}
                          </span>
                        )}
                        {filters.services.slice(0, 2).map(service => (
                          <span key={service} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                            {service}
                          </span>
                        ))}
                        {filters.services.length > 2 && (
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                            +{filters.services.length - 2} more
                          </span>
                        )}
                        {filters.triggerType && (
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                            {filters.triggerType}
                          </span>
                        )}
                        {filters.operation && (
                          <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                            {filters.operation}
                          </span>
                        )}
                        {filters.complexity && (
                          <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs">
                            {filters.complexity}
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
                      className="mt-4 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors"
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
                    className="px-6 py-3 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors font-medium"
                  >
                    Load More Workflows
                    <span className="ml-2 text-sm opacity-75">
                      ({allFilteredWorkflows.length - displayedWorkflows.length} remaining)
                    </span>
                  </button>
                </div>
              )}
            </main>
            
            <footer className="text-center mt-12 text-slate-500 text-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <a href="/privacy" className="hover:text-brand-primary transition-colors">Privacy Policy</a>
                <a href="/terms" className="hover:text-brand-primary transition-colors">Terms of Service</a>
                <a href="https://github.com/guychenya/n8n-workflow-directory" className="hover:text-brand-primary transition-colors">GitHub</a>
                <a href="https://www.guyc.dev" className="hover:text-brand-primary transition-colors">Contact</a>
              </div>
              <div className="space-y-2">
                <p>Built for the n8n community. Not affiliated with n8n GmbH.</p>
                <p className="text-xs text-slate-600">
                  All workflows are sourced from public repositories under MIT license. 
                  <br className="sm:hidden" /> 
                  Workflows are provided "as is" without warranty.
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;