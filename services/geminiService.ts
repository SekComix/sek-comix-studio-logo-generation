import { GoogleGenAI, Type } from "@google/genai";

const getApiKey = (): string => {
  // @ts-ignore
  return import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.API_KEY || "";
};

const handleApiError = (error: any) => {
  console.error("Errore API Gemini:", error);
  if (error.message?.includes("429")) throw new Error("Quota superata. Attendi un minuto.");
  if (error.message?.includes("API_KEY")) throw new Error("Chiave API non valida.");
  throw new Error(error.message || "Errore imprevisto.");
};

export const editImageWithGemini = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1' });
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', 
      contents: [{
        role: 'user',
        parts: [{ inlineData: { data: cleanBase64, mimeType } }, { text: `Modifica l'immagine: ${prompt}` }]
      }]
    });
    // @ts-ignore
    const data = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
    if (data) return `data:image/png;base64,${data}`;
    throw new Error("L'AI ha risposto con testo invece di un'immagine. Motivo: " + response.text);
  } catch (error: any) { return handleApiError(error); }
};

export const generateIconImage = async (prompt: string, brandColor: string): Promise<string> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{
        role: 'user',
        parts: [{
          text: `GENERATE_IMAGE: Crea un'icona app professionale. Soggetto: ${prompt}. Colore: ${brandColor}. Sfondo nero. Stile minimal 2D. Non inserire testo.`
        }]
      }]
    });
    // @ts-ignore
    const data = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
    if (data) return `data:image/png;base64,${data}`;
    
    // Se non c'è l'immagine, mostriamo cosa ha detto l'AI invece di un errore generico
    throw new Error("L'AI non può generare immagini in questo momento. Risposta: " + response.text);
  } catch (error: any) { return handleApiError(error); }
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
    const prompt = `Analisi Brand Identity per: "${description}". Ritorna JSON: { "iconKey": "palette", "colorHex": "#00f260", "subtitle": "LOGO" }. Usa icone standard lucide.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    const cleanText = (response.text || "").replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText) as BrandIdentityResult;
  } catch (error) {
    return { iconKey: 'palette', colorHex: '#00f260', subtitle: 'STUDIO' };
  }
};
