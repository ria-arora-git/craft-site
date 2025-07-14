import { NextResponse } from "next/server";
import { getDeploymentsForUser } from "../../../shared/firebase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  if (!uid) return NextResponse.json({ error: "Missing uid" }, { status: 400 });

  const deployments = await getDeploymentsForUser(uid);
  return NextResponse.json(deployments);
}
