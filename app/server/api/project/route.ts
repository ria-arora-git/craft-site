import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initFirebaseAdmin } from "../../../shared/firebase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const id = searchParams.get("id");
  if (!uid || !id) return NextResponse.json({ error: "Missing uid or id" }, { status: 400 });

  const db = getFirestore(initFirebaseAdmin());
  const doc = await db.collection("sites").doc(id).get();
  if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(doc.data());
}
