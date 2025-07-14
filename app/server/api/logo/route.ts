import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: `Logo design: ${prompt}. Style: minimal, modern, vector, centered, white background`,
    n: 1,
    size: "512x512",
  });
  return NextResponse.json({ url: image.data[0].url });
}
