
import { GoogleGenAI } from "@google/genai";

export const generateChatResponse = async (history: {role: string, parts: {text: string}[]}[], userMessage: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      history: history,
      config: {
        systemInstruction: `You are the Lead Domestic IT Strategist for Sajilo Project Hub. 
        Sajilo Project Hub is the premier IT firm specializing in projects exclusively within Nepal.
        
        CORE COMPETENCIES:
        - Custom Web Development: High-performance React/Next.js solutions for local connectivity.
        - University Project Node: End-to-end guidance and development support for Final Year Projects, Research Papers, and Engineering Prototypes (IOE, KU, TU curriculum).
        - Government Form Facilitation: Helping citizens with Passport, License, PAN, and NID requirements.
        - E-Governance: Digital infrastructure for municipalities.
        - Domestic FinTech: Secure payment gateways for the local banking ecosystem.
        
        Persona: Professional, academic, nationalistic about digital growth, expert in local business and education landscape.
        
        Key themes:
        1. "Digitizing the Nation"
        2. "Localized Support"
        3. "Ease of Use (Sajilo)"
        4. "Academic Excellence"`,
      },
    });

    const response = await chat.sendMessage({ message: userMessage });
    
    if (!response || !response.text) {
      throw new Error("Empty response from AI gateway");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const solveUniversityProject = async (university: string, faculty: string, description: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    const prompt = `Act as an expert Academic Advisor for ${university}, specifically the ${faculty} department. 
    A student is working on the following project: "${description}".
    
    Your task is to provide a highly detailed "Project Synthesis Report" following the latest official format of ${university}.
    
    The response must include:
    1. SOLUTION STRATEGY: A high-level technical approach to the problem.
    2. TECH STACK: Recommended localized and modern technologies (e.g., React, Node.js, Python, etc.) suitable for a Nepali student project.
    3. PROJECT ROADMAP: A 4-phase timeline (Proposal, Design, Development, Testing/Reporting).
    4. DOCUMENTATION OUTLINE: Specific headings and sub-headings required for the Final Report according to ${university}'s standard (e.g., Chapter 1: Introduction, Chapter 2: Literature Review, etc.).
    5. LOGISTICS: Mention that Sajilo Project Hub can help in implementing this prototype.
    
    Format the output in a professional, clean, and structured manner. Use clear headings.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    if (!response || !response.text) {
      throw new Error("AI Synthesis Failed");
    }

    return response.text;
  } catch (error) {
    console.error("Academic Synthesis Error:", error);
    throw error;
  }
};
