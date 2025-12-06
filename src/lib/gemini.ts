import { GoogleGenAI } from "@google/genai";
import { INDUSTRIES } from '../../constants';
import { ProjectCategory } from '../../types';

// Função segura para obter a API Key.
// Usa try-catch para evitar erros se import.meta.env não estiver definido.
const getApiKey = (): string => {
  const fallbackKey = 'AIzaSyCKbD4qUptSR3JM8uIsh_-XpGNLhVQPyHw';
  
  try {
    // @ts-ignore: Ignora verificação estrita de tipos para import.meta
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_GOOGLE_API_KEY;
    }
  } catch (error) {
    // Silencia erros de acesso ao ambiente e segue para o fallback
  }
  
  return fallbackKey;
};

const apiKey = getApiKey();
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.error("ERRO CRÍTICO: Chave da API Gemini não encontrada.");
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
    throw new Error("Chave de API não configurada. Verifique o arquivo .env ou a configuração de fallback.");
  }

  try {
    let base64Data = '';
    let mimeType = '';

    console.log("Iniciando processamento da imagem...");

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

    console.log("Enviando para Gemini 2.5 Flash...");

    // Definição de contexto específico baseado na categoria
    let specificInstruction = "";
    
    if (categoryContext === ProjectCategory.MODELS || categoryContext.includes('Modelos') || categoryContext.includes('Personagens')) {
        specificInstruction = `
          CONTEXTO: Esta imagem é de um PERSONAGEM 3D, IA ou AVATAR VIRTUAL.
          - Descreva o realismo, o estilo artístico (cyberpunk, cartoon, realista), a iluminação e os detalhes da modelagem.
          - Deixe claro que é um trabalho de criação de personagem virtual.
        `;
    } else if (categoryContext === ProjectCategory.VIDEO || categoryContext.includes('Vídeo')) {
        specificInstruction = `
          CONTEXTO: Esta imagem é a CAPA de um VÍDEO (Edição, Motion Graphics).
          - O serviço é a PRODUÇÃO DO VÍDEO, não apenas a arte da capa.
          - Use termos como "Edição dinâmica", "Motion Graphics", "Produção Audiovisual".
          - Descreva a atmosfera e o estilo do vídeo baseando-se na capa.
          - Mantenha a descrição simples e direta (ideal para Reels/Shorts).
        `;
    } else if (categoryContext === ProjectCategory.WEB || categoryContext.includes('Site') || categoryContext.includes('Web')) {
        specificInstruction = `
          CONTEXTO: Esta imagem é de um WEBSITE (Desenvolvimento + Design).
          - O serviço inclui a PROGRAMAÇÃO e CONSTRUÇÃO do site.
          - Use termos como "Site Responsivo", "Desenvolvimento Web", "Alta Performance".
          - Descreva a estrutura, as cores e a usabilidade visível na imagem.
        `;
    } else {
        specificInstruction = `
          CONTEXTO: Design Gráfico / Identidade Visual.
          - Descreva as cores, tipografia e o impacto visual da peça.
        `;
    }

    const prompt = `
      Atue como um Diretor Criativo da agência "Matriz Visual".
      Analise esta imagem. Categoria do projeto: "${categoryContext}".
      
      ${specificInstruction}
      
      Retorne APENAS um JSON válido com esta estrutura exata:
      {
        "title": "Um título comercial curto (ex: Identidade Visual [Marca])",
        "client": "Nome da marca/cliente identificado na imagem (ou um nome fictício realista se não houver)",
        "description": "Frase curta de impacto (max 150 chars) focada no resultado.",
        "longDescription": "Um parágrafo (max 3 linhas) descrevendo tecnicamente o trabalho realizado e o estilo.",
        "tags": ["tag1", "tag2", "tag3", "tag4"],
        "industry": "Escolha a melhor opção desta lista: ${JSON.stringify(INDUSTRIES)}"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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

    console.log("Resposta da IA:", response.text);

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }
    
    return null;

  } catch (error: any) {
    console.error("Erro na análise de IA:", error);
    throw new Error(error.message || "Falha na comunicação com a IA");
  }
};