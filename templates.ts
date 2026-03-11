import { Template } from '../types';

// Helper to generate consistent images using reliable Unsplash URLs
const CATEGORY_IMAGES: Record<string, string[]> = {
  fintech: [
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80'
  ],
  delivery: [
    'https://images.unsplash.com/photo-1498837167922-41c53bbf0e26?w=800&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80'
  ],
  social: [
    'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80'
  ],
  ecommerce: [
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'
  ],
  fitness: [
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    'https://images.unsplash.com/photo-1526506114642-54cb3586ed3f?w=800&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'
  ],
  travel: [
    'https://images.unsplash.com/photo-1476900543704-4312b78632f8?w=800&q=80',
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80'
  ],
  productivity: [
    'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
    'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80',
    'https://images.unsplash.com/photo-1507925922837-326f12d9348e?w=800&q=80'
  ],
  other: [
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&q=80',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'
  ]
};

export const getImg = (prompt: string, seed: number) => {
  const keywords = Object.keys(CATEGORY_IMAGES);
  const promptLower = prompt.toLowerCase();
  let category = 'other';
  
  // Try to match prompt to a category
  for (const kw of keywords) {
    if (promptLower.includes(kw) || promptLower.includes('food') && kw === 'delivery' || promptLower.includes('bank') && kw === 'fintech') {
      category = kw;
      break;
    }
  }
  
  const images = CATEGORY_IMAGES[category];
  return images[seed % images.length];
};

export const MOCK_TEMPLATES: Template[] = [
  // --- FINTECH ---
  {
    id: 'fintech-1',
    title: 'Coinpay Fintech - Kit UI Financeiro',
    description: 'Um kit de UI completo para aplicativos financeiros com recursos bancários modernos, painel de criptomoedas, rastreamento de investimentos e fluxos de pagamento perfeitos. Ideal para startups fintech e aplicativos bancários com suporte aos modos claro e escuro.',
    category: 'fintech',
    images: [
      { url: getImg('Fintech mobile app dashboard dark mode purple gradient coinpay', 101), caption: 'Visão Geral do Painel', type: 'mockup' },
      { url: getImg('Fintech mobile app login screen security face id', 102), caption: 'Login Seguro', type: 'screenshot' },
      { url: getImg('Crypto trading chart mobile app ui', 103), caption: 'Visualização de Trading', type: 'screenshot' },
      { url: getImg('Mobile banking transfer money success screen', 104), caption: 'Sucesso na Transferência', type: 'screenshot' },
      { url: getImg('Digital wallet profile settings mobile ui', 105), caption: 'Configurações de Perfil', type: 'screenshot' }
    ],
    stats: { likes: 1847, views: 116234, downloads: 23456, comments: 89 },
    features: ['30+ Telas Móveis', 'Modo Claro e Escuro', 'Painel Cripto', 'Gráficos de Investimento', 'Gestão de Cartões'],
    tags: ['fintech', 'banco', 'cripto', 'modo escuro', 'dashboard'],
    designElements: ['Paleta de Cores Moderna', 'Tipografia Sans Serif', 'Ícones Minimalistas', 'Espaçamento em Grid de 8pt', 'Cantos Arredondados'],
    author: { name: 'Mcheidi Hasan', avatar: 'https://ui-avatars.com/api/?name=MH&background=6366f1&color=fff', verified: true },
    compatibility: { figma: true, sketch: true, adobeXd: false, framer: true },
    pricing: 'premium',
    price: 39,
    version: '2.1.0',
    lastUpdated: '2024-03-15',
    createdAt: '2024-01-10',
    collections: ['Melhores de 2024', 'Fintech']
  },
  {
    id: 'fintech-2',
    title: 'NeoBank - UI Bancária Limpa',
    description: 'Experiência bancária minimalista focada em clareza e velocidade. Inclui geração de cartões virtuais e análise de gastos.',
    category: 'fintech',
    images: [
      { url: getImg('Minimalist white banking app ui dashboard blue accent', 110), caption: 'Tela Inicial', type: 'mockup' },
      { url: getImg('Banking app spending analytics chart minimalist', 111), caption: 'Análises', type: 'screenshot' }
    ],
    stats: { likes: 920, views: 45000, downloads: 12000, comments: 34 },
    features: ['Tipografia Limpa', 'Análise de Gastos', 'Cartões Virtuais', 'Divisor de Contas'],
    tags: ['banco', 'minimalista', 'limpo', 'finanças'],
    designElements: ['Paleta de Cores Moderna', 'Tipografia Sans Serif', 'Ícones Minimalistas', 'Espaçamento em Grid de 8pt', 'Cantos Arredondados'],
    author: { name: 'PixelPerfect', avatar: 'https://ui-avatars.com/api/?name=PP&background=10b981&color=fff', verified: false },
    compatibility: { figma: true, sketch: false, adobeXd: true, framer: false },
    pricing: 'free',
    version: '1.0.0',
    lastUpdated: '2024-02-01',
    createdAt: '2024-02-01',
    collections: []
  },
  {
    id: 'fintech-3',
    title: 'WalletX - App de Carteira Digital',
    description: 'Um design de carteira digital colorido e amigável para pagamentos peer-to-peer e leitura de código QR.',
    category: 'fintech',
    images: [
      { url: getImg('E-wallet mobile app ui vibrant colors qr scan', 120), caption: 'Escanear para Pagar', type: 'mockup' },
      { url: getImg('Mobile wallet transaction history list ui', 121), caption: 'Histórico', type: 'screenshot' }
    ],
    stats: { likes: 1200, views: 67000, downloads: 15000, comments: 56 },
    features: ['Pagamentos QR', 'Lista de Contatos', 'Fluxo de Recarga', 'Sistema de Recompensas'],
    tags: ['carteira', 'pagamento', 'colorido'],
    designElements: ['Paleta de Cores Moderna', 'Tipografia Sans Serif', 'Ícones Minimalistas', 'Espaçamento em Grid de 8pt', 'Cantos Arredondados'],
    author: { name: 'DesignDeck', avatar: 'https://ui-avatars.com/api/?name=DD&background=f43f5e&color=fff', verified: true },
    compatibility: { figma: true, sketch: true, adobeXd: true, framer: true },
    pricing: 'premium',
    price: 19,
    version: '1.5.0',
    lastUpdated: '2024-03-10',
    createdAt: '2023-11-20',
    collections: []
  },

  // --- DELIVERY ---
  {
    id: 'food-1',
    title: 'YumEat - App de Delivery',
    description: 'Design vibrante e apetitoso para entrega de comida. Apresenta rastreamento ao vivo, layouts ricos em fotografia de menu e interação com o motorista.',
    category: 'delivery',
    images: [
      { url: getImg('Vibrant orange food delivery app mobile ui product detail appetizing burger high quality', 255), caption: 'Detalhes do Produto', type: 'mockup' },
      { url: getImg('Food delivery app home screen vibrant rich menu photography mobile ui', 256), caption: 'Feed Inicial', type: 'screenshot' },
      { url: getImg('Food delivery app map live tracking driver route interface mobile ui', 257), caption: 'Rastreamento de Pedido', type: 'screenshot' },
      { url: getImg('Food delivery app checkout cart summary vibrant mobile ui', 258), caption: 'Checkout', type: 'screenshot' }
    ],
    stats: { likes: 2100, views: 150000, downloads: 45000, comments: 120 },
    features: ['Rastreamento em Tempo Real', 'Chat com Motorista', 'Perfil do Restaurante', 'Sistema de Avaliação'],
    tags: ['comida', 'entrega', 'restaurante', 'mapa'],
    designElements: ['Paleta de Cores Moderna', 'Tipografia Sans Serif', 'Ícones Minimalistas', 'Espaçamento em Grid de 8pt', 'Cantos Arredondados'],
    author: { name: 'YumDesign', avatar: 'https://ui-avatars.com/api/?name=YD&background=f97316&color=fff', verified: true },
    compatibility: { figma: true, sketch: false, adobeXd: true, framer: false },
    pricing: 'freemium',
    version: '3.0.0',
    lastUpdated: '2024-03-01',
    createdAt: '2023-10-15',
    collections: ['Popular']
  },
  {
    id: 'food-2',
    title: 'FreshGrocer',
    description: 'Compras de supermercado facilitadas com navegação baseada em categorias e horários de entrega agendados.',
    category: 'delivery',
    images: [
      { url: getImg('Grocery app ui green fresh vegetables', 210), caption: 'Frente da Loja', type: 'mockup' },
      { url: getImg('Grocery app product grid ui', 211), caption: 'Visualização de Corredor', type: 'screenshot' }
    ],
    stats: { likes: 800, views: 30000, downloads: 5000, comments: 12 },
    features: ['Grade de Categorias', 'Filtros de Pesquisa', 'Gestão de Carrinho', 'Horários de Entrega'],
    tags: ['mercado', 'compras', 'fresco'],
    designElements: ['Paleta de Cores Moderna', 'Tipografia Sans Serif', 'Ícones Minimalistas', 'Espaçamento em Grid de 8pt', 'Cantos Arredondados'],
    author: { name: 'GreenLabs', avatar: 'https://ui-avatars.com/api/?name=GL&background=84cc16&color=fff', verified: false },
    compatibility: { figma: true, sketch: true, adobeXd: false, framer: false },
    pricing: 'free',
    version: '1.2.0',
    lastUpdated: '2024-02-15',
    createdAt: '2023-12-01',
    collections: []
  },

  // --- SOCIAL ---
  {
    id: 'social-1',
    title: 'Social Connect App',
    description: 'Interface de rede social moderna com stories, layouts de feed imersivos e mensagens em tempo real.',
    category: 'social',
    images: [
      { url: getImg('Social media app ui profile modern gradient', 301), caption: 'Perfil de Usuário', type: 'mockup' },
      { url: getImg('Social media feed ui stories', 302), caption: 'Feed de Notícias', type: 'screenshot' },
      { url: getImg('Social media chat interface ui', 303), caption: 'Mensagens Diretas', type: 'screenshot' }
    ],
    stats: { likes: 3200, views: 210000, downloads: 85000, comments: 340 },
    features: ['Interface de Stories', 'Sistema de Chat', 'Layouts de Feed', 'Personalização de Perfil'],
    tags: ['social', 'chat', 'comunidade', 'midia'],
    designElements: ['Paleta de Cores Moderna', 'Tipografia Sans Serif', 'Ícones Minimalistas', 'Espaçamento em Grid de 8pt', 'Cantos Arredondados'],
    author: { name: 'SocialKit', avatar: 'https://ui-avatars.com/api/?name=SK&background=ec4899&color=fff', verified: true },
    compatibility: { figma: true, sketch: true, adobeXd: true, framer: true },
    pricing: 'free',
    version: '4.5.0',
    lastUpdated: '2024-03-10',
    createdAt: '2023-09-12',
    collections: ['Em Alta']
  },
  {
    id: 'social-2',
    title: 'ChatFlow Messenger',
    description: 'Aplicativo de mensagens limpo focado em tipografia e legibilidade. Inclui telas de chamada de voz e vídeo.',
    category: 'social',
    images: [
      { url: getImg('Messaging app ui clean white blue bubbles', 310), caption: 'Lista de Conversas', type: 'mockup' },
      { url: getImg('Video call mobile ui screen', 311), caption: 'Chamada de Vídeo', type: 'screenshot' }
    ],
    stats: { likes: 1500, views: 80000, downloads: 20000, comments: 45 },
    features: ['Balões de Chat', 'Telas de Chamada', 'Lista de Contatos', 'Configurações'],
    tags: ['mensagens', 'chat', 'limpo'],
    designElements: ['Paleta de Cores Moderna', 'Tipografia Sans Serif', 'Ícones Minimalistas', 'Espaçamento em Grid de 8pt', 'Cantos Arredondados'],
    author: { name: 'ChatMaster', avatar: 'https://ui-avatars.com/api/?name=CM&background=3b82f6&color=fff', verified: false },
    compatibility: { figma: true, sketch: false, adobeXd: true, framer: false },
    pricing: 'premium',
    price: 15,
    version: '2.0.0',
    lastUpdated: '2024-01-20',
    createdAt: '2023-11-05',
    collections: []
  },

  // --- ECOMMERCE ---
  {
    id: 'ecom-1',
    title: 'Luxe Fashion Store',
    description: 'Design minimalista e sofisticado para marcas de luxo. Enfatiza imagens grandes e tipografia.',
    category: 'ecommerce',
    images: [
      { url: getImg('Luxury fashion app ui minimalist beige', 401), caption: 'Introdução da Marca', type: 'mockup' },
      { url: getImg('Fashion app product detail ui high end', 402), caption: 'Visualização do Produto', type: 'screenshot' },
      { url: getImg('Fashion app shopping bag ui minimalist', 403), caption: 'Carrinho', type: 'screenshot' }
    ],
    stats: { likes: 1800, views: 67000, downloads: 22000, comments: 55 },
    features: ['Layouts Editoriais', 'Visualização Lookbook', 'Fluxo de Checkout', 'Lista de Desejos'],
    tags: ['luxo', 'moda', 'minimalista', 'loja'],
    designElements: ['Paleta de Cores Moderna', 'Tipografia Sans Serif', 'Ícones Minimalistas', 'Espaçamento em Grid de 8pt', 'Cantos Arredondados'],
    author: { name: 'LuxeDesign', avatar: 'https://ui-avatars.com/api/?name=LD&background=000000&color=fff', verified: true },
    compatibility: { figma: true, sketch: false, adobeXd: false, framer: true },
    pricing: 'premium',
    price: 59,
    version: '1.5.0',
    lastUpdated: '2024-01-25',
    createdAt: '2023-10-05',
    collections: ['Moda']
  },
  {
    id: 'ecom-2',
    title: 'GadgetZone',
    description: 'Aplicativo de e-commerce focado em tecnologia com fichas técnicas detalhadas e ferramentas de comparação.',
    category: 'ecommerce',
    images: [
      { url: getImg('Tech store mobile app ui dark mode blue', 410), caption: 'Início', type: 'mockup' },
      { url: getImg('Product specs comparison mobile ui', 411), caption: 'Comparação', type: 'screenshot' }
    ],
    stats: { likes: 600, views: 25000, downloads: 8000, comments: 20 },
    features: ['Especificações Técnicas', 'Ferramenta de Comparação', 'Avaliações de Usuários', 'Modo Escuro'],
    tags: ['tech', 'gadgets', 'loja', 'modo escuro'],
    designElements: ['Paleta de Cores Moderna', 'Tipografia Sans Serif', 'Ícones Minimalistas', 'Espaçamento em Grid de 8pt', 'Cantos Arredondados'],
    author: { name: 'TechUI', avatar: 'https://ui-avatars.com/api/?name=TU&background=0ea5e9&color=fff', verified: false },
    compatibility: { figma: true, sketch: true, adobeXd: true, framer: false },
    pricing: 'free',
    version: '1.0.0',
    lastUpdated: '2023-12-10',
    createdAt: '2023-12-10',
    collections: []
  },

  // --- FITNESS ---
  {
    id: 'fitness-1',
    title: 'FitTrack Pro',
    description: 'Aplicativo de fitness de alta energia com estética em modo escuro. Rastreia treinos, calorias e passos com belos gráficos.',
    category: 'fitness',
    images: [
      { url: getImg('Dark mode fitness app dashboard UI neon green accents activity rings and step counter modern high fidelity', 501), caption: 'Painel', type: 'mockup' },
      { url: getImg('Fitness app workout timer UI screen dark mode heart rate graph and exercise controls', 502), caption: 'Modo de Treino', type: 'screenshot' },
      { url: getImg('Dark mode fitness app analytics screen glowing neon charts and data visualization', 503), caption: 'Estatísticas', type: 'screenshot' }
    ],
    stats: { likes: 2900, views: 105000, downloads: 48000, comments: 198 },
    features: ['Anéis de Atividade', 'Player de Treino', 'Estatísticas de Saúde', 'Desafios Sociais'],
    tags: ['fitness', 'treino', 'saude', 'modo escuro'],
    designElements: ['Paleta de Cores Moderna', 'Tipografia Sans Serif', 'Ícones Minimalistas', 'Espaçamento em Grid de 8pt', 'Cantos Arredondados'],
    author: { name: 'FitDesign', avatar: 'https://ui-avatars.com/api/?name=FD&background=84cc16&color=fff', verified: true },
    compatibility: { figma: true, sketch: true, adobeXd: true, framer: false },
    pricing: 'freemium',
    price: 0,
    version: '3.2.0',
    lastUpdated: '2024-02-12',
    createdAt: '2023-10-15',
    collections: ['Saúde']
  },
  {
    id: 'fitness-2',
    title: 'Zen Mind - Meditação',
    description: 'Interface calma e serena para meditação, rastreamento do sono e bem-estar mental.',
    category: 'fitness',
    images: [
      { url: getImg('Meditation app ui pastel colors soft', 510), caption: 'Início', type: 'mockup' },
      { url: getImg('Meditation player mobile ui', 511), caption: 'Player', type: 'screenshot' }
    ],
    stats: { likes: 1200, views: 48000, downloads: 18000, comments: 62 },
    features: ['Player de Áudio', 'Rastreador de Humor', 'Sequências Diárias', 'Diário'],
    tags: ['meditacao', 'bem-estar', 'yoga'],
    designElements: ['Paleta de Cores Moderna', 'Tipografia Sans Serif', 'Ícones Minimalistas', 'Espaçamento em Grid de 8pt', 'Cantos Arredondados'],
    author: { name: 'ZenUI', avatar: 'https://ui-avatars.com/api/?name=ZU&background=a78bfa&color=fff', verified: false },
    compatibility: { figma: true, sketch: true, adobeXd: false, framer: true },
    pricing: 'free',
    version: '1.4.0',
    lastUpdated: '2024-01-20',
    createdAt: '2023-09-30',
    collections: []
  },

  // --- TRAVEL ---
  {
    id: 'travel-1',
    title: 'Wanderlust Travel Booking',
    description: 'Aplicativo de viagens abrangente para reserva de voos, hotéis e experiências. Apresenta belas imagens de destinos.',
    category: 'travel',
    images: [
      { url: getImg('Travel booking app ui clean blue beach', 601), caption: 'Explorar', type: 'mockup' },
      { url: getImg('Hotel booking details mobile ui', 602), caption: 'Visualização do Hotel', type: 'screenshot' },
      { url: getImg('Flight search results mobile ui', 603), caption: 'Voos', type: 'screenshot' }
    ],
    stats: { likes: 2150, views: 92000, downloads: 35000, comments: 90 },
    features: ['Fluxo de Reserva', 'Guia de Destino', 'Itinerário', 'Avaliações'],
    tags: ['viagem', 'reserva', 'hotel', 'voo'],
    designElements: ['Paleta de Cores Moderna', 'Tipografia Sans Serif', 'Ícones Minimalistas', 'Espaçamento em Grid de 8pt', 'Cantos Arredondados'],
    author: { name: 'TravelUX', avatar: 'https://ui-avatars.com/api/?name=TX&background=0ea5e9&color=fff', verified: true },
    compatibility: { figma: true, sketch: true, adobeXd: true, framer: true },
    pricing: 'premium',
    price: 39,
    version: '2.2.0',
    lastUpdated: '2024-03-01',
    createdAt: '2023-12-05',
    collections: ['Viagem']
  },
  {
    id: 'travel-2',
    title: 'CityGuide',
    description: 'Aplicativo de exploração local com mapas, eventos e lugares escondidos.',
    category: 'travel',
    images: [
      { url: getImg('City guide app ui map view', 610), caption: 'Mapa', type: 'mockup' },
      { url: getImg('Event list mobile app ui', 611), caption: 'Eventos', type: 'screenshot' }
    ],
    stats: { likes: 400, views: 15000, downloads: 3000, comments: 10 },
    features: ['Mapa Interativo', 'Calendário de Eventos', 'Favoritos', 'Avaliações'],
    tags: ['guia', 'mapa', 'cidade'],
    designElements: ['Paleta de Cores Moderna', 'Tipografia Sans Serif', 'Ícones Minimalistas', 'Espaçamento em Grid de 8pt', 'Cantos Arredondados'],
    author: { name: 'MapMasters', avatar: 'https://ui-avatars.com/api/?name=MM&background=ef4444&color=fff', verified: false },
    compatibility: { figma: true, sketch: false, adobeXd: false, framer: false },
    pricing: 'free',
    version: '1.0.0',
    lastUpdated: '2023-11-01',
    createdAt: '2023-11-01',
    collections: []
  },

  // --- PRODUCTIVITY ---
  {
    id: 'prod-1',
    title: 'TaskMaster - Tarefas & Projetos',
    description: 'Gerenciador de tarefas limpo e eficiente inspirado no Things 3 e Todoist.',
    category: 'productivity',
    images: [
      { url: getImg('Task management app ui minimal white', 701), caption: 'Tarefas', type: 'mockup' },
      { url: getImg('Calendar scheduler mobile ui clean', 702), caption: 'Calendário', type: 'screenshot' }
    ],
    stats: { likes: 1600, views: 64000, downloads: 28000, comments: 75 },
    features: ['Quadro Kanban', 'Visualização de Calendário', 'Lembretes', 'Tags de Projeto'],
    tags: ['produtividade', 'todo', 'minimalista', 'limpo'],
    designElements: ['Paleta de Cores Moderna', 'Tipografia Sans Serif', 'Ícones Minimalistas', 'Espaçamento em Grid de 8pt', 'Cantos Arredondados'],
    author: { name: 'FocusUI', avatar: 'https://ui-avatars.com/api/?name=FU&background=64748b&color=fff', verified: true },
    compatibility: { figma: true, sketch: true, adobeXd: true, framer: false },
    pricing: 'free',
    version: '2.0.0',
    lastUpdated: '2024-02-05',
    createdAt: '2023-08-15',
    collections: ['Produtividade']
  },
  {
    id: 'prod-2',
    title: 'NotePad +',
    description: 'Interface de edição de texto rico e organização para quem faz muitas anotações.',
    category: 'productivity',
    images: [
      { url: getImg('Note taking app ui yellow pencil', 710), caption: 'Notas', type: 'mockup' },
      { url: getImg('Rich text editor mobile ui', 711), caption: 'Editor', type: 'screenshot' }
    ],
    stats: { likes: 900, views: 36000, downloads: 12000, comments: 40 },
    features: ['Texto Rico', 'Pastas', 'Pesquisa', 'Sincronização'],
    tags: ['notas', 'escrita', 'editor'],
    designElements: ['Paleta de Cores Moderna', 'Tipografia Sans Serif', 'Ícones Minimalistas', 'Espaçamento em Grid de 8pt', 'Cantos Arredondados'],
    author: { name: 'ScribeLabs', avatar: 'https://ui-avatars.com/api/?name=SL&background=facc15&color=fff', verified: false },
    compatibility: { figma: true, sketch: false, adobeXd: false, framer: true },
    pricing: 'premium',
    price: 9,
    version: '1.2.0',
    lastUpdated: '2023-12-15',
    createdAt: '2023-10-20',
    collections: []
  },

  // --- OTHERS / RESOURCES ---
  {
    id: 'other-1',
    title: 'iOS 17 UI Kit',
    description: 'Componentes completos do sistema iOS 17, teclados e widgets.',
    category: 'other',
    images: [
      { url: getImg('iOS 17 ui kit components light dark', 801), caption: 'Componentes', type: 'mockup' },
      { url: getImg('iOS keyboard ui kit', 802), caption: 'Teclados', type: 'screenshot' }
    ],
    stats: { likes: 5000, views: 250000, downloads: 100000, comments: 500 },
    features: ['Cores do Sistema', 'Tipografia', 'Controles', 'Barras'],
    tags: ['ios', 'sistema', 'ui kit'],
    designElements: ['Paleta de Cores Moderna', 'Tipografia Sans Serif', 'Ícones Minimalistas', 'Espaçamento em Grid de 8pt', 'Cantos Arredondados'],
    author: { name: 'AppleKit', avatar: 'https://ui-avatars.com/api/?name=AK&background=000000&color=fff', verified: true },
    compatibility: { figma: true, sketch: true, adobeXd: true, framer: true },
    pricing: 'free',
    version: '17.2',
    lastUpdated: '2024-01-01',
    createdAt: '2023-09-20',
    collections: ['Sistema', 'iOS']
  },
  {
    id: 'other-2',
    title: 'iPhone 15 Mockups',
    description: 'Mockups realistas de alta resolução do iPhone 15 Pro em todas as cores.',
    category: 'other',
    images: [
      { url: getImg('iPhone 15 pro mockup presentation', 810), caption: 'Mockups', type: 'mockup' }
    ],
    stats: { likes: 2200, views: 88700, downloads: 54000, comments: 120 },
    features: ['Versão Clay', 'Realista', 'Todas as Cores', 'Alta Resolução'],
    tags: ['mockup', 'dispositivo', 'apresentacao'],
    designElements: ['Paleta de Cores Moderna', 'Tipografia Sans Serif', 'Ícones Minimalistas', 'Espaçamento em Grid de 8pt', 'Cantos Arredondados'],
    author: { name: 'MockupKing', avatar: 'https://ui-avatars.com/api/?name=MK&background=7c3aed&color=fff', verified: true },
    compatibility: { figma: true, sketch: true, adobeXd: true, framer: false },
    pricing: 'freemium',
    version: '1.0.0',
    lastUpdated: '2023-10-01',
    createdAt: '2023-10-01',
    collections: []
  }
];