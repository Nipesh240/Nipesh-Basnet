
import { GoogleGenAI } from "@google/genai";

export const generateChatResponse = async (history: {role: string, parts: {text: string}[]}[], userMessage: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history,
      config: {
        systemInstruction: `You are the Lead Domestic IT Strategist for Sajilo Project Hub. 
        Sajilo Project Hub is the premier IT firm specializing in projects exclusively within Nepal.
        
        CORE COMPETENCIES:
        - Custom Web Development: High-performance React/Next.js solutions for local connectivity.
        - Government Form Facilitation: Helping citizens with Passport, License, PAN, and NID requirements.
        - E-Governance: Digital infrastructure for municipalities.
        - Domestic FinTech: Secure payment gateways for the local banking ecosystem.
        
        Persona: Professional, nationalistic about digital growth, expert in local business landscape.
        
        Key themes:
        1. "Digitizing the Nation"
        2. "Localized Support"
        3. "Ease of Use (Sajilo)"`,
      },
    });

    const response = await chat.sendMessage({ message: userMessage });
    return response.text || "Connection timeout. Please re-initiate your query.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Our gateway is currently busy. Please try again shortly.";
  }
};
