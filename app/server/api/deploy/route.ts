import { NextResponse } from "next/server";
import { DeployRequest } from "../../../shared/types";
import { saveDeploymentToDB } from "../../../shared/firebase";
import { deployToVercel } from "../../../shared/vercel";

export async function POST(req: Request) {
  const body: DeployRequest = await req.json();

  const url = await deployToVercel(body.files, body.domain);
  const projectId = await saveDeploymentToDB({ ...body, url });

  return NextResponse.json({ url, projectId });
}
