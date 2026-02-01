
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getLabAdvice(query: string, currentStatus: any) {
  const ai = getAI();
  const prompt = `
    You are an AI assistant for MVSK Computer Lab Booking System.
    The student is asking: "${query}"
    Current room availability: ${JSON.stringify(currentStatus)}
    
    Rules for response:
    - Be helpful and polite.
    - Recommend the best room based on room features if they have a specific task (e.g., coding, graphics, research).
    - If rooms are full, suggest waiting or checking later.
    - Keep responses concise and in Thai or English as requested.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "ขออภัยครับ ระบบ AI ขัดข้องชั่วคราว สามารถติดต่อเจ้าหน้าที่ห้องคอมได้โดยตรงครับ";
  }
}
