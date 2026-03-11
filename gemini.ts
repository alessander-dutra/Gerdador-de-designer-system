import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Template } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTemplateIdea = async (prompt: string, imageBase64?: string, mimeType: string = 'image/jpeg'): Promise<Partial<Template>> => {
  if (!apiKey) throw new Error("API Key missing");

  try {
    // Always use gemini-3-flash-preview for text/JSON generation.
    const model = 'gemini-3-flash-preview';
    
    const parts: any[] = [];
    
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: imageBase64
        }
      });
    }

    parts.push({
      text: `Você é um Product Designer Sênior e Especialista em UI/UX. Gere uma especificação completa de um UI Kit em Português do Brasil (pt-BR) baseada neste pedido${imageBase64 ? ' e na imagem de referência anexa' : ''}: "${prompt}".
      
      REQUISITOS ESTRITOS DE CONTEÚDO:
      1. Todo o texto (título, descrição, tags, funcionalidades, elementos de design) DEVE estar em Português do Brasil.
      2. Garanta o uso correto de acentuação e caracteres UTF-8 (ex: ção, ões, é, à).
      3. A "description" deve ser sofisticada, profissional e detalhada, focando na experiência do usuário.
      4. No array "features", inclua funcionalidades técnicas e de UX.
      5. O tom de voz deve ser "Premium", "Minimalista" e "Profissional".
      6. No array "designElements", forneça EXATAMENTE 5 diretrizes visuais específicas (ex: "Paleta: Azul Royal e Dourado", "Fonte: Inter com pesos variados", "Textura: Glassmorphism sutil", "Estilo de Ícones: Outline fino", "Layout: Espaçamento generoso").
      
      Retorne APENAS um JSON válido seguindo este schema exato, sem markdown.`
    });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            features: { type: Type.ARRAY, items: { type: Type.STRING } },
            designElements: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    let text = response.text;
    if (!text) throw new Error("No text returned from Gemini");
    
    // Cleanup markdown if present to prevent JSON parse errors
    if (text.startsWith('```')) {
        text = text.replace(/^```(json)?\n/, '').replace(/```$/, '');
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
};

export const generateTemplateImage = async (
  prompt: string, 
  screenContext: string = "presentation grid", 
  referenceImageBase64?: string, 
  mimeType: string = 'image/jpeg',
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "4:3",
  style: string = "Modern, clean, and professional UI/UX (Dribbble/Behance style)"
): Promise<string> => {
  // Enhanced prompt to strictly request Portuguese text and high fidelity
  const fullPrompt = `High Fidelity Mobile App UI Design.
  Screen Context: ${screenContext}.
  App Concept: ${prompt}.
  
  Design Requirements:
  - ${style}.
  - High resolution and sharp details.
  - Consistent color palette and typography.
  
  TEXT REQUIREMENTS (CRITICAL):
  - All visible text (headers, buttons, labels, menus) MUST be in Portuguese (Português do Brasil).
  - Ensure correct spelling (e.g., 'Início' instead of 'Home', 'Entrar' instead of 'Login', 'Carrinho' instead of 'Cart').
  - Avoid gibberish or blurred text.
  `;

  if (!apiKey) {
     console.warn("No API Key found, using fallback image generator.");
     const encodedPrompt = encodeURIComponent(fullPrompt);
     const width = aspectRatio === "16:9" ? 1024 : aspectRatio === "9:16" ? 576 : aspectRatio === "1:1" ? 1024 : 1024;
     const height = aspectRatio === "16:9" ? 576 : aspectRatio === "9:16" ? 1024 : aspectRatio === "1:1" ? 1024 : 768;
     return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${Math.floor(Math.random() * 10000)}`;
  }

  try {
    const parts: any[] = [];

    if (referenceImageBase64) {
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: referenceImageBase64
        }
      });
      parts.push({ text: `Create a high fidelity mobile app design based on this reference image, but adapted for: ${fullPrompt}` });
    } else {
      parts.push({ text: fullPrompt });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio
        }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    // Check if model returned text refusal/explanation instead of image
    const textPart = response.candidates?.[0]?.content?.parts?.find((p: any) => p.text);
    if (textPart) {
      console.warn("Gemini returned text instead of image (likely refusal):", textPart.text);
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    // Log as warning since we have a fallback, preventing console noise
    console.warn("Gemini Image Gen failed or refused, falling back to Pollinations:", error);
    
    // Fallback on error
    const encodedPrompt = encodeURIComponent(fullPrompt);
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=768&nologo=true&seed=${Math.floor(Math.random() * 10000)}`;
  }
};