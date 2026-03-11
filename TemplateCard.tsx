import React, { useState } from 'react';
import { Template } from '../types';
import { Heart, Maximize2, Download, Eye, ArrowUpRight, X, Flame, Sparkles, Check } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
  isLiked?: boolean;
  onLike: (id: string) => void;
  onClick: (template: Template) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, isLiked = false, onLike, onClick }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(template.id);
    
    const message = !isLiked ? 'Saved to Favorites' : 'Removed from Favorites';
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewImageIndex(0);
    setShowPreview(true);
  };

  const handleCardClick = () => {
    onClick(template);
  };

  const formatNumber = (count: number) => {
    return count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count;
  };

  // Determine which image to show (hover effect)
  const hasImages = Array.isArray(template.images) && template.images.length > 0;
  const fallbackImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(template.title + ' mobile app ui design')}?width=800&height=600&nologo=true`;
  const displayImage = hasImages 
    ? (isHovered && template.images.length > 1 ? template.images[1].url : template.images[0].url)
    : fallbackImage;
    
  const previewImages = hasImages ? template.images.map(img => img.url) : [fallbackImage];

  const isNew = (new Date().getTime() - new Date(template.createdAt).getTime()) < (30 * 24 * 60 * 60 * 1000); // 30 days
  const isTrending = template.stats.views > 100000;

  return (
    <>
      <div 
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full cursor-pointer relative"
      >
        <div className="relative aspect-video overflow-hidden bg-slate-100 border-b border-slate-100">
          <img 
            src={displayImage} 
            alt={template.title} 
            className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 z-10">
            <button 
              onClick={handleImageClick}
              className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-indigo-600 transition-colors"
              title="Quick Preview"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
              Details <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Top Badges */}
          <div className="absolute top-3 right-3 z-20 flex gap-2">
             <button 
                onClick={handleLikeClick}
                className={`p-2 bg-white rounded-full shadow-md transition-colors duration-200 ${isLiked ? 'text-pink-500' : 'text-slate-400 hover:text-pink-500'}`}
             >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
             </button>
          </div>
          
          <div className="absolute top-3 left-3 z-20 flex gap-2 flex-wrap max-w-[80%]">
             <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 shadow-sm uppercase tracking-wide">
                {template.category}
             </div>
             {isNew && (
               <div className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
                 <Sparkles className="w-3 h-3" /> NEW
               </div>
             )}
             {isTrending && !isNew && (
               <div className="bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
                 <Flame className="w-3 h-3" /> HOT
               </div>
             )}
          </div>
        </div>
        
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 text-lg">{template.title}</h3>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
             <span className={`text-xs px-2 py-0.5 rounded border ${template.pricing === 'free' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                {template.pricing === 'free' ? 'Free' : `$${template.price}`}
             </span>
             {template.compatibility.figma && <span className="text-[10px] text-slate-400 font-medium">Figma</span>}
             {template.compatibility.sketch && <span className="text-[10px] text-slate-400 font-medium">Sketch</span>}
          </div>

          
          <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
            <div className="flex items-center gap-2 text-xs text-slate-600">
               <img src={template.author.avatar} alt={template.author.name} className="w-6 h-6 rounded-full border border-slate-200" />
               <span className="font-medium truncate max-w-[80px]">{template.author.name}</span>
               {template.author.verified && <span className="text-blue-500" title="Verified">✓</span>}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
               <div className="flex items-center gap-1" title={`${template.stats.views} views`}>
                <Eye className="w-3 h-3" />
                <span>{formatNumber(template.stats.views)}</span>
              </div>
              <div className="flex items-center gap-1" title={`${template.stats.downloads} downloads`}>
                <Download className="w-3 h-3" />
                <span>{formatNumber(template.stats.downloads)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
             <div className="bg-green-500/20 p-1 rounded-full">
               <Check className="w-4 h-4 text-green-400" />
             </div>
             <p className="font-medium text-sm">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showPreview && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            e.stopPropagation();
            setShowPreview(false);
          }}
        >
          <div 
            className="relative bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">{template.title}</h3>
              <button 
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-100 p-4 flex items-center justify-center relative">
              <img 
                src={previewImages[previewImageIndex]} 
                alt={template.title} 
                className="max-w-full max-h-[70vh] rounded-lg shadow-lg object-contain" 
              />
              {previewImages.length > 1 && (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImageIndex(c => (c === 0 ? previewImages.length - 1 : c - 1));
                    }} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full text-slate-800 shadow-lg backdrop-blur-sm z-10 transition-all hover:scale-110"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImageIndex(c => (c + 1) % previewImages.length);
                    }} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full text-slate-800 shadow-lg backdrop-blur-sm z-10 transition-all hover:scale-110"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </>
              )}
            </div>
            <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3">
               <button 
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium"
               >
                 Close
               </button>
               <button 
                onClick={() => {
                  setShowPreview(false);
                  onClick(template);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
               >
                 View Full Details
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TemplateCard;