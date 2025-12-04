import { GoogleGenAI, Type } from "@google/genai";
import { INDUSTRIES } from '../../constants';

// Inicializa o cliente Gemini
// Assume que a chave está disponível no ambiente
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converte um arquivo File (Browser) para Base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove o prefixo "data:image/png;base64," para enviar apenas os bytes
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
  tags: string[];
  industry: string;
}

/**
 * Envia a imagem para o Gemini e retorna os dados preenchidos
 */
export const analyzeImageWithGemini = async (file: File, categoryContext: string): Promise<AIAnalysisResult | null> => {
  try {
    const base64Data = await fileToBase64(file);
    const mimeType = file.type;

    const prompt = `
      Analise esta imagem de um projeto de design/portfólio.
      O contexto da categoria é: "${categoryContext}".
      
      Atue como um Diretor de Arte e Copywriter Sênior.
      Gere informações profissionais para preencher o portfólio da agência "Matriz Visual".
      
      Regras:
      1. Título: Curto, profissional e impactante (Ex: Identidade Visual [Nome], Web Design [Nome]).
      2. Descrição Curta: Uma frase vendedora de até 150 caracteres.
      3. Descrição Longa: 2 parágrafos detalhando o estilo, cores e o problema resolvido.
      4. Tags: 3 a 5 palavras-chave técnicas (Ex: Branding, UI/UX, Minimalista).
      5. Indústria: Tente encaixar EXATAMENTE em uma dessas opções: ${JSON.stringify(INDUSTRIES)}. Se não encaixar perfeitamente, escolha a mais próxima ou deixe em branco.
      
      Responda APENAS com o JSON.
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
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            longDescription: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            industry: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }
    
    return null;

  } catch (error) {
    console.error("Erro na análise de IA:", error);
    return null;
  }
};