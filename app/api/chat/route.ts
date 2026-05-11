import { NextRequest } from 'next/server';
import { processChat } from '@/lib/services/chat-service';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const result = await processChat(messages);

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat" }), { status: 500 });
  }
}