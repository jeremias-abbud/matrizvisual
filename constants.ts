import { Project, ProjectCategory, Service } from './types';

// Placeholder data - In the future, this will be fetched from Supabase
export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Identidade Visual CyberTech',
    category: ProjectCategory.DESIGN,
    imageUrl: 'https://picsum.photos/800/600?random=1',
    description: 'Rebranding completo para uma startup de segurança cibernética, focando em tons neon e minimalismo.',
    tags: ['Logo', 'Branding', 'Papelaria'],
    client: 'CyberTech Solutions',
    date: 'Março 2024',
    longDescription: 'Desenvolvemos uma identidade visual completa que transmite segurança, inovação e tecnologia. O projeto incluiu a criação de logotipo, paleta de cores baseada em tons de neon sobre fundo escuro, tipografia personalizada e todo o material de papelaria institucional. O desafio foi criar uma marca que se destacasse em um mercado saturado, utilizando elementos geométricos que remetem a circuitos e proteção de dados.',
    gallery: [
      'https://picsum.photos/800/600?random=101',
      'https://picsum.photos/800/600?random=102',
      'https://picsum.photos/800/600?random=103'
    ]
  },
  {
    id: '2',
    title: 'E-commerce Moda Future',
    category: ProjectCategory.WEB,
    imageUrl: 'https://picsum.photos/800/600?random=2',
    description: 'Plataforma de vendas online de alta performance com design responsivo e checkout otimizado.',
    tags: ['React', 'UX/UI', 'E-commerce'],
    client: 'Future Wear',
    date: 'Janeiro 2024',
    longDescription: 'Um e-commerce robusto e escalável construído com as tecnologias mais recentes do mercado. O foco principal foi a experiência do usuário (UX), garantindo uma navegação fluida em dispositivos móveis e um processo de checkout simplificado para aumentar a taxa de conversão. Integramos sistemas de pagamento, gestão de estoque e um painel administrativo personalizado.',
    gallery: [
      'https://picsum.photos/800/600?random=201',
      'https://picsum.photos/800/600?random=202',
      'https://picsum.photos/800/600?random=203'
    ]
  },
  {
    id: '3',
    title: 'Comercial Energy Drink',
    category: ProjectCategory.VIDEO,
    imageUrl: 'https://picsum.photos/800/600?random=3',
    description: 'Produção de vídeo publicitário com efeitos visuais 3D e edição dinâmica para redes sociais.',
    tags: ['VFX', 'Edição', '3D'],
    client: 'Bolt Energy',
    date: 'Fevereiro 2024',
    longDescription: 'Produção completa de um comercial de 30 segundos para lançamento de uma nova bebida energética. Utilizamos modelagem 3D para as latas, simulação de fluidos para o líquido e uma edição ritmada que acompanha a trilha sonora. O resultado foi um vídeo de alto impacto visual utilizado em campanhas de Instagram e YouTube Ads.',
    gallery: [
      'https://picsum.photos/800/600?random=301',
      'https://picsum.photos/800/600?random=302',
      'https://picsum.photos/800/600?random=303'
    ]
  },
  {
    id: '4',
    title: 'App Landing Page',
    category: ProjectCategory.WEB,
    imageUrl: 'https://picsum.photos/800/600?random=4',
    description: 'Página de aterrissagem para lançamento de aplicativo financeiro, focada em conversão.',
    tags: ['Landing Page', 'SEO', 'Mobile First'],
    client: 'FinApp',
    date: 'Abril 2024',
    longDescription: 'Landing page otimizada para alta conversão (CRO). O design limpo e moderno guia o usuário através das funcionalidades do aplicativo, culminando em call-to-actions estratégicos. Implementamos animações suaves ao rolar a página (scroll animations) para manter o engajamento do visitante.',
    gallery: [
      'https://picsum.photos/800/600?random=401',
      'https://picsum.photos/800/600?random=402',
      'https://picsum.photos/800/600?random=403'
    ]
  },
  {
    id: '5',
    title: 'Social Media Pack Gamer',
    category: ProjectCategory.DESIGN,
    imageUrl: 'https://picsum.photos/800/600?random=5',
    description: 'Pacote de artes para redes sociais focado no público gamer e streamers.',
    tags: ['Social Media', 'Photoshop', 'Illustrator'],
    client: 'Streamer X',
    date: 'Dezembro 2023',
    longDescription: 'Desenvolvimento de uma identidade visual coesa para as redes sociais de um grande influenciador gamer. O pacote incluiu templates editáveis para stories, capas para YouTube, overlays para Twitch e posts para feed do Instagram. O estilo visual abusa de glitch art, tipografia bold e cores vibrantes.',
    gallery: [
      'https://picsum.photos/800/600?random=501',
      'https://picsum.photos/800/600?random=502',
      'https://picsum.photos/800/600?random=503'
    ]
  },
  {
    id: '6',
    title: 'Motion Graphics Intro',
    category: ProjectCategory.VIDEO,
    imageUrl: 'https://picsum.photos/800/600?random=6',
    description: 'Intro animada para canal de tecnologia no YouTube.',
    tags: ['After Effects', 'Motion', 'Animation'],
    client: 'Tech Review',
    date: 'Maio 2024',
    longDescription: 'Animação de logotipo e vinheta de introdução para um canal de tecnologia. O briefing pedia algo futurista e rápido. Utilizamos After Effects para criar animações de formas geométricas complexas e transições suaves que revelam a marca de forma impactante em menos de 5 segundos.',
    gallery: [
      'https://picsum.photos/800/600?random=601',
      'https://picsum.photos/800/600?random=602',
      'https://picsum.photos/800/600?random=603'
    ]
  }
];

export const SERVICES: Service[] = [
  {
    id: 's1',
    title: 'Design Gráfico',
    description: 'Criação de logotipos, identidades visuais marcantes e materiais publicitários que comunicam a essência da sua marca.',
    iconName: 'Palette'
  },
  {
    id: 's2',
    title: 'Desenvolvimento Web',
    description: 'Sites modernos, rápidos e responsivos. Do institucional ao e-commerce, criamos sua presença digital.',
    iconName: 'Monitor'
  },
  {
    id: 's3',
    title: 'Edição de Vídeo',
    description: 'Produção audiovisual, motion graphics e edição profissional para comerciais, YouTube e redes sociais.',
    iconName: 'Video'
  },
  {
    id: 's4',
    title: 'Marketing Visual',
    description: 'Estratégias visuais para alavancar suas campanhas e aumentar o engajamento do seu público.',
    iconName: 'Rocket'
  }
];

// Placeholder for Logos section
export const LOGOS = [
  { id: 'l1', name: 'Alpha', url: 'https://picsum.photos/200/200?random=1001' },
  { id: 'l2', name: 'Beta Corp', url: 'https://picsum.photos/200/200?random=1002' },
  { id: 'l3', name: 'Gamma Sys', url: 'https://picsum.photos/200/200?random=1003' },
  { id: 'l4', name: 'Delta Force', url: 'https://picsum.photos/200/200?random=1004' },
  { id: 'l5', name: 'Epsilon Energy', url: 'https://picsum.photos/200/200?random=1005' },
  { id: 'l6', name: 'Zeta Labs', url: 'https://picsum.photos/200/200?random=1006' },
  { id: 'l7', name: 'Omega Watch', url: 'https://picsum.photos/200/200?random=1007' },
  { id: 'l8', name: 'Theta Finance', url: 'https://picsum.photos/200/200?random=1008' },
];

export const FEATURED_WEB_PROJECTS = [
  {
    id: 'w1',
    title: 'Neon Nexus Dashboard',
    description: 'Painel administrativo SaaS com visualização de dados em tempo real e tema escuro nativo.',
    imageUrl: 'https://picsum.photos/1200/800?random=901',
    tech: ['React', 'TypeScript', 'D3.js', 'Tailwind'],
    liveUrl: '#'
  },
  {
    id: 'w2',
    title: 'Aurora E-commerce',
    description: 'Loja virtual de luxo com animações 3D de produtos e checkout em um clique.',
    imageUrl: 'https://picsum.photos/1200/800?random=902',
    tech: ['Next.js', 'Stripe', 'Three.js', 'Supabase'],
    liveUrl: '#'
  },
  {
    id: 'w3',
    title: 'Zenith Portfolio',
    description: 'Site institucional para escritório de arquitetura com galeria imersiva.',
    imageUrl: 'https://picsum.photos/1200/800?random=903',
    tech: ['Vue.js', 'GSAP', 'CMS', 'Sass'],
    liveUrl: '#'
  }
];