
import React from 'react';

interface FilterControlsProps {
  categories: string[];
  activeFilter: string;
  setActiveFilter: (category: string) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({ categories, activeFilter, setActiveFilter }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
      {categories.map(category => (
        <button
          key={category}
          onClick={() => setActiveFilter(category)}
          className={`px-4 py-2 text-sm sm:text-base font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-850 focus:ring-brand-primary ${
            activeFilter === category
              ? 'bg-brand-primary text-white shadow-lg'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
