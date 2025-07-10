
import React from 'react';
import { N8nLogo } from './icons';
import { DarkModeToggle } from './DarkModeToggle';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 sm:mb-12 relative overflow-hidden">
      {/* Water drops decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top water drops */}
        <div className="absolute top-4 left-1/4 w-3 h-3 bg-primary/30 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute top-8 right-1/3 w-2 h-2 bg-secondary/40 rounded-full blur-sm animate-pulse delay-1000"></div>
        <div className="absolute top-2 left-1/2 w-4 h-4 bg-accent/20 rounded-full blur-sm animate-pulse delay-500"></div>
        <div className="absolute top-12 right-1/4 w-2.5 h-2.5 bg-primary/25 rounded-full blur-sm animate-pulse delay-1500"></div>
        
        {/* Floating water drops with subtle animation */}
        <div className="absolute top-6 left-1/3 w-1.5 h-1.5 bg-blue-400/30 rounded-full blur-sm animate-bounce delay-300"></div>
        <div className="absolute top-10 right-1/2 w-1 h-1 bg-cyan-400/40 rounded-full blur-sm animate-bounce delay-700"></div>
      </div>
      
      <div className="absolute top-0 right-0">
        <DarkModeToggle />
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-4">
        <N8nLogo className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-text-light dark:text-text-dark tracking-tight text-center sm:text-left">
          n8n Workflow Directory
        </h1>
      </div>
      <p className="max-w-2xl mx-auto text-sm sm:text-lg text-gray-500 dark:text-slate-400 text-center px-4">
        Browse, filter, and instantly download community-built n8n workflows.
      </p>
      
      {/* Keyboard shortcuts hint */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 dark:text-slate-500">
        <div className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded border text-xs">
            {typeof navigator !== 'undefined' && navigator.platform.indexOf('Mac') > -1 ? '⌘K' : 'Ctrl+K'}
          </kbd>
          <span>Search</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded border text-xs">/</kbd>
          <span>Quick filter</span>
        </div>
      </div>
    </header>
  );
};
