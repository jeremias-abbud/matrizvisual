

export enum ProjectCategory {
  ALL = 'Todos',
  LOGO = 'Logotipos',
  DESIGN = 'Design Gráfico',
  WEB = 'Web Sites',
  VIDEO = 'Vídeos' // Simplificado de 'Vídeos & Motion' para padronização
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  industry?: string; // Novo campo opcional para Ramo de Negócio
  imageUrl: string;
  description: string;
  tags: string[];
  // Detailed view fields
  longDescription?: string;
  gallery?: string[];
  client?: string;
  date?: string;
  videoUrl?: string; // YouTube/Vimeo/MP4 URL
  isFeatured?: boolean; // Novo campo para Destaques
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: 'Palette' | 'Monitor' | 'Video' | 'Rocket';
}