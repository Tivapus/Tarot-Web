import { promptTemplates } from '@/TarotPromtpTemplate';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message,mode } = await req.json();

    if (!message) {
      return Response.json({ error: 'No message provided' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const selectedMode = mode; 
    const promptHeader = promptTemplates[selectedMode];

    const promptParts = [
      {
        text: `${promptHeader}`,
      },
      { text: message },
    ];

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: promptParts }],
    });

    const reply = result.response.text() ?? 'ขออภัย ไม่สามารถตอบได้';
    return Response.json({ reply }, { status: 200 });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
