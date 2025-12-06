const { GoogleGenAI } = require("@google/genai");

exports.handler = async (event, context) => {
  // Configuração de CORS para permitir chamadas do próprio domínio
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  // Trata requisições OPTIONS (Pre-flight do navegador)
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Apenas aceita POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    // Faz o parse do corpo da requisição enviado pelo frontend
    const body = JSON.parse(event.body);
    const { contents } = body;

    if (!contents) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "No content provided in request body" }),
      };
    }

    // Inicializa a IA com a chave segura do ambiente do Netlify
    // A variável GEMINI_API_KEY deve estar configurada no painel do Netlify
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
       console.error("Missing GEMINI_API_KEY environment variable");
       return {
         statusCode: 500,
         headers,
         body: JSON.stringify({ error: "Server configuration error: Missing API Key" })
       };
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    // Chama o modelo
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        responseMimeType: "application/json",
      }
    });

    // Retorna o resultado para o frontend
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text: response.text }),
    };

  } catch (error) {
    console.error("Gemini Function Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Internal Server Error" }),
    };
  }
};