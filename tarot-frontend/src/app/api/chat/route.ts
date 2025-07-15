import { NextResponse } from 'next/server';
import { promptTemplates } from '@/TarotPromtpTemplate';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

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

function createInitialContextMessage(result: any): string {
  if (!result) {
    return "[ข้อมูลบริบทเริ่มต้น: ไม่มีข้อมูลผลการทำนายก่อนหน้า]";
  }
  if (result.cards && result.summary) {
    const cardNames = result.cards.map((c: any) => c.card_name).join(', ');
    let stockMessage = "ไม่มีการแนะนำสินทรัพย์";
    if (result.stock_recommendation && Array.isArray(result.stock_recommendation.stocks) && result.stock_recommendation.stocks.length > 0) {
      const stockList = result.stock_recommendation.stocks
        .map((s: any) => s.stock)
        .join(', ');
      stockMessage = `มีการแนะนำสินทรัพย์ได้แก่ ${stockList}`;
    }
    return `[ข้อมูลบริบทเริ่มต้น: ผู้ใช้ได้ดูดวงแบบ Daily Life ได้ไพ่ ${cardNames}, มีบทสรุปว่า "${result.summary}", และ${stockMessage}]`;
  }
  if (result.card && result.question) {
    return `[ข้อมูลบริบทเริ่มต้น: ผู้ใช้ถามคำถาม "${result.question}" และได้ไพ่ ${result.card.card_name} ซึ่งคำตอบคือ "${result.card.answer}"]`;
  }
  return "[ข้อมูลบริบทเริ่มต้น: มีผลการทำนายก่อนหน้า แต่ไม่สามารถระบุประเภทได้]";
}

export async function POST(req: Request) {
  try {
    const { message, mode, history, initialResult } = await req.json();

    if (!mode && (!history || history.length === 0)) {
      return NextResponse.json({ error: 'Invalid request, mode or history is required' }, { status: 400 });
    }
    
    if (history && history.length > 0 && !message) {
      return NextResponse.json({ error: 'No message provided for conversation' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      safetySettings,
    });
    
    let contents;
    let generationConfig = {};

    if (history && history.length > 0) {
      const chatPrompt = promptTemplates['real_chat_ai']; 
      const contextMessage = createInitialContextMessage(initialResult); 
      contents = [
        { role: 'user', parts: [{ text: chatPrompt }] },
        { role: 'model', parts: [{ text: "รับทราบค่ะ ดิฉัน 'มาดามเจมินี่' พร้อมให้คำปรึกษาเกี่ยวกับผลการทำนายแล้วค่ะ มีอะไรสงสัยถามได้เลย" }] },
        { role: 'user', parts: [{ text: contextMessage }] },
        { role: 'model', parts: [{ text: "ค่ะ ดิฉันเข้าใจบริบทของผลการทำนายก่อนหน้านี้แล้ว มีอะไรให้ช่วยอธิบายเพิ่มเติมไหมคะ?" }]},
        ...history.map((msg: { role: 'user' | 'model'; content: string }) => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        })),
        { role: 'user', parts: [{ text: message }] }
      ];
    } else {
      if (!mode || !promptTemplates[mode]) {
        return NextResponse.json({ error: 'Invalid mode provided for initial prediction' }, { status: 400 });
      }
      if (!message) {
        return NextResponse.json({ error: 'No message provided for initial prediction' }, { status: 400 });
      }
      const promptHeader = promptTemplates[mode];
            const fullPrompt = `
        ${promptHeader}

        ---
        คำถามของผู้ใช้คือ: "${message}"
        ---
      `;
      contents = [{ role: 'user', parts: [{ text: fullPrompt }] }];
      generationConfig = {
        responseMimeType: "application/json",
      };
    }

    const result = await generateWithRetry(model, { contents, generationConfig });

    if (!result) {
      throw new Error("Failed to get response from AI after multiple retries.");
    }

    const reply = result.response.text();
    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('Gemini API Error in POST route:', error);
    const status = error.status || 500;
    return NextResponse.json(
        { error: `An error occurred: ${error.message || 'Unknown error'}` },
        { status }
    );
  }
}