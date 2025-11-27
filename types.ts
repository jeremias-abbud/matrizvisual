export enum ProjectCategory {
  ALL = 'Todos',
  LOGO = 'Logotipos',
  DESIGN = 'Design Gráfico',
  WEB = 'Web Sites',
  VIDEO = 'Vídeos & Motion'
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  imageUrl: string;
  description: string;
  tags: string[];
  // Detailed view fields
  longDescription?: string;
  gallery?: string[];
  client?: string;
  date?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: 'Palette' | 'Monitor' | 'Video' | 'Rocket';
}