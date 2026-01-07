import { GoogleGenAI, Type } from "@google/genai";

/**
 * RECUPERO CHIAVE SICURO PER VITE
 */
const getApiKey = (): string => {
  // @ts-ignore
  return import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.API_KEY || "";
};

/**
 * Gestore centralizzato degli errori API
 */
const handleApiError = (error: any) => {
  console.error("Errore API Gemini:", error);
  
  if (error.message?.includes("429") || error.status === 429) {
    throw new Error("Quota superata: Google ha limitato le richieste. Attendi un minuto e riprova.");
  }
  
  if (error.message?.includes("API_KEY") || error.status === 403 || error.message?.includes("missing")) {
    throw new Error("Chiave API non valida o non configurata nei Secrets di GitHub.");
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
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1' });

  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', // Modello stabile 2026
      contents: [{
        role: 'user',
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: `Modifica questa immagine seguendo questo stile: ${prompt}`,
          },
        ],
      }],
      config: { temperature: 0.7 }
    });

    // @ts-ignore
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (parts) {
      for (const part of parts) {
        if (part.inlineData?.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("Nessuna immagine generata. Assicurati che il tuo account abbia i permessi per Imagen 3.");

  } catch (error: any) {
    return handleApiError(error);
  }
};

/**
 * Genera un'icona personalizzata utilizzando il colore del brand scelto dall'utente.
 */
export const generateIconImage = async (prompt: string, brandColor: string): Promise<string> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1' });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', // Modello stabile 2026
      contents: [{
        role: 'user',
        parts: [
          {
            text: `Genera l'immagine di un'icona app professionale, stile vettoriale minimalista. 
                   Soggetto: ${prompt}. 
                   Colore primario: ${brandColor}. 
                   Sfondo: Nero solido (#000000). 
                   Stile: Design 2D pulito, senza testo.`
          }
        ]
      }],
      config: { temperature: 0.7 }
    });

    // @ts-ignore
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData?.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("Il modello non ha restituito un'immagine. Prova con un prompt più semplice.");
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
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1' });

  try {
    // Chiediamo il JSON nel prompt per evitare l'errore 400
    const prompt = `
      Expert Brand Identity analysis.
      User app description: "${description}".
      Icon options: ['palette', 'utensils', 'camera', 'heart', 'code', 'music', 'dumbbell', 'briefcase', 'plane', 'gamepad', 'shopping-cart', 'book', 'car', 'home', 'leaf'].
      Ritorna SOLO un oggetto JSON con: iconKey, colorHex (stile neon) e subtitle (max 15 char).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', // Modello stabile 2026
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { temperature: 0.7 }
    });

    // Pulizia markdown se presente
    const cleanText = (response.text || "").replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText) as BrandIdentityResult;
  } catch (error) {
    console.error("Errore generazione Brand Identity:", error);
    return { iconKey: 'palette', colorHex: '#00f260', subtitle: 'STUDIO' };
  }
};
