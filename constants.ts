import { Project, ProjectCategory, Service } from './types';

// Placeholder data - In the future, this will be fetched from Supabase
export const PROJECTS: Project[] = [
  // --- Projetos Iniciais (1-6) ---
  {
    id: '1',
    title: 'Marca CyberTech',
    category: ProjectCategory.DESIGN,
    imageUrl: 'https://picsum.photos/800/600?random=1',
    description: 'Criação de identidade visual moderna para empresa de tecnologia, transmitindo inovação.',
    tags: ['Logo', 'Cartão de Visita', 'Cores'],
    client: 'CyberTech Solutions',
    date: 'Março 2024',
    longDescription: 'Criamos uma marca forte que passa segurança e tecnologia. O projeto incluiu o logotipo, escolha das cores ideais e materiais de escritório como cartões e envelopes. O objetivo foi destacar a empresa no mercado competitivo.',
    gallery: [
      'https://picsum.photos/800/600?random=101',
      'https://picsum.photos/800/600?random=102',
      'https://picsum.photos/800/600?random=103'
    ]
  },
  {
    id: '2',
    title: 'Loja Future Wear',
    category: ProjectCategory.WEB,
    imageUrl: 'https://picsum.photos/800/600?random=2',
    description: 'Loja virtual completa, fácil de navegar e comprar pelo celular.',
    tags: ['Site de Vendas', 'Celular', 'Pagamentos'],
    client: 'Future Wear',
    date: 'Janeiro 2024',
    longDescription: 'Uma loja virtual feita para vender. O foco foi facilitar a compra para o cliente, funcionando perfeitamente em celulares. Já vem integrada com formas de pagamento e controle de estoque simples.',
    gallery: [
      'https://picsum.photos/800/600?random=201',
      'https://picsum.photos/800/600?random=202',
      'https://picsum.photos/800/600?random=203'
    ]
  },
  {
    id: '3',
    title: 'Comercial Bolt Energy',
    category: ProjectCategory.VIDEO,
    imageUrl: 'https://picsum.photos/800/600?random=3',
    description: 'Vídeo dinâmico para lançamento de produto no Instagram e TikTok.',
    tags: ['Vídeo Comercial', 'Redes Sociais', 'Edição'],
    client: 'Bolt Energy',
    date: 'Fevereiro 2024',
    longDescription: 'Produção de um vídeo curto e impactante para prender a atenção nas redes sociais. Usamos edição rápida e efeitos visuais para destacar o produto e gerar desejo de compra.',
    gallery: [
      'https://picsum.photos/800/600?random=301',
      'https://picsum.photos/800/600?random=302',
      'https://picsum.photos/800/600?random=303'
    ]
  },
  {
    id: '4',
    title: 'Site Institucional FinApp',
    category: ProjectCategory.WEB,
    imageUrl: 'https://picsum.photos/800/600?random=4',
    description: 'Página de apresentação profissional para aplicativo financeiro.',
    tags: ['Site Institucional', 'Google', 'Conversão'],
    client: 'FinApp',
    date: 'Abril 2024',
    longDescription: 'Uma página focada em explicar o produto e convencer o visitante a baixar o aplicativo. Design limpo, textos persuasivos e carregamento rápido.',
    gallery: [
      'https://picsum.photos/800/600?random=401',
      'https://picsum.photos/800/600?random=402',
      'https://picsum.photos/800/600?random=403'
    ]
  },
  {
    id: '5',
    title: 'Pacote Redes Sociais',
    category: ProjectCategory.DESIGN,
    imageUrl: 'https://picsum.photos/800/600?random=5',
    description: 'Criação de identidade visual padronizada para Instagram e YouTube.',
    tags: ['Instagram', 'YouTube', 'Posts'],
    client: 'Streamer X',
    date: 'Dezembro 2023',
    longDescription: 'Deixamos as redes sociais do cliente com uma cara profissional. Criamos modelos de posts, capas para vídeos e stories que seguem a mesma identidade visual.',
    gallery: [
      'https://picsum.photos/800/600?random=501',
      'https://picsum.photos/800/600?random=502',
      'https://picsum.photos/800/600?random=503'
    ]
  },
  {
    id: '6',
    title: 'Vinheta Animada',
    category: ProjectCategory.VIDEO,
    imageUrl: 'https://picsum.photos/800/600?random=6',
    description: 'Animação de logotipo para abertura de vídeos no YouTube.',
    tags: ['Animação', 'Intro', 'Logo Animado'],
    client: 'Tech Review',
    date: 'Maio 2024',
    longDescription: 'Demos vida ao logotipo da empresa. Uma animação curta de 5 segundos para usar na abertura de todos os vídeos, criando uma assinatura visual marcante.',
    gallery: [
      'https://picsum.photos/800/600?random=601',
      'https://picsum.photos/800/600?random=602',
      'https://picsum.photos/800/600?random=603'
    ]
  },

  // --- Novos Projetos Fictícios (7-20) ---
  {
    id: '7',
    title: 'Café Aroma Gourmet',
    category: ProjectCategory.DESIGN,
    imageUrl: 'https://picsum.photos/800/600?random=7',
    description: 'Rebranding completo para cafeteria artesanal, incluindo cardápios e embalagens.',
    tags: ['Embalagem', 'Identidade Visual', 'Impresso'],
    client: 'Café Aroma',
    date: 'Junho 2024',
    longDescription: 'Trouxemos o cheiro do café para o visual. Cores quentes, tipografia clássica e um logotipo que funciona tanto na fachada quanto nos copos.',
    gallery: ['https://picsum.photos/800/600?random=701', 'https://picsum.photos/800/600?random=702']
  },
  {
    id: '8',
    title: 'App Delivery Rápido',
    category: ProjectCategory.WEB,
    imageUrl: 'https://picsum.photos/800/600?random=8',
    description: 'Landing page de alta conversão para lançamento de aplicativo de entregas.',
    tags: ['Landing Page', 'App', 'Mobile First'],
    client: 'Flash Delivery',
    date: 'Julho 2024',
    longDescription: 'Uma página única focada em fazer o usuário baixar o app. Botões grandes, vídeo demonstrativo e carregamento instantâneo.',
    gallery: ['https://picsum.photos/800/600?random=801', 'https://picsum.photos/800/600?random=802']
  },
  {
    id: '9',
    title: 'Videoclipe Banda Neon',
    category: ProjectCategory.VIDEO,
    imageUrl: 'https://picsum.photos/800/600?random=9',
    description: 'Edição e efeitos visuais para clipe musical com estética Cyberpunk.',
    tags: ['VFX', 'Videoclipe', 'Edição Colorida'],
    client: 'Banda Neon',
    date: 'Agosto 2024',
    longDescription: 'Um trabalho artístico de pós-produção. Adicionamos neons, brilhos e transições ritmadas para casar perfeitamente com a batida da música.',
    gallery: ['https://picsum.photos/800/600?random=901', 'https://picsum.photos/800/600?random=902']
  },
  {
    id: '10',
    title: 'Advocacia Silva & Santos',
    category: ProjectCategory.DESIGN,
    imageUrl: 'https://picsum.photos/800/600?random=10',
    description: 'Identidade sóbria e elegante para escritório de advocacia tradicional.',
    tags: ['Corporativo', 'Papelaria', 'Logo'],
    client: 'Silva & Santos',
    date: 'Setembro 2023',
    longDescription: 'O desafio foi modernizar sem perder a seriedade. Usamos azul marinho e dourado para transmitir confiança e experiência.',
    gallery: ['https://picsum.photos/800/600?random=1001', 'https://picsum.photos/800/600?random=1002']
  },
  {
    id: '11',
    title: 'Portal Notícias Locais',
    category: ProjectCategory.WEB,
    imageUrl: 'https://picsum.photos/800/600?random=11',
    description: 'Site de notícias com sistema de gestão de conteúdo fácil de atualizar.',
    tags: ['Blog', 'CMS', 'Notícias'],
    client: 'Jornal da Cidade',
    date: 'Outubro 2023',
    longDescription: 'Desenvolvemos um portal onde os próprios jornalistas podem postar as notícias facilmente. Layout organizado para leitura.',
    gallery: ['https://picsum.photos/800/600?random=1101', 'https://picsum.photos/800/600?random=1102']
  },
  {
    id: '12',
    title: 'Stories Promocionais',
    category: ProjectCategory.VIDEO,
    imageUrl: 'https://picsum.photos/800/600?random=12',
    description: 'Pacote de 10 vídeos animados verticais para promoção de Black Friday.',
    tags: ['Stories', 'Varejo', 'Animação'],
    client: 'Mega Loja',
    date: 'Novembro 2023',
    longDescription: 'Animações rápidas de 15 segundos focadas em ofertas. Texto grande, preços piscando e chamadas para ação claras.',
    gallery: ['https://picsum.photos/800/600?random=1201', 'https://picsum.photos/800/600?random=1202']
  },
  {
    id: '13',
    title: 'Barbearia Viking',
    category: ProjectCategory.DESIGN,
    imageUrl: 'https://picsum.photos/800/600?random=13',
    description: 'Identidade visual rústica e masculina para rede de barbearias.',
    tags: ['Logo', 'Fachada', 'Instagram'],
    client: 'Viking Barber',
    date: 'Janeiro 2024',
    longDescription: 'Exploramos texturas de madeira e metal. O logo funciona muito bem bordado em uniformes e aplicado na fachada da loja.',
    gallery: ['https://picsum.photos/800/600?random=1301', 'https://picsum.photos/800/600?random=1302']
  },
  {
    id: '14',
    title: 'Dashboard Financeiro',
    category: ProjectCategory.WEB,
    imageUrl: 'https://picsum.photos/800/600?random=14',
    description: 'Interface de usuário para sistema de controle financeiro empresarial.',
    tags: ['UI/UX', 'Sistema', 'Dashboard'],
    client: 'ContaCerta',
    date: 'Fevereiro 2024',
    longDescription: 'Focamos na usabilidade. Gráficos claros, cores que indicam status (verde/vermelho) e navegação intuitiva para o usuário.',
    gallery: ['https://picsum.photos/800/600?random=1401', 'https://picsum.photos/800/600?random=1402']
  },
  {
    id: '15',
    title: 'Vlog de Viagem - Intro',
    category: ProjectCategory.VIDEO,
    imageUrl: 'https://picsum.photos/800/600?random=15',
    description: 'Abertura cinematográfica para canal de viagens no YouTube.',
    tags: ['YouTube', 'Cinematográfico', 'Intro'],
    client: 'Mundo Afora',
    date: 'Março 2024',
    longDescription: 'Misturamos imagens de drone com tipografia animada sobrepondo paisagens. Uma introdução que inspira aventura.',
    gallery: ['https://picsum.photos/800/600?random=1501', 'https://picsum.photos/800/600?random=1502']
  },
  {
    id: '16',
    title: 'Clínica Sorriso',
    category: ProjectCategory.WEB,
    imageUrl: 'https://picsum.photos/800/600?random=16',
    description: 'Site institucional com agendamento online integrado.',
    tags: ['Saúde', 'Agendamento', 'Site'],
    client: 'Dra. Ana Souza',
    date: 'Abril 2024',
    longDescription: 'Um site limpo, branco e azul, transmitindo higiene e cuidado. O diferencial é o botão de WhatsApp flutuante e formulário de pré-agendamento.',
    gallery: ['https://picsum.photos/800/600?random=1601', 'https://picsum.photos/800/600?random=1602']
  },
  {
    id: '17',
    title: 'Burger King da Esquina',
    category: ProjectCategory.DESIGN,
    imageUrl: 'https://picsum.photos/800/600?random=17',
    description: 'Cardápio digital e impresso para hamburgueria artesanal.',
    tags: ['Cardápio', 'Food', 'Impresso'],
    client: 'Burger King da Esquina',
    date: 'Maio 2024',
    longDescription: 'Fotos apetitosas dos lanches com descrições curtas. O design facilita a leitura e induz o cliente a pedir combos.',
    gallery: ['https://picsum.photos/800/600?random=1701', 'https://picsum.photos/800/600?random=1702']
  },
  {
    id: '18',
    title: 'Imobiliária Drone Tour',
    category: ProjectCategory.VIDEO,
    imageUrl: 'https://picsum.photos/800/600?random=18',
    description: 'Vídeo tour de imóvel de luxo com imagens aéreas e internas.',
    tags: ['Imobiliário', 'Drone', 'Tour Virtual'],
    client: 'Lux Imóveis',
    date: 'Junho 2024',
    longDescription: 'Um vídeo elegante para vender mansões. Trilha sonora clássica, cortes suaves e correção de cor para valorizar a iluminação da casa.',
    gallery: ['https://picsum.photos/800/600?random=1801', 'https://picsum.photos/800/600?random=1802']
  },
  {
    id: '19',
    title: 'PetShop Amigo Fiel',
    category: ProjectCategory.WEB,
    imageUrl: 'https://picsum.photos/800/600?random=19',
    description: 'E-commerce de produtos pets com blog de dicas.',
    tags: ['Pet', 'Loja Virtual', 'Blog'],
    client: 'Amigo Fiel',
    date: 'Julho 2024',
    longDescription: 'Um site divertido e colorido. Categorias bem definidas (Cães, Gatos, Aves) para facilitar a busca do dono do pet.',
    gallery: ['https://picsum.photos/800/600?random=1901', 'https://picsum.photos/800/600?random=1902']
  },
  {
    id: '20',
    title: 'Tech Solutions Rebrand',
    category: ProjectCategory.DESIGN,
    imageUrl: 'https://picsum.photos/800/600?random=20',
    description: 'Modernização de marca para consultoria de TI.',
    tags: ['Rebranding', 'B2B', 'Tech'],
    client: 'Tech Solutions',
    date: 'Agosto 2024',
    longDescription: 'Removemos elementos antigos e simplificamos o logo para funcionar melhor em telas digitais e ícones de app.',
    gallery: ['https://picsum.photos/800/600?random=2001', 'https://picsum.photos/800/600?random=2002']
  }
];

