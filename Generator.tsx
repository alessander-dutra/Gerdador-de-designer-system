import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Loader2, ArrowRight, Wand2, RefreshCw, ImagePlus, X, Check, Layers, MonitorSmartphone, Palette, UploadCloud, Plus, Lightbulb, Briefcase, ShoppingBag, Activity, Globe, MessageCircle, ChevronDown, ChevronUp, Timer, PenTool } from 'lucide-react';
import { generateTemplateIdea, generateTemplateImage } from '../services/gemini';
import { Template, TemplateImage } from '../types';

interface GeneratorProps {
  onSave?: (template: Template) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: Sparkles },
  { id: 'fintech', label: 'Fintech', icon: Briefcase },
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingBag },
  { id: 'health', label: 'Saúde & Fitness', icon: Activity },
  { id: 'social', label: 'Social', icon: MessageCircle },
  { id: 'travel', label: 'Viagem', icon: Globe },
];

const EXAMPLE_PROMPTS = [
  {
    category: 'fintech',
    title: 'Neo-Banco Moderno',
    prompt: 'Um painel de aplicativo bancário fintech futurista com modo escuro, detalhes em neon, visualização de portfólio de criptomoedas e recursos de transferência rápida.'
  },
  {
    category: 'ecommerce',
    title: 'Loja de Moda de Luxo',
    prompt: 'App de e-commerce de moda de luxo minimalista, apresentando fotografia de produto em tela cheia, tipografia serifada elegante e um fluxo de checkout perfeito.'
  },
  {
    category: 'health',
    title: 'Meditação & Yoga',
    prompt: 'App de ioga e meditação calmo e sereno usando cores pastéis, formas arredondadas suaves, rastreamento de progresso e verificações diárias de humor.'
  },
  {
    category: 'social',
    title: 'App de Histórias Visuais',
    prompt: 'Uma plataforma de mídia social vibrante focada em histórias visuais e transmissão ao vivo, com estilo de interface glassmorphism e layout de feed imersivo.'
  }
];

