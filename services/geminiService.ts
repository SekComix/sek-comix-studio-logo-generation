
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Modifica un'immagine esistente basandosi su un prompt testuale.
 */
export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  // Always create a new instance right before making an API call to ensure it always uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
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

    // Iterate through all parts to find the image part, do not assume it is the first part.
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

/**
 * Genera un'icona personalizzata da zero partendo da un prompt.
 */
export const generateIconImage = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Crea un'icona logo quadrata, stile minimalista, professionale, alta qualità, sfondo trasparente o nero pieno: ${prompt}`
          }
        ]
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      // Find the image part as per guidelines.
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("Impossibile generare l'icona.");
  } catch (error: any) {
    throw new Error(error.message || "Errore generazione icona AI.");
  }
};

export interface BrandIdentityResult {
  iconKey: string;
  colorHex: string;
  subtitle: string;
}

/**
 * Genera una Brand Identity basata sulla descrizione dell'app fornita dall'utente.
 */
export const generateBrandIdentity = async (description: string): Promise<BrandIdentityResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `
      Sei un esperto di Brand Identity per un creatore di app chiamato "Sek + Comix".
      L'utente sta creando una nuova app specifica e ha fornito questa descrizione: "${description}".
      
      Devi scegliere l'icona più adatta tra questa lista limitata (keys):
      ['palette', 'utensils', 'camera', 'heart', 'code', 'music', 'dumbbell', 'briefcase', 'plane', 'gamepad', 'shopping-cart', 'book', 'car', 'home', 'leaf'].
      
      Se nessuna si adatta perfettamente, usa 'palette'.
      Devi anche scegliere un colore HEX "Neon" adatto.
      Devi generare un breve SOTTOTITOLO in maiuscolo (max 15 caratteri).
      Rispondi ESCLUSIVAMENTE con un oggetto JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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
          required: ["iconKey", "colorHex", "subtitle"],
          propertyOrdering: ["iconKey", "colorHex", "subtitle"]
        }
      }
    });

    // The GenerateContentResponse features a text property (not a method).
    const text = response.text;
    if (!text) throw new Error("Risposta vuota dall'AI");
    return JSON.parse(text) as BrandIdentityResult;
  } catch (error) {
    console.error("Errore generazione Brand Identity:", error);
    return { iconKey: 'palette', colorHex: '#00f260', subtitle: 'STUDIO' };
  }
};
