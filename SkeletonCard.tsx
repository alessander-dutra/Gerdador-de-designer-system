import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 h-full flex flex-col">
      {/* Image Placeholder */}
      <div className="aspect-video bg-slate-200 animate-pulse relative border-b border-slate-100">
        <div className="absolute top-3 left-3 w-20 h-6 bg-slate-300 rounded-md animate-pulse"></div>
      </div>
      
      {/* Content Placeholder */}
      <div className="p-5 flex-1 flex flex-col space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-slate-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3"></div>
        </div>
        
        <div className="pt-4 border-t border-slate-50 mt-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-200 animate-pulse"></div>
            <div className="h-3 w-16 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="w-5 h-5 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;