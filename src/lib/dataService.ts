import { supabase } from './supabase';
import { Project, ProjectCategory } from '../../types';
import { PROJECTS as MOCK_PROJECTS } from '../../constants';

// Cache em memória
let projectsCache: Project[] | null = null;
let logosCache: Project[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutos de cache

// Função auxiliar para formatar dados do Supabase para o tipo Project
const formatProject = (item: any): Project => ({
  id: item.id,
  title: item.title,
  category: item.category as ProjectCategory,
  industry: item.industry,
  imageUrl: item.image_url,
  description: item.description,
  tags: item.tags || [],
  client: item.client,
  date: item.date,
  longDescription: item.long_description,
  gallery: item.gallery,
  videoUrl: item.video_url,
  createdAt: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
  // @ts-ignore - Propriedade interna para ordenação
  display_order: item.display_order
});

/**
 * Busca TODOS os projetos (Tabela 'projects')
 * Usa cache se disponível e recente.
 */
export const getAllProjects = async (): Promise<Project[]> => {
  const now = Date.now();
  if (projectsCache && (now - lastFetchTime < CACHE_DURATION)) {
    return projectsCache;
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (data) {
      projectsCache = data.map(formatProject);
      lastFetchTime = now;
      return projectsCache;
    }
  } catch (err) {
    console.error('DataService: Erro ao buscar projetos', err);
  }

  return MOCK_PROJECTS;
};

/**
 * Busca TODOS os logotipos (Mescla Tabela 'projects' categoria LOGO + Tabela 'logos' antiga)
 * Usa cache se disponível.
 */
export const getAllLogos = async (): Promise<Project[]> => {
  if (logosCache && (Date.now() - lastFetchTime < CACHE_DURATION)) {
    return logosCache;
  }

  try {
    // 1. Busca Logotipos Novos (da tabela projects)
    const allProjects = await getAllProjects(); // Reutiliza a busca principal
    const newLogos = allProjects.filter(p => p.category === ProjectCategory.LOGO);

    // 2. Busca Logotipos Antigos (da tabela logos)
    // Precisamos buscar diretamente pois a tabela é diferente
    const { data: oldLogosData, error: oldLogosError } = await supabase
        .from('logos')
        .select('id, name, url, industry, display_order, created_at');

    if (oldLogosError) throw oldLogosError;

    const formattedOldLogos = (oldLogosData || []).map((item: any) => ({
        id: `logo_${item.id}`,
        title: item.name,
        imageUrl: item.url,
        industry: item.industry,
        category: ProjectCategory.LOGO,
        description: 'Projeto de design de logotipo e identidade visual.',
        tags: ['Logotipo', 'Branding'],
        client: item.name,
        gallery: [],
        createdAt: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
        // @ts-ignore
        display_order: item.display_order,
        isLegacy: true
    })) as Project[];

    // 3. Mescla e Ordena
    const combinedLogos = [...newLogos, ...formattedOldLogos];

    combinedLogos.sort((a: any, b: any) => {
         const orderA = a.display_order ?? -Infinity; // Nulls vão para o topo (novos)
         const orderB = b.display_order ?? -Infinity;
         
         // Se ambos tem ordem, respeita a ordem numérica
         if (orderA !== -Infinity && orderB !== -Infinity) {
             return orderA - orderB;
         }
         // Se um tem ordem e o outro não (é novo), o novo ganha (fica no topo) se a lógica for "Novos primeiro"
         // Mas aqui queremos respeitar a ordem manual.
         
         // Lógica Ajustada: 
         // Se display_order existe, usa ele.
         // Se não existe (null), assume que é muito recente (topo) ou muito antigo?
         // No LogoManager, definimos novos logos como (min - 1), então eles já tem display_order negativo.
         // Projetos do 'ProjectManager' podem ter display_order NULL. Vamos tratar NULL como "Topo" (-Infinity).
         
         if (orderA !== orderB) {
             return orderA - orderB;
         }
         
         // Desempate por data (mais recente primeiro)
         return (b.createdAt || 0) - (a.createdAt || 0);
    });

    logosCache = combinedLogos;
    return logosCache;

  } catch (err) {
    console.error('DataService: Erro ao buscar logotipos', err);
    return [];
  }
};

/**
 * Limpa o cache (Útil para forçar recarregamento após uma ação admin, se necessário)
 */
export const clearCache = () => {
    projectsCache = null;
    logosCache = null;
    lastFetchTime = 0;
};