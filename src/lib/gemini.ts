import { GoogleGenAI } from "@google/genai";
import { INDUSTRIES } from '../../constants';
import { ProjectCategory } from '../../types';

// Safely access environment variable to prevent crashes
// We use a fallback logic: Check if import.meta.env exists before accessing the key
const apiKey = (import.meta && import.meta.env && import.meta.env.VITE_GOOGLE_API_KEY) 
  ? import.meta.env.VITE_GOOGLE_API_KEY 
  : 'AIzaSyCKbD4qUptSR3JM8uIsh_-XpGNLhVQPyHw'; // Fallback to provided key if env fails in this environment

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("⚠️ API Key do Google não encontrada. Certifique-se de ter o arquivo .env configurado com VITE_GOOGLE_API_KEY.");
}

/**
 * Converte um arquivo File ou Blob para Base64 string
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Baixa uma imagem da URL e converte para Base64
 */
const urlToBase64 = async (url: string): Promise<{ data: string, mimeType: string }> => {
    try {
        // Adiciona timestamp para evitar cache
        const response = await fetch(`${url}?t=${Date.now()}`);
        if (!response.ok) throw new Error(`Falha ao baixar imagem: ${response.statusText}`);
        const blob = await response.blob();
        const data = await blobToBase64(blob);
        return { data, mimeType: blob.type };
    } catch (error) {
        console.error("Erro ao converter URL para base64:", error);
        throw error;
    }
}

export interface AIAnalysisResult {
  title: string;
  description: string;
  longDescription: string;
  client: string;
  tags: string[];
  industry: string;
}

/**
 * Envia a imagem (File ou URL) para o Gemini e retorna os dados preenchidos
 */
export const analyzeImageWithGemini = async (imageSource: File | string, categoryContext: string): Promise<AIAnalysisResult | null> => {
  if (!ai) {
    throw new Error("Chave de API não configurada ou inválida.");
  }

  try {
    let base64Data = '';
    let mimeType = '';

    console.log("Preparando imagem para análise...");

    if (imageSource instanceof File) {
        base64Data = await blobToBase64(imageSource);
        mimeType = imageSource.type;
    } else if (typeof imageSource === 'string') {
        const result = await urlToBase64(imageSource);
        base64Data = result.data;
        mimeType = result.mimeType;
    } else {
        throw new Error("Fonte de imagem inválida.");
    }

    console.log("Iniciando análise com Gemini 1.5 Flash...");

    // Definição de contexto específico baseado na categoria
    let specificInstruction = "";
    
    if (categoryContext === ProjectCategory.MODELS || categoryContext.includes('Modelos')) {
        specificInstruction = `
          FOCO ESPECÍFICO: Esta imagem é de um MODELO 3D, PERSONAGEM IA ou AVATAR.
          - Descreva a qualidade da renderização, o estilo artístico (realista, cartoon, cyberpunk, etc.), a iluminação e os detalhes do personagem.
          - Deixe claro que é um trabalho de criação de personagem/modelo virtual.
          - NÃO descreva como "panfleto" ou "design gráfico", trate como uma "peça de arte digital/modelagem".
        `;
    } else if (categoryContext === ProjectCategory.VIDEO || categoryContext.includes('Vídeo')) {
        specificInstruction = `
          FOCO ESPECÍFICO: Esta imagem é a CAPA de um PROJETO DE VÍDEO COMPLETO (Edição, Motion, Produção).
          - IMPORTANTE: O serviço realizado foi a CRIAÇÃO DO VÍDEO em si (Edição, Motion Graphics, Efeitos), não apenas o design da capa estática.
          - Ao descrever, use termos como "Produção audiovisual", "Edição dinâmica", "Vídeo de alto impacto", "Motion graphics".
          - Como você só está vendo a capa (imagem estática), mantenha a descrição focada no ESTILO VISUAL, na ATMOSFERA e no OBJETIVO do vídeo (vendas, branding, reels), sem inventar cenas específicas que você não pode ver.
          - A descrição deve ser simples e direta, ideal para vídeos curtos de redes sociais.
        `;
    } else if (categoryContext === ProjectCategory.WEB || categoryContext.includes('Site') || categoryContext.includes('Web')) {
        specificInstruction = `
          FOCO ESPECÍFICO: Esta imagem é de um PROJETO DE WEBSITE COMPLETO (Desenvolvimento + Design).
          - IMPORTANTE: Considere que o trabalho envolveu a CONSTRUÇÃO e PROGRAMAÇÃO do site, não apenas o design visual.
          - Use termos como "Site desenvolvido", "Página construída", "Solução web completa", "Site responsivo".
          - Como você está analisando apenas a imagem da capa, mantenha a descrição SIMPLES e realista. Não invente funcionalidades complexas que não são visíveis.
          - Foque na estrutura visual, na organização do conteúdo e na aparência profissional.
          - A 'longDescription' deve ser curta e direta (máximo 3 frases), destacando a entrega de um site funcional e moderno.
        `;
    } else {
        specificInstruction = `
          FOCO ESPECÍFICO: Design Gráfico ou Logotipos.
          - Descreva o estilo visual, paleta de cores, tipografia e como esse design ajuda a marca do cliente.
        `;
    }

    const prompt = `
      Você é um Diretor de Arte Sênior da agência "Matriz Visual".
      Analise a imagem anexada. O contexto da categoria é: "${categoryContext}".
      
      ${specificInstruction}
      
      Gere um JSON estrito com as seguintes chaves:
      {
        "title": "Um título curto e comercial para o projeto",
        "client": "O nome da marca, empresa ou cliente identificado na imagem (se não houver texto, crie um nome fictício plausível)",
        "description": "Uma frase curta e vendedora (max 150 caracteres) focada no benefício do trabalho.",
        "longDescription": "Um parágrafo curto descrevendo o trabalho realizado, seguindo o foco específico da categoria acima.",
        "tags": ["tag1", "tag2", "tag3", "tag4"],
        "industry": "Escolha a melhor opção desta lista: ${JSON.stringify(INDUSTRIES)}"
      }

      Responda APENAS o JSON cru, sem marcação markdown ou blocos de código.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
      }
    });

    console.log("Resposta da IA recebida:", response.text);

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }
    
    return null;

  } catch (error: any) {
    console.error("Erro detalhado na análise de IA:", error);
    throw new Error(error.message || "Falha na comunicação com a IA");
  }
};