import fetch from "node-fetch";
import { FileMap } from "./types";

const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID!;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

export async function deployToVercel(files: FileMap, domain?: string): Promise<string> {
  const deployment = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "ai-generated-site",
      files: Object.entries(files).map(([path, content]) => ({
        file: path,
        data: content,
      })),
      project: VERCEL_PROJECT_ID,
      target: "production",
      teamId: VERCEL_TEAM_ID,
    }),
  }).then((res) => res.json());

  if (domain) {
    await fetch(`https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: domain }),
    });
  }

  return `https://${deployment.url}`;
}
