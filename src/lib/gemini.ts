import { GoogleGenAI } from "@google/genai";
import { INDUSTRIES } from '../../constants';

// Safely access environment variable with fallback to prevent crash
// If import.meta.env is undefined, it uses the hardcoded key as backup
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
 * Converte um arquivo File (Browser) para Base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};

export interface AIAnalysisResult {
  title: string;
  description: string;
  longDescription: string;
  client: string;
  tags: string[];
  industry: string;
}

/**
 * Envia a imagem para o Gemini e retorna os dados preenchidos
 */
export const analyzeImageWithGemini = async (file: File, categoryContext: string): Promise<AIAnalysisResult | null> => {
  if (!ai) {
    throw new Error("Chave de API não configurada.");
  }

  try {
    const base64Data = await fileToBase64(file);
    const mimeType = file.type;

    console.log("Iniciando análise com Gemini 2.5 Flash...");

    const prompt = `
      Você é um Diretor de Arte Sênior da agência "Matriz Visual".
      Analise a imagem anexada. O contexto da categoria é: "${categoryContext}".
      
      Gere um JSON estrito com as seguintes chaves:
      {
        "title": "Um título curto e comercial para o projeto",
        "client": "O nome da marca, empresa ou cliente identificado na imagem (se não houver texto, crie um nome fictício plausível)",
        "description": "Uma frase curta e vendedora (max 150 caracteres)",
        "longDescription": "Dois parágrafos descrevendo o estilo visual, cores, tipografia e benefícios do design",
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