const Generator: React.FC<GeneratorProps> = ({ onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState<Template | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showInspiration, setShowInspiration] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Progress Bar State
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('Iniciando...');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setSelectedImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && !selectedImage) return;
    
    setIsGenerating(true);
    setGeneratedTemplate(null);
    setActiveImageIndex(0);
    setShowInspiration(false);
    setProgress(0);
    setLoadingStage('Analisando requisição...');

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90; // Stall at 90% until complete
        
        // Dynamic stages based on progress
        if (prev < 20) setLoadingStage('Estruturando UX/UI...');
        else if (prev < 50) setLoadingStage('Gerando especificações de design...');
        else if (prev < 80) setLoadingStage('Criando mockups visuais...');
        else setLoadingStage('Finalizando detalhes...');

        return prev + Math.random() * 15; // Faster random increment
      });
    }, 400); // Faster interval
    
    try {
      const imageBase64Clean = selectedImage ? selectedImage.split(',')[1] : undefined;
      const mimeType = selectedImage ? selectedImage.split(';')[0].split(':')[1] : undefined;
      const textPrompt = prompt || "modern UI design interface";

      const [templateData, overviewImageUrl] = await Promise.all([
        generateTemplateIdea(textPrompt, imageBase64Clean, mimeType),
        generateTemplateImage(textPrompt, "presentation grid mobile app", imageBase64Clean, mimeType)
      ]);

      const initialImages: TemplateImage[] = [{
        url: overviewImageUrl,
        caption: 'Visão Geral',
        type: 'mockup'
      }];

      // Strict sanitization of arrays to prevent dashboard crashes
      const safeFeatures = Array.isArray(templateData.features) 
        ? templateData.features 
        : (typeof templateData.features === 'string' ? [templateData.features] : ['Responsive Design', 'Mobile UI', 'Modern Layout']);
      
      const safeTags = Array.isArray(templateData.tags) 
        ? templateData.tags 
        : ['AI', 'Generated', 'UI Kit'];

      const safeDesignElements = Array.isArray(templateData.designElements)
        ? templateData.designElements
        : ['Paleta de Cores Moderna', 'Tipografia Sans Serif', 'Ícones Minimalistas', 'Espaçamento em Grid de 8pt', 'Cantos Arredondados'];

      // Optimize: Generate only 1 extra screen initially to speed up the process
      const featuresToGenerate = safeFeatures.slice(0, 1);
      
      if (featuresToGenerate.length > 0) {
        const screenPromises = featuresToGenerate.map(async (feature: string): Promise<TemplateImage | null> => {
          try {
            const url = await generateTemplateImage(
              templateData.title || textPrompt, 
              `${feature} mobile screen ui design interface`,
              imageBase64Clean,
              mimeType
            );
            return {
              url,
              caption: feature,
              type: 'screenshot'
            };
          } catch (e) {
            return null;
          }
        });

        const generatedScreens = await Promise.all(screenPromises);
        const validScreens = generatedScreens.filter((img): img is TemplateImage => img !== null);
        initialImages.push(...validScreens);
      }

      setGeneratedTemplate({
        id: `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Robust ID generation
        title: templateData.title || 'Untitled UI Kit',
        description: templateData.description || 'A complete UI kit for your next project.',
        category: 'ai-generated',
        tags: safeTags,
        features: safeFeatures,
        designElements: safeDesignElements,
        images: initialImages,
        stats: { likes: 0, views: 0, downloads: 0, comments: 0 },
        author: { name: 'Gemini AI', avatar: 'https://ui-avatars.com/api/?name=AI&background=6366f1&color=fff', verified: true },
        compatibility: { figma: true, sketch: false, adobeXd: false, framer: false },
        pricing: 'free',
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        collections: [],
        createdAt: new Date().toISOString()
      });

      // Finish progress
      clearInterval(progressInterval);
      setProgress(100);
      setLoadingStage('Concluído!');

    } catch (error) {
      console.error("Generation failed", error);
      alert("Algo deu errado com a geração da IA. Tente novamente.");
      setIsGenerating(false);
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false); // Remove artificial timeout
    }
  };

  const handleGenerateMoreScreens = async () => {
    if (!generatedTemplate || !generatedTemplate.features) return;
    setIsGeneratingImages(true);
    try {
      const existingCaptions = generatedTemplate.images.map(img => img.caption);
      const remainingFeatures = generatedTemplate.features.filter(f => !existingCaptions.includes(f));
      const screensToGenerate = remainingFeatures.length > 0 ? remainingFeatures.slice(0, 2) : ['Profile', 'Notifications'];
      
      const imageBase64Clean = selectedImage ? selectedImage.split(',')[1] : undefined;
      const mimeType = selectedImage ? selectedImage.split(';')[0].split(':')[1] : undefined;
      
      const newImagePromises = screensToGenerate.map(async (feature) => {
        const url = await generateTemplateImage(generatedTemplate.title, `${feature} mobile screen ui design`, imageBase64Clean, mimeType);
        return { url, caption: feature, type: 'screenshot' as const };
      });
      const newImages = await Promise.all(newImagePromises);
      setGeneratedTemplate({ ...generatedTemplate, images: [...generatedTemplate.images, ...newImages] });
    } catch (error) { } finally { setIsGeneratingImages(false); }
  };

  const handleSave = () => {
    if (generatedTemplate && onSave) {
      setIsSaving(true);
      // Small timeout to show spinner state
      setTimeout(() => {
        onSave(generatedTemplate);
        setIsSaving(false);
      }, 500);
    }
  };

  const filteredExamples = activeCategory === 'all' 
    ? EXAMPLE_PROMPTS 
    : EXAMPLE_PROMPTS.filter(e => e.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-12">
      <div className="text-center space-y-3 py-6 md:py-8">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30">
           <Wand2 className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-slate-900 px-4">Gerador de Templates com IA</h1>
        <p className="text-sm md:text-lg text-slate-500 max-w-2xl mx-auto px-4">
          Crie sistemas de design completos a partir de texto ou imagens de referência.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 px-2 md:px-0">
        
        {/* Inspiration Section */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
           <button onClick={() => setShowInspiration(!showInspiration)} className="w-full flex items-center justify-between font-bold text-slate-800 text-sm md:text-base">
              <span className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-500" /> Inspiração e Ideias</span>
              {showInspiration ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
           </button>
           
           {showInspiration && (
             <div className="mt-4 space-y-4 animate-fade-in">
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2">
                    {CATEGORIES.map(cat => (
                      <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}><cat.icon className="w-3 h-3" />{cat.label}</button>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredExamples.map((example, idx) => (
                      <button key={idx} onClick={() => setPrompt(example.prompt)} className="text-left p-3 md:p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-indigo-400 hover:bg-white transition-all group">
                        <div className="font-bold text-slate-800 mb-1 text-sm group-hover:text-indigo-600">{example.title}</div>
                        <div className="text-[10px] md:text-xs text-slate-400 line-clamp-2">{example.prompt}</div>
                      </button>
                    ))}
                </div>
             </div>
           )}
        </div>

        {/* Input Area */}
        <div className={`bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border p-3 md:p-4 transition-all relative overflow-hidden ${isDragging ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-slate-100'}`}>
          {isGenerating && (
             <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 animate-fade-in">
                <div className="w-full max-w-md space-y-4">
                  <div className="flex justify-between items-end text-sm font-bold text-indigo-900">
                    <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 animate-pulse" /> {loadingStage}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 ease-out rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                  <p className="text-xs text-center text-slate-400 flex items-center justify-center gap-1">
                     <Timer className="w-3 h-3" /> O tempo médio de geração é de 15-30 segundos.
                  </p>
                </div>
             </div>
          )}

          {selectedImage && (
            <div className="mx-2 mb-4 relative inline-block group">
              <img src={selectedImage} alt="Reference" className="h-24 md:h-32 w-auto rounded-lg border border-slate-200 shadow-sm object-cover" />
              <button onClick={clearImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-all"><X className="w-4 h-4" /></button>
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-start bg-slate-50 rounded-xl px-2 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <button onClick={() => fileInputRef.current?.click()} className={`p-3 rounded-lg flex-shrink-0 flex items-center justify-center ${selectedImage ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600'}`}><ImagePlus className="w-6 h-6" /></button>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="ex: App de Banco Moderno com Gráficos..." className="flex-1 bg-transparent border-none text-base md:text-lg px-2 py-2 focus:ring-0 placeholder-slate-300 outline-none text-slate-700 resize-none min-h-[52px]" rows={2} />
            </div>
            <button onClick={handleGenerate} disabled={isGenerating || (!prompt && !selectedImage)} className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-[0.98]">
              {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Processando...</span></> : <><Sparkles className="w-5 h-5" /><span>Gerar UI Kit</span></>}
            </button>
          </div>
        </div>
      </div>

      {generatedTemplate && (
        <div className="animate-fade-in-up space-y-6 pt-6 px-2 md:px-0">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div><h2 className="text-xl md:text-2xl font-bold text-slate-800">Kit de UI Gerado</h2></div>
              <div className="flex gap-2">
                 <button onClick={handleGenerate} className="flex-1 md:flex-none px-4 py-2.5 text-slate-600 bg-white hover:bg-slate-50 rounded-xl flex items-center justify-center gap-2 text-sm font-bold border border-slate-200 transition-all"><RefreshCw className="w-4 h-4" /> Regerar</button>
                 <button onClick={handleSave} disabled={isSaving} className="flex-1 md:flex-none px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2 text-sm font-bold transition-all disabled:opacity-70">{isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Salvar</button>
                 <button onClick={() => {
                   const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(generatedTemplate, null, 2));
                   const downloadAnchorNode = document.createElement('a');
                   downloadAnchorNode.setAttribute("href",     dataStr);
                   downloadAnchorNode.setAttribute("download", generatedTemplate.title.replace(/\s+/g, '_').toLowerCase() + ".json");
                   document.body.appendChild(downloadAnchorNode);
                   downloadAnchorNode.click();
                   downloadAnchorNode.remove();
                 }} className="flex-1 md:flex-none px-4 py-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl flex items-center justify-center gap-2 text-sm font-bold border border-indigo-100 transition-all">Exportar JSON</button>
              </div>
           </div>

           <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl flex flex-col lg:flex-row min-h-[500px]">
              <div className="lg:w-2/3 bg-slate-50 relative flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200">
                <div className="aspect-video relative overflow-hidden group">
                  <img src={generatedTemplate.images[activeImageIndex]?.url} className="w-full h-full object-cover object-top" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold text-indigo-600 shadow-sm flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI</span>
                    {generatedTemplate.images[activeImageIndex]?.caption && <span className="px-3 py-1 bg-black/50 backdrop-blur rounded-full text-[10px] font-medium text-white shadow-sm">{generatedTemplate.images[activeImageIndex].caption}</span>}
                  </div>
                </div>
                <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2 overflow-x-auto">
                    <div className="flex gap-2 no-scrollbar">
                        {generatedTemplate.images.map((img, idx) => (
                           <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${activeImageIndex === idx ? 'border-indigo-600' : 'border-transparent opacity-60'}`}><img src={img.url} className="w-full h-full object-cover" /></button>
                        ))}
                    </div>
                    <button onClick={handleGenerateMoreScreens} disabled={isGeneratingImages} className="p-2 md:px-4 md:py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 text-xs font-bold whitespace-nowrap">{isGeneratingImages ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}</button>
                </div>
              </div>
              <div className="lg:w-1/3 p-6 md:p-8 flex flex-col bg-white overflow-y-auto max-h-[800px]">
                 <div className="mb-6">
                    <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold mb-3 uppercase tracking-widest">Mobile UI Kit</div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">{generatedTemplate.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{generatedTemplate.description}</p>
                 </div>

                 {/* Design Elements Section */}
                 {generatedTemplate.designElements && generatedTemplate.designElements.length > 0 && (
                   <div className="mb-6 bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100">
                      <h4 className="text-xs font-bold text-indigo-900 mb-3 flex items-center gap-2 uppercase tracking-widest"><Palette className="w-4 h-4 text-indigo-500" /> Diretrizes Visuais</h4>
                      <ul className="space-y-2">
                        {generatedTemplate.designElements.map((el, idx) => (
                           <li key={idx} className="flex items-start gap-2 text-xs text-indigo-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                              <span className="leading-snug">{el}</span>
                           </li>
                        ))}
                      </ul>
                   </div>
                 )}

                 <div className="mb-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex-1">
                    <h4 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-widest"><Layers className="w-4 h-4 text-slate-500" /> Funcionalidades</h4>
                    <ul className="space-y-2.5">
                        {generatedTemplate.features?.map((feature, idx) => {
                            const hasImg = generatedTemplate.images.some(img => img.caption === feature);
                            return (
                              <li key={idx} className="flex items-center gap-3 text-xs md:text-sm text-slate-600">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${hasImg ? 'bg-green-100' : 'bg-slate-200'}`}>{hasImg ? <Check className="w-3 h-3 text-green-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}</div>
                                  <span className={hasImg ? 'text-slate-900 font-bold' : 'text-slate-500'}>{feature}</span>
                              </li>
                            );
                        })}
                    </ul>
                 </div>
                 <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><MonitorSmartphone className="w-3 h-3" /> Responsive</span>
                    <span className="flex items-center gap-1"><Palette className="w-3 h-3" /> Design System</span>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Generator;