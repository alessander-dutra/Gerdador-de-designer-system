export interface TemplateImage {
  url: string;
  caption: string;
  type: 'screenshot' | 'mockup' | 'detail';
}

export interface TemplateStats {
  likes: number;
  views: number;
  downloads: number;
  comments: number;
}

export interface Author {
  name: string;
  avatar: string;
  verified: boolean;
}

export interface Compatibility {
  figma: boolean;
  sketch: boolean;
  adobeXd: boolean;
  framer: boolean;
}

export type TemplateCategory = 'fintech' | 'delivery' | 'social' | 'ecommerce' | 'fitness' | 'travel' | 'productivity' | 'other' | 'ai-generated';

export interface Template {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  images: TemplateImage[];
  stats: TemplateStats;
  features: string[];
  tags: string[];
  designElements?: string[];
  author: Author;
  compatibility: Compatibility;
  pricing: 'free' | 'premium' | 'freemium';
  price?: number;
  version: string;
  lastUpdated: string;
  collections: string[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface FilterState {
  categories: TemplateCategory[];
  pricing: 'all' | 'free' | 'premium';
  sortBy: 'popular' | 'recent' | 'downloads' | 'likes';
  tags: string[];
  compatibility: Array<keyof Compatibility>;
  search: string;
}

export type ViewState = 'dashboard' | 'generator' | 'favorites' | 'settings' | 'template-details';

export type AuthState = 'welcome' | 'login' | 'register';