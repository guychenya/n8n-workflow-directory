
import React from 'react';
import { N8nLogo } from './icons';
import { DarkModeToggle } from './DarkModeToggle';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 sm:mb-12 relative">
      <div className="absolute top-0 right-0">
        <DarkModeToggle />
      </div>
      <div className="flex justify-center items-center gap-4 mb-4">
        <N8nLogo className="h-12 w-12 text-primary" />
        <h1 className="text-4xl sm:text-5xl font-bold text-text-light dark:text-text-dark tracking-tight">
          n8n Workflow Directory
        </h1>
      </div>
      <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-slate-400">
        Browse, filter, and instantly download community-built n8n workflows.
      </p>
    </header>
  );
};
