export type Language = 'zh' | 'en';
export type Theme = 'light' | 'dark';

export interface PortfolioItem {
  title: string;
  description: string;
  link?: string;
  date?: string;
}

export interface CategoryContent {
  id: string;
  title: {
    zh: string;
    en: string;
  };
  icon: string;
  items: PortfolioItem[];
}

export interface SiteContent {
  name: {
    zh: string;
    en: string;
  };
  bio: {
    zh: string;
    en: string;
  };
  categories: CategoryContent[];
}
