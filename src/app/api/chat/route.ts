// /api/chat/route.ts
// TODO: Implement chatbot API (vector search, GPT prompt, etc.)
import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  // TODO: Parse input, vector search, call OpenAI, return response
  return NextResponse.json({ message: "Chatbot response coming soon." });
}
