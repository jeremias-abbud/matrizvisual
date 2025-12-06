import { INDUSTRIES } from '../../constants';
import { ProjectCategory } from '../../types';

// ==============================================================================
// ARQUITETURA SERVERLESS (NETLIFY FUNCTIONS)
// Este arquivo NÃO contém chaves de API. Ele delega o processamento para o backend.
// ==============================================================================

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
 * Envia a imagem para a Netlify Function (Serverless)
 */
export const analyzeImageWithGemini = async (imageSource: File | string, categoryContext: string): Promise<AIAnalysisResult | null> => {
  try {
    let base64Data = '';
    let mimeType = '';

    console.log("[Client] Preparando imagem para envio seguro...");

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

    const promptText = `
      Atue como um Diretor Criativo da agência "Matriz Visual".
      Analise esta imagem. Categoria do projeto: "${categoryContext}".
      
      ${specificInstruction}
      
      Gere um JSON estrito com as seguintes chaves:
      {
        "title": "Um título comercial curto (ex: Identidade Visual [Marca])",
        "client": "Nome da marca/cliente identificado na imagem (ou um nome fictício realista se não houver)",
        "description": "Frase curta de impacto (max 150 chars) focada no resultado.",
        "longDescription": "Um parágrafo (max 3 linhas) descrevendo tecnicamente o trabalho realizado e o estilo.",
        "tags": ["tag1", "tag2", "tag3", "tag4"],
        "industry": "Escolha a melhor opção desta lista: ${JSON.stringify(INDUSTRIES)}"
      }
    `;

    console.log("[Client] Enviando requisição para Netlify Function (.netlify/functions/gemini-query)...");

    // CHAMADA PARA O BACKEND SEGURO
    const response = await fetch('/.netlify/functions/gemini-query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [
                    { inlineData: { mimeType, data: base64Data } },
                    { text: promptText }
                ]
            }]
        })
    });

    if (!response.ok) {
        let errorMsg = `Erro do servidor: ${response.status}`;
        try {
            const errorData = await response.json();
            if (errorData.error) errorMsg = errorData.error;
        } catch (e) {}
        throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log("[Client] Resposta recebida do servidor.");

    if (data && data.text) {
        // O backend retorna o texto JSON puro, precisamos fazer o parse aqui
        try {
            // Limpeza básica caso a IA coloque blocos de markdown ```json ... ```
            const cleanJson = data.text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanJson) as AIAnalysisResult;
        } catch (e) {
            console.error("Erro ao fazer parse do JSON retornado pela IA", e);
            throw new Error("A IA retornou um formato inválido.");
        }
    }
    
    return null;

  } catch (error: any) {
    console.error("Erro na análise via Serverless:", error);
    throw new Error(error.message || "Falha na comunicação com o servidor.");
  }
};