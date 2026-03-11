import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';
import Login from './pages/Login';
import Register from './pages/Register';
import TemplateDetails from './pages/TemplateDetails';
import { ViewState, User, AuthState, Template } from './types';
import { authService } from './services/auth';
import { MOCK_TEMPLATES, getImg } from './data/templates';
import { saveTemplatesToIndexedDB, loadTemplatesFromIndexedDB, saveToStorage } from './services/storage';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [authView, setAuthView] = useState<AuthState>('login');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop collapse state
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardSort, setDashboardSort] = useState<'popular' | 'recent'>('popular');
  
  // State for navigating to details
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  // Shared liked state for demo persistence across views
  const [likedTemplates, setLikedTemplates] = useState<Set<string>>(new Set());
  
  // Manage templates state with IndexedDB persistence
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [isStorageInitialized, setIsStorageInitialized] = useState(false);

  // Load templates from IndexedDB on mount
  useEffect(() => {
    const initData = async () => {
      try {
        const savedTemplates = await loadTemplatesFromIndexedDB();
        if (savedTemplates && savedTemplates.length > 0) {
          // Ensure all templates have images (migration for older templates)
          const migratedTemplates = savedTemplates.map((t, idx) => {
            if (!t.images || t.images.length === 0 || typeof t.images[0] === 'string') {
              return {
                ...t,
                images: [
                  {
                    url: getImg(t.title || t.category || 'other', idx),
                    caption: 'Visão Geral',
                    type: 'mockup' as const
                  }
                ]
              };
            }
            return t;
          });
          setTemplates(migratedTemplates);
        } else {
          // If DB is empty, use mocks and save them to DB
          await saveTemplatesToIndexedDB(MOCK_TEMPLATES);
        }
        
        // Load likes
        const savedLikes = localStorage.getItem('dg_likes');
        if (savedLikes) {
          setLikedTemplates(new Set(JSON.parse(savedLikes)));
        }
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setIsStorageInitialized(true);
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  // Persist templates changes to IndexedDB
  useEffect(() => {
    if (isStorageInitialized) {
      // Debounce saving slightly to avoid heavy DB ops on rapid changes if any
      const timer = setTimeout(() => {
        saveTemplatesToIndexedDB(templates);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [templates, isStorageInitialized]);

  // Check for existing session on mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setAuthView('login');
  };

  const navigateToDetails = (template: Template) => {
    // Find the most up-to-date version of the template from the state
    const currentTemplate = templates.find(t => t.id === template.id) || template;
    setSelectedTemplate(currentTemplate);
    setCurrentView('template-details');
    // Scroll to top when navigating to details
    window.scrollTo(0, 0);
  };

  const handleGlobalLike = (id: string) => {
    const isCurrentlyLiked = likedTemplates.has(id);
    
    // 1. Update the Liked Set (Visual Toggle)
    setLikedTemplates(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        // Save to local storage for persistence using safe wrapper
        saveToStorage('dg_likes', Array.from(newSet));
        return newSet;
    });

    // 2. Update the Numeric Count in the templates array
    setTemplates(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          stats: {
            ...t.stats,
            likes: isCurrentlyLiked ? Math.max(0, t.stats.likes - 1) : t.stats.likes + 1
          }
        };
      }
      return t;
    }));

    // 3. Update the selected template if open so the UI refreshes instantly
    if (selectedTemplate?.id === id) {
      setSelectedTemplate(prev => prev ? ({
        ...prev,
        stats: {
          ...prev.stats,
          likes: isCurrentlyLiked ? Math.max(0, prev.stats.likes - 1) : prev.stats.likes + 1
        }
      }) : null);
    }
  };

  const handleDownloadIncrement = (id: string) => {
    // 1. Update templates array
    setTemplates(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          stats: {
            ...t.stats,
            downloads: t.stats.downloads + 1
          }
        };
      }
      return t;
    }));

    // 2. Update selected template
    if (selectedTemplate?.id === id) {
      setSelectedTemplate(prev => prev ? ({
        ...prev,
        stats: {
          ...prev.stats,
          downloads: prev.stats.downloads + 1
        }
      }) : null);
    }
  };

  const handleSaveGeneratedTemplate = (newTemplate: Template) => {
    setTemplates(prev => [newTemplate, ...prev]);
    // Force sort to 'recent' to show the new template at the top
    setDashboardSort('recent');
    setCurrentView('dashboard');
  };

  const handleUpdateTemplate = async (updatedTemplate: Template) => {
    setTemplates(prev => {
      const newTemplates = prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t);
      // Save to IndexedDB
      saveTemplatesToIndexedDB(newTemplates).catch(console.error);
      return newTemplates;
    });
    if (selectedTemplate?.id === updatedTemplate.id) {
      setSelectedTemplate(updatedTemplate);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
          templates={templates}
          onNavigateToGenerator={() => setCurrentView('generator')} 
          onNavigateToDetails={navigateToDetails}
          defaultSort={dashboardSort}
        />;
      case 'template-details':
        if (!selectedTemplate) return <Dashboard templates={templates} onNavigateToGenerator={() => setCurrentView('generator')} onNavigateToDetails={navigateToDetails} />;
        return <TemplateDetails 
          template={selectedTemplate} 
          allTemplates={templates}
          onBack={() => setCurrentView('dashboard')}
          isLiked={likedTemplates.has(selectedTemplate.id)}
          onLike={handleGlobalLike}
          onDownload={handleDownloadIncrement}
          onNavigateToDetails={navigateToDetails}
          onUpdateTemplate={handleUpdateTemplate}
        />;
      case 'generator':
        return <Generator onSave={handleSaveGeneratedTemplate} />;
      case 'favorites':
        const favoriteTemplates = templates.filter(t => likedTemplates.has(t.id));
        
        if (favoriteTemplates.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 animate-fade-in-up">
              <div className="bg-slate-100 p-6 rounded-full mb-4">
                <span className="text-4xl">❤️</span>
              </div>
              <h2 className="text-2xl font-semibold text-slate-700">Sem favoritos ainda</h2>
              <p>Salve os designs que você ama para acessá-los aqui.</p>
            </div>
          );
        }
        
        return (
           <div className="space-y-6 animate-fade-in-up">
             <h2 className="text-2xl font-bold text-slate-900">Seus Favoritos</h2>
             <Dashboard 
                templates={favoriteTemplates}
                onNavigateToGenerator={() => setCurrentView('generator')} 
                onNavigateToDetails={navigateToDetails}
             />
           </div>
        );

      case 'settings':
         return (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
               <h3 className="text-lg font-semibold text-slate-800 mb-4">Informações do Perfil</h3>
               <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                 <img src={currentUser?.avatar} alt="Avatar" className="w-16 h-16 rounded-full border-4 border-slate-50" />
                 <div className="text-center sm:text-left">
                   <p className="font-medium text-slate-900">{currentUser?.name}</p>
                   <p className="text-slate-500 text-sm">{currentUser?.email}</p>
                 </div>
               </div>
               <div className="space-y-4">
                  <div className="grid gap-2">
                     <label className="text-sm font-medium text-slate-700">Nome de Exibição</label>
                     <input disabled value={currentUser?.name} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" />
                  </div>
                  <div className="grid gap-2">
                     <label className="text-sm font-medium text-slate-700">Cargo</label>
                     <input disabled value={currentUser?.role} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" />
                  </div>
               </div>
            </div>
          </div>
         );
      default:
        return <Dashboard templates={templates} onNavigateToGenerator={() => setCurrentView('generator')} onNavigateToDetails={navigateToDetails} />;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!currentUser) {
    if (authView === 'register') {
      return <Register onSuccess={handleLogin} onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Login onSuccess={handleLogin} onSwitchToRegister={() => setAuthView('register')} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-[60] md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <div className={`fixed inset-y-0 left-0 z-[70] transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
         <Sidebar 
            currentView={currentView} 
            onNavigate={(view) => {
              // Reset sort to popular when manually navigating back to dashboard, unless we are saving
              if (view === 'dashboard' && currentView !== 'generator') {
                setDashboardSort('popular');
              }
              setCurrentView(view);
              setIsSidebarOpen(false);
            }} 
            onLogout={handleLogout}
            isCollapsed={isSidebarCollapsed}
            toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            onCloseMobile={() => setIsSidebarOpen(false)}
         />
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 min-w-0 h-screen overflow-y-auto`}>
        <Header 
          user={currentUser} 
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;