export const SERVICES: Service[] = [
  {
    id: 's1',
    title: 'Logos e Marcas',
    description: 'Sua empresa precisa passar confiança. Criamos logotipos profissionais que destacam você da concorrência.',
    iconName: 'Palette'
  },
  {
    id: 's2',
    title: 'Criação de Sites',
    description: 'Tenha um site bonito que funciona no celular e no computador. Seu negócio aberto 24 horas por dia.',
    iconName: 'Monitor'
  },
  {
    id: 's3',
    title: 'Vídeos que Vendem',
    description: 'Vídeos curtos e chamativos para Reels, TikTok e anúncios. A melhor forma de mostrar seus produtos hoje.',
    iconName: 'Video'
  },
  {
    id: 's4',
    title: 'Artes para Redes',
    description: 'Pacotes de artes para deixar seu Instagram profissional e organizado, atraindo mais seguidores.',
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
  { id: 'l9', name: 'Iota Invest', url: 'https://picsum.photos/200/200?random=1009' },
  { id: 'l10', name: 'Kappa Kitchen', url: 'https://picsum.photos/200/200?random=1010' },
  { id: 'l11', name: 'Lambda Logistics', url: 'https://picsum.photos/200/200?random=1011' },
  { id: 'l12', name: 'Mu Media', url: 'https://picsum.photos/200/200?random=1012' },
  { id: 'l13', name: 'Nu Network', url: 'https://picsum.photos/200/200?random=1013' },
  { id: 'l14', name: 'Xi Xtreme', url: 'https://picsum.photos/200/200?random=1014' },
  { id: 'l15', name: 'Omicron Ops', url: 'https://picsum.photos/200/200?random=1015' },
  { id: 'l16', name: 'Pi Productions', url: 'https://picsum.photos/200/200?random=1016' },
  { id: 'l17', name: 'Rho Racing', url: 'https://picsum.photos/200/200?random=1017' },
  { id: 'l18', name: 'Sigma Security', url: 'https://picsum.photos/200/200?random=1018' },
];

export const FEATURED_WEB_PROJECTS = [
  {
    id: 'w1',
    title: 'Painel Administrativo',
    description: 'Sistema para gerenciar vendas e dados da empresa de forma fácil.',
    imageUrl: 'https://picsum.photos/1200/800?random=901',
    tech: ['Gestão', 'Dados', 'Rápido'],
    liveUrl: '#'
  },
  {
    id: 'w2',
    title: 'Loja de Roupas Online',
    description: 'E-commerce moderno com fotos grandes e compra em 1 clique.',
    imageUrl: 'https://picsum.photos/1200/800?random=902',
    tech: ['Loja Virtual', 'Pagamento', 'Seguro'],
    liveUrl: '#'
  },
  {
    id: 'w3',
    title: 'Site de Arquitetura',
    description: 'Site institucional elegante para mostrar portfólio de obras.',
    imageUrl: 'https://picsum.photos/1200/800?random=903',
    tech: ['Portfólio', 'Galeria', 'Contato'],
    liveUrl: '#'
  }
];