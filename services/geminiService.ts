import { GoogleGenAI } from "@google/genai";

const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const EDIT_PRESETS: Record<string, string> = {
  'Minimalist': 'flat minimalist vector style, clean lines, professional branding',
  'Neon': 'neon cyberpunk style, vibrant glowing colors, dark background, high contrast',
  'Retro': 'vintage retro 80s aesthetic, synthwave color palette, VHS effect',
  'Sketch': 'hand-drawn pencil sketch, artistic lines, monochrome, paper texture',
  '3D Render': '3D octane render, high detail, volumetric lighting, clay-like texture'
};

export const editImageWithGemini = async (base64Image: string, mimeType: string, prompt: string, stylePreset?: string): Promise<string> => {
  const ai = getAiClient();
  const cleanBase64 = base64Image.split(',')[1] || base64Image;
  const finalPrompt = `TASK: ${prompt}. ${stylePreset || ""} KEEP SUBJECT. OUTPUT: IMAGE ONLY. NO TEXT.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: cleanBase64, mimeType } },
          { text: finalPrompt }
        ]
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("Immagine non generata correttamente.");
  } catch (error: any) {
    throw new Error("Errore AI: " + error.message);
  }
};

export const generateIconImage = async (prompt: string, brandColor: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const aiPrompt = `Flat vector logo icon of ${prompt}, minimal style, white background, color ${brandColor}. No text. High resolution.`;
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: aiPrompt }] }
    });

    if (result.candidates?.[0]?.content?.parts) {
      for (const part of result.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("Generazione fallita.");
  } catch (error) { 
    throw new Error("Errore generazione icona AI."); 
  }
};

export const analyzeUploadedLogo = async (base64Image: string, mimeType: string): Promise<any> => {
  const ai = getAiClient();
  const cleanBase64 = base64Image.split(',')[1] || base64Image;
  const prompt = `Analisi logo: text1, text2, subtitle, color. Solo JSON.`;
  try {
    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: cleanBase64, mimeType } }, { text: prompt }] },
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(result.text || "{}");
  } catch (e) { return {}; }
};

export const generateBrandIdentity = async (description: string): Promise<any> => {
  const ai = getAiClient();
  try {
    const prompt = `Brand identity for: "${description}". JSON: {iconKey, colorHex, subtitle}.`;
    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: prompt }] },
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(result.text || "{}");
  } catch (error) { return { iconKey: 'palette', colorHex: '#00f260', subtitle: 'STUDIO' }; }
};

