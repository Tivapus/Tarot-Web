import { promptTemplates } from '@/TarotPromtpTemplate';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);


async function generateWithRetry(model: any, content: any, maxRetries = 3) {
  let delay = 1000;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await model.generateContent(content);
      return result;
    } catch (error: any) {
      if (error.status === 503 && i < maxRetries - 1) {
        console.log(`Model overloaded. Retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
        delay *= 2;
      } else {
        throw error;
      }
    }
  }
}


export async function POST(req: Request) {
  try {
    const { message, mode } = await req.json();

    if (!mode || !promptTemplates[mode]) {
      return Response.json({ error: 'Invalid mode provided' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const promptHeader = promptTemplates[mode];

    const fullPrompt = `${promptHeader}\n\n${message}`;

    const promptParts = [{ text: fullPrompt }];

    const result = await generateWithRetry(model, {
      contents: [{ role: 'user', parts: promptParts }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    if (!result) {
      throw new Error("Failed to get response from AI after multiple retries.");
    }
    
    const reply = result.response.text();
    return Response.json({ reply }, { status: 200 });

  } catch (error: any) {
    console.error('Gemini API Error:', error);

    const status = error.status || 500;
    return Response.json(
        { error: `An error occurred: ${error.message}` }, 
        { status }
    );
  }
}