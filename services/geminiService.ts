
import { GoogleGenAI } from "@google/genai";

// Use standard flash model for general IT strategy consultation (basic text task)
export const generateChatResponse = async (history: {role: string, parts: {text: string}[]}[], userMessage: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
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

// Use pro model for complex academic synthesis and reasoning tasks
export const solveUniversityProject = async (
  university: string, 
  faculty: string, 
  topic: string, 
  description: string, 
  subjects: string,
  year: string,
  semester: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Act as an expert Academic Advisor for ${university}, specifically the ${faculty} department. 
    
    STUDENT CONTEXT:
    - Year: ${year}
    - Semester: ${semester}
    
    PROJECT INPUTS:
    - Topic: ${topic}
    - Description: ${description}
    - Relevant Subjects: ${subjects}
    
    Your task is to provide a highly detailed "Project Synthesis Report" following the latest official format of ${university}.
    
    CRITICAL FORMATTING RULES:
    1. ABSOLUTE TOP: The very first line of the output MUST be "# PROJECT TOPIC: ${topic}". Do not put anything before this.
    2. BODY SECTIONS: 
       - ## SOLUTION STRATEGY: A high-level technical approach.
       - ## TECH STACK: Recommended localized and modern technologies (React, Node.js, Python, etc.).
       - ## PROJECT ROADMAP: A 4-phase timeline suitable for a student in their ${semester}.
       - ## DOCUMENTATION OUTLINE: Specific headings (Chapter 1-5).
    3. ABSOLUTE BOTTOM: The very last section MUST be "--- \n ### RELEVANT ACADEMIC SUBJECTS \n ${subjects}".
    4. Mention that Sajilo Project Hub (domestic engineering firm) can help in implementing this prototype.
    
    Format the output in a professional, clean, and structured academic memorandum style.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
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
