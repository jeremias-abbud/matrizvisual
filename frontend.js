// This function calls the Netlify Function securely.
// The API Key is NOT required here, preventing exposure in the browser.

async function sendPromptToGemini(userPrompt) {
  try {
    const response = await fetch('/.netlify/functions/gemini-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: userPrompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Use the returned text
    console.log("Gemini Response:", data.text);
    return data.text;

  } catch (error) {
    console.error("Failed to fetch response:", error);
    return "Error processing request.";
  }
}

// Example Usage:
// sendPromptToGemini("Write a poem about coding.");