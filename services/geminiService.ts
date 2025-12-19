
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Gestore centralizzato degli errori API
 */
const handleApiError = (error: any) => {
  console.error("Errore API Gemini:", error);
  
  if (error.message?.includes("429") || error.status === 429) {
    throw new Error("Quota superata: Google ha limitato le richieste. Attendi un minuto e riprova.");
  }
  
  if (error.message?.includes("API_KEY") || error.status === 403) {
    throw new Error("Chiave API non valida o non configurata correttamente nei Secrets di GitHub.");
  }

  throw new Error(error.message || "Si è verificato un errore imprevisto durante la generazione.");
};

/**
 * Modifica un'immagine esistente basandosi su un prompt testuale.
 */
export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
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
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

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
    return handleApiError(error);
  }
};

/**
 * Genera un'icona personalizzata utilizzando il colore del brand scelto dall'utente.
 */
export const generateIconImage = async (prompt: string, brandColor: string): Promise<string> => {
  if (!process.env.API_KEY || process.env.API_KEY === 'undefined' || process.env.API_KEY === '') {
    throw new Error("Chiave API mancante. Configura 'API_KEY' nei Secrets di GitHub.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Professional app icon, minimalist and clean. 
                   Subject: ${prompt}. 
                   Primary Color: ${brandColor}. 
                   Background: PURE BLACK (#000000). 
                   Style: Flat vector with elegant neon glow, centered, 2D style.`
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("Impossibile generare l'icona.");
  } catch (error: any) {
    return handleApiError(error);
  }
};

export interface BrandIdentityResult {
  iconKey: string;
  colorHex: string;
  subtitle: string;
}

export const generateBrandIdentity = async (description: string): Promise<BrandIdentityResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `
      Expert Brand Identity analysis.
      User app description: "${description}".
      Icon options: ['palette', 'utensils', 'camera', 'heart', 'code', 'music', 'dumbbell', 'briefcase', 'plane', 'gamepad', 'shopping-cart', 'book', 'car', 'home', 'leaf'].
      Return JSON with iconKey, colorHex (neon style) and subtitle (max 15 char).
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
          required: ["iconKey", "colorHex", "subtitle"]
        }
      }
    });

    return JSON.parse(response.text) as BrandIdentityResult;
  } catch (error) {
    console.error("Errore generazione Brand Identity:", error);
    return { iconKey: 'palette', colorHex: '#00f260', subtitle: 'STUDIO' };
  }
};
