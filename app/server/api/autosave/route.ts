import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initFirebaseAdmin } from "../../../shared/firebase";

export async function POST(req: Request) {
  const { projectId, files } = await req.json();
  const db = getFirestore(initFirebaseAdmin());
  await db.collection("sites").doc(projectId).update({ files, updatedAt: Date.now() });
  return NextResponse.json({ success: true });
}
