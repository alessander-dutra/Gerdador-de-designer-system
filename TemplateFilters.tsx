import React from 'react';
import { FilterState, Compatibility } from '../types';
import { Check, X, Tag, DollarSign, Laptop, RotateCcw } from 'lucide-react';

interface TemplateFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  resultCount: number;
  availableTags?: string[];
  isOpen: boolean;
  onClose: () => void;
}

const TemplateFilters: React.FC<TemplateFiltersProps> = ({ 
  filters, 
  onFilterChange, 
  resultCount, 
  availableTags = [],
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const handleCompatibilityToggle = (key: keyof Compatibility) => {
    const current = filters.compatibility;
    const next = current.includes(key)
      ? current.filter(c => c !== key)
      : [...current, key];
    onFilterChange({ ...filters, compatibility: next });
  };

  const handleTagToggle = (tag: string) => {
    const current = filters.tags;
    const next = current.includes(tag) 
      ? current.filter(t => t !== tag)
      : [...current, tag];
    onFilterChange({ ...filters, tags: next });
  };

  const clearAll = () => {
    onFilterChange({
      categories: filters.categories, // Keep categories as they are handled outside
      pricing: 'all',
      sortBy: filters.sortBy,
      tags: [],
      compatibility: [],
      search: filters.search
    });
  };

  const hasActiveFilters = filters.pricing !== 'all' || filters.compatibility.length > 0 || filters.tags.length > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm animate-fade-in-up">
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
           <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg"><RotateCcw className="w-4 h-4" /></span>
           Advanced Filters
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">{resultCount} results found</span>
          {hasActiveFilters && (
            <button onClick={clearAll} className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
              <X className="w-4 h-4" /> Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Pricing */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-slate-400" /> Pricing
          </h4>
          <div className="flex flex-wrap gap-2">
            {(['all', 'free', 'premium'] as const).map((price) => (
              <button
                key={price}
                onClick={() => onFilterChange({ ...filters, pricing: price })}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize border transition-all ${
                  filters.pricing === price
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                {price}
              </button>
            ))}
          </div>
        </div>

        {/* Compatibility */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Laptop className="w-4 h-4 text-slate-400" /> Compatible with
          </h4>
          <div className="space-y-2">
            {(['figma', 'sketch', 'adobeXd', 'framer'] as const).map((tool) => (
              <label key={tool} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-slate-50 rounded-lg transition-colors -ml-2">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  filters.compatibility.includes(tool) 
                    ? 'bg-indigo-600 border-indigo-600' 
                    : 'border-slate-300 group-hover:border-indigo-400 bg-white'
                }`}>
                   {filters.compatibility.includes(tool) && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={filters.compatibility.includes(tool)}
                  onChange={() => handleCompatibilityToggle(tool)}
                />
                <span className="text-sm text-slate-700 font-medium capitalize group-hover:text-indigo-600 transition-colors">
                  {tool === 'adobeXd' ? 'Adobe XD' : tool}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
             <Tag className="w-4 h-4 text-slate-400" /> Popular Tags
          </h4>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {availableTags.slice(0, 20).map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                  filters.tags.includes(tag) 
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end pt-4 border-t border-slate-100">
         <button 
           onClick={onClose}
           className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg"
         >
           View Results
         </button>
      </div>
    </div>
  );
};

export default TemplateFilters;