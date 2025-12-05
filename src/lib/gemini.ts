import { GoogleGenAI } from "@google/genai";
import { INDUSTRIES } from '../../constants';
import { ProjectCategory } from '../../types';

// Safely access environment variable with fallback to prevent crash
const getApiKey = () => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_GOOGLE_API_KEY;
    }
  } catch (e) {
    console.warn("Environment variables not accessible");
  }
  // Fallback key provided for development/preview to prevent crash
  return 'AIzaSyAE_X2NljKMegux7iQtiwPGIbXPxfelFUY';
};

const apiKey = getApiKey();

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("VITE_GOOGLE_API_KEY não definida. A funcionalidade de IA ficará indisponível.");
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
    throw new Error("Chave de API não configurada.");
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

    console.log("Iniciando análise com Gemini 2.5 Flash...");

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
          FOCO ESPECÍFICO: Esta imagem é a CAPA (Thumbnail) de um VÍDEO COMERCIAL ou PROPAGANDA.
          - A IA não pode assistir o vídeo, então baseie-se nesta imagem para descrever o ESTILO DA PRODUÇÃO AUDIOVISUAL.
          - Descreva a atmosfera, a qualidade da filmagem/edição sugerida pela capa e o objetivo publicitário.
          - Use termos como "Produção dinâmica", "Comercial impactante", "Vídeo para redes sociais".
          - NÃO descreva a imagem como uma "foto estática", mas como a representação de um vídeo.
        `;
    } else {
        specificInstruction = `
          FOCO ESPECÍFICO: Design Gráfico, Logotipos ou Web Design.
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
        "longDescription": "Dois parágrafos descrevendo o trabalho realizado, seguindo o foco específico da categoria acima.",
        "tags": ["tag1", "tag2", "tag3", "tag4"],
        "industry": "Escolha a melhor opção desta lista: ${JSON.stringify(INDUSTRIES)}"
      }

      Responda APENAS o JSON cru, sem marcação markdown ou blocos de código.
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