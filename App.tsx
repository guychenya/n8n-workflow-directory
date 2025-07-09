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
  const filteredWorkflows = useMemo(() => {
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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-slate-850 font-sans">
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
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-md border border-slate-700 hover:bg-slate-700 transition-colors"
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
                      {filteredWorkflows.length}
                    </span>
                    <span className="ml-2">
                      {filteredWorkflows.length === 1 ? 'workflow' : 'workflows'}
                    </span>
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
                {filteredWorkflows.length === 0 && (
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

              <WorkflowGrid workflows={filteredWorkflows} />
            </main>
            
            <footer className="text-center mt-12 text-slate-500 text-sm">
              <p>Built for the n8n community. Not affiliated with n8n GmbH.</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;