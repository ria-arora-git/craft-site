import { NextResponse } from "next/server";
import { generateCode } from "../../../shared/codegen";

export async function POST(req: Request) {
  const { prompt, stack } = await req.json();
  const files = await generateCode(prompt, stack);
  return NextResponse.json({ files });
}
