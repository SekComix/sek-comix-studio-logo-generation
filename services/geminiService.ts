import { GoogleGenAI, Type } from "@google/genai";

const getApiKey = (): string => {
  // @ts-ignore
  return import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.API_KEY || "";
};

const handleApiError = (error: any) => {
  console.error("Errore API Gemini:", error);
  if (error.message?.includes("429")) throw new Error("Quota superata. Riprova tra un minuto.");
  if (error.message?.includes("API_KEY")) throw new Error("Chiave API non valida.");
  throw new Error(error.message || "Errore imprevisto.");
};

/**
 * Genera un'icona/logo in formato SVG (Metodo infallibile per evitare blocchi)
 */
export const generateIconImage = async (prompt: string, brandColor: string): Promise<string> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1' });

  try {
    const aiPrompt = `Sei un grafico esperto in icone minimaliste. 
    Crea il codice SVG per un'icona app professionale.
    SOGGETTO: ${prompt}
    COLORE PRINCIPALE: ${brandColor}
    STILE: Minimalista, moderno, vettoriale, centrato.
    SFONDO: Nero solido.
    REQUISITO TECNICO: Restituisci SOLO il codice <svg>...</svg> senza commenti o spiegazioni.`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: aiPrompt }] }],
      config: { temperature: 0.5 }
    });

    const svgCode = (result.text || "").replace(/```xml|```html|```svg|```/g, "").trim();

    if (svgCode.includes("<svg")) {
      // Trasformiamo il codice SVG in un'immagine leggibile dal browser
      const base64Svg = btoa(unescape(encodeURIComponent(svgCode)));
      return `data:image/svg+xml;base64,${base64Svg}`;
    }

    throw new Error("L'AI non ha generato un codice grafico valido. Riprova.");

  } catch (error: any) {
    return handleApiError(error);
  }
};

/**
 * Analisi della Brand Identity (JSON)
 */
export const generateBrandIdentity = async (description: string): Promise<BrandIdentityResult> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1' });

  try {
    const prompt = `Analizza questa descrizione: "${description}". 
    Ritorna un JSON con: iconKey (un nome di icona Lucide), colorHex (colore neon), subtitle (max 15 caratteri).
    Esempio: {"iconKey": "camera", "colorHex": "#00f260", "subtitle": "PHOTO STUDIO"}`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { temperature: 0.7 }
    });

    const cleanJson = (result.text || "").replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Errore identità:", error);
    return { iconKey: 'palette', colorHex: '#00f260', subtitle: 'STUDIO' };
  }
};

export interface BrandIdentityResult {
  iconKey: string;
  colorHex: string;
  subtitle: string;
}

// Funzione vuota di backup per non rompere il resto dell'app
export const editImageWithGemini = async (b: string, m: string, p: string): Promise<string> => {
  throw new Error("La modifica immagini non è ancora supportata nella versione stabile.");
};
