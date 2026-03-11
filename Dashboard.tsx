import React, { useState, useEffect } from 'react';
import { Template, FilterState, TemplateCategory } from '../types';
import TemplateCard from '../components/TemplateCard';
import SkeletonCard from '../components/SkeletonCard';
import TemplateFilters from '../components/TemplateFilters';
import { Plus, SlidersHorizontal, Search, X } from 'lucide-react';
import { saveToStorage } from '../services/storage';

interface DashboardProps {
  templates: Template[];
  onNavigateToGenerator: () => void;
  onNavigateToDetails: (template: Template) => void;
  defaultSort?: 'popular' | 'recent' | 'downloads' | 'likes';
}

const Dashboard: React.FC<DashboardProps> = ({ templates, onNavigateToGenerator, onNavigateToDetails, defaultSort = 'popular' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    pricing: 'all',
    sortBy: defaultSort,
    tags: [],
    compatibility: [],
    search: ''
  });
  
  const [likedTemplates, setLikedTemplates] = useState<Set<string>>(new Set());

  // Update sort if defaultSort prop changes (e.g. after generating a new template)
  useEffect(() => {
    setFilters(prev => ({ ...prev, sortBy: defaultSort }));
  }, [defaultSort]);

  // Load likes from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dg_likes');
    if (saved) {
      setLikedTemplates(new Set(JSON.parse(saved)));
    }
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLike = (id: string) => {
    setLikedTemplates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      
      // Save to local storage using safe wrapper
      saveToStorage('dg_likes', Array.from(newSet));
      return newSet;
    });
  };
  
  const handleCategoryToggle = (category: TemplateCategory) => {
    const current = filters.categories;
    const next = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    setFilters({ ...filters, categories: next });
  };

  // Extract all unique tags safely (handling potential malformed data)
  const allTags = Array.from(new Set(templates.flatMap(t => Array.isArray(t.tags) ? t.tags : []))).sort();

  // Filter Logic
  const filteredTemplates = templates.filter(t => {
    // Safety check for critical properties
    if (!t) return false;

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      // Safe access to properties
      const title = t.title || '';
      const description = t.description || '';
      const tags = Array.isArray(t.tags) ? t.tags : [];
      
      const matches = title.toLowerCase().includes(q) || 
                      description.toLowerCase().includes(q) || 
                      tags.some(tag => tag && typeof tag === 'string' && tag.toLowerCase().includes(q));
      if (!matches) return false;
    }

    // Categories
    if (filters.categories.length > 0 && !filters.categories.includes(t.category)) {
      return false;
    }

    // Pricing
    if (filters.pricing !== 'all') {
      if (filters.pricing === 'free' && t.pricing !== 'free') return false;
      if (filters.pricing === 'premium' && t.pricing === 'free') return false; // Simple logic: premium/freemium are paid
    }

    // Tags
    if (filters.tags.length > 0) {
      const tags = Array.isArray(t.tags) ? t.tags : [];
      const hasTag = tags.some(tag => filters.tags.includes(tag));
      if (!hasTag) return false;
    }

    // Compatibility
    if (filters.compatibility.length > 0 && t.compatibility) {
      const hasCompat = filters.compatibility.some(key => t.compatibility[key]);
      if (!hasCompat) return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'popular') return (b.stats?.views || 0) - (a.stats?.views || 0);
    if (filters.sortBy === 'likes') return (b.stats?.likes || 0) - (a.stats?.likes || 0);
    if (filters.sortBy === 'downloads') return (b.stats?.downloads || 0) - (a.stats?.downloads || 0);
    if (filters.sortBy === 'recent') {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    }
    return 0;
  });

  const categoriesList: { id: TemplateCategory, label: string }[] = [
    { id: 'fintech', label: 'Fintech' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'social', label: 'Social' },
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'fitness', label: 'Fitness' },
    { id: 'travel', label: 'Travel' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'other', label: 'Resources' },
  ];

  const activeFiltersCount = (filters.pricing !== 'all' ? 1 : 0) + filters.compatibility.length + filters.tags.length;

  return (
    <div className="flex flex-col h-full min-h-screen">
      
      {/* Top Controls Area */}
      <div className="mb-8 space-y-4">
        
        {/* Row 1: Search, Advanced Toggle, Create */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search templates, tags, or features..." 
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-lg transition-all"
            />
            {filters.search && (
              <button 
                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
             <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-medium transition-all shadow-sm border ${
                showAdvancedFilters || activeFiltersCount > 0
                  ? 'bg-white border-indigo-200 text-indigo-700 ring-2 ring-indigo-500/10' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
             >
               <SlidersHorizontal className="w-5 h-5" />
               <span className="hidden sm:inline">Filters</span>
               {activeFiltersCount > 0 && (
                 <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                   {activeFiltersCount}
                 </span>
               )}
             </button>

             <button 
              onClick={onNavigateToGenerator}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/30 active:scale-95 whitespace-nowrap font-medium"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create AI Template</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>

        {/* Row 2: Category Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <button
             onClick={() => setFilters(prev => ({ ...prev, categories: [] }))}
             className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
               filters.categories.length === 0 
                 ? 'bg-slate-900 text-white shadow-md' 
                 : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200'
             }`}
          >
            All Categories
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1 shrink-0"></div>
          {categoriesList.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryToggle(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap border transition-all ${
                filters.categories.includes(cat.id)
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm'
                  : 'bg-white text-slate-600 border-transparent hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <TemplateFilters 
        filters={filters} 
        onFilterChange={setFilters} 
        resultCount={filteredTemplates.length} 
        availableTags={allTags}
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
      />

      {/* Results Header */}
      <div className="flex justify-between items-end mb-6">
         <div>
           <h2 className="text-xl font-bold text-slate-900">
             {filters.search ? `Results for "${filters.search}"` : 'All Templates'}
           </h2>
           <p className="text-slate-500 text-sm">{filteredTemplates.length} templates available</p>
         </div>
         <div className="relative z-10">
            <select 
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="appearance-none bg-transparent border-none py-2 pl-2 pr-8 text-sm font-medium text-slate-600 cursor-pointer hover:text-slate-900 focus:ring-0 text-right"
            >
              <option value="popular">Most Popular</option>
              <option value="recent">Newest First</option>
              <option value="likes">Most Liked</option>
              <option value="downloads">Most Downloaded</option>
            </select>
         </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-12">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          filteredTemplates.map(template => (
            <TemplateCard 
              key={template.id} 
              template={template} 
              isLiked={likedTemplates.has(template.id)}
              onLike={handleLike}
              onClick={onNavigateToDetails}
            />
          ))
        )}
        {!isLoading && filteredTemplates.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No templates found</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              We couldn't find any templates matching your filters. Try adjusting your search or clearing some filters.
            </p>
            <button 
              onClick={() => setFilters({ categories: [], pricing: 'all', sortBy: 'popular', tags: [], compatibility: [], search: '' })} 
              className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;