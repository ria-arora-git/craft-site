import OpenAI from "openai";
import type { FileMap } from "./types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function generateCode(prompt: string, techStack: string): Promise<FileMap> {
  const systemPrompt = `You are an expert full-stack web developer.
Generate a production-ready full website using ${techStack}.
Add:
- Homepage with layout and components
- SEO meta tags (title, og:image, twitter:card)
- Google Analytics setup
Respond ONLY with a valid JSON: { \"filename\": \"file contents\" }`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
  });

  return JSON.parse(res.choices[0].message.content!);
}
