import { GoogleGenAI, Type } from "@google/genai";

// Initialize the client strictly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key mancante. Assicurati che process.env.API_KEY sia configurato.");
  }

  try {
    // Clean base64 string if it contains the data URL prefix
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("Nessuna immagine generata trovata nella risposta.");

  } catch (error: any) {
    console.error("Errore durante la generazione:", error);
    throw new Error(error.message || "Si è verificato un errore durante l'editing dell'immagine.");
  }
};

// Interface for Brand Identity Response
export interface BrandIdentityResult {
  iconKey: string;
  colorHex: string;
  subtitle: string;
}

export const generateBrandIdentity = async (description: string): Promise<BrandIdentityResult> => {
  if (!process.env.API_KEY) throw new Error("API Key mancante.");

  try {
    const prompt = `
      Sei un esperto di Brand Identity per un creatore di app chiamato "Sek + Comix".
      L'utente sta creando una nuova app specifica e ha fornito questa descrizione: "${description}".
      
      Devi scegliere l'icona più adatta tra questa lista limitata (keys):
      ['palette', 'utensils', 'camera', 'heart', 'code', 'music', 'dumbbell', 'briefcase', 'plane', 'gamepad', 'shopping-cart', 'book', 'car', 'home', 'leaf'].
      
      Se nessuna si adatta perfettamente, usa 'palette'.
      
      Devi anche scegliere un colore HEX "Neon" adatto (es. verde fluo, ciano, fucsia, arancione acceso).
      
      Devi generare un breve SOTTOTITOLO in maiuscolo (max 15 caratteri) che descriva la categoria (es. "RICETTE", "WEDDING", "TRAVEL", "GAMING").

      Rispondi ESCLUSIVAMENTE con un oggetto JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            iconKey: { type: Type.STRING },
            colorHex: { type: Type.STRING },
            subtitle: { type: Type.STRING }
          },
          required: ["iconKey", "colorHex", "subtitle"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Risposta vuota dall'AI");

    return JSON.parse(text) as BrandIdentityResult;

  } catch (error) {
    console.error("Errore generazione brand:", error);
    // Fallback default
    return {
      iconKey: 'palette',
      colorHex: '#00f260',
      subtitle: 'STUDIO'
    };
  }
};
