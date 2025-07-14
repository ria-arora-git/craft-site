import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { DeployRequest, ProjectRecord } from "./types";

// Optional: use env vars or service account JSON
const firebaseConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  }),
};

export function initFirebaseAdmin() {
  if (getApps().length === 0) {
    initializeApp(firebaseConfig);
  }
  return getFirestore();
}

export async function saveDeploymentToDB(req: DeployRequest & { url: string }): Promise<string> {
  const db = initFirebaseAdmin();
  const siteRef = req.projectId
    ? db.collection("sites").doc(req.projectId)
    : db.collection("sites").doc();

  await siteRef.set(
    {
      uid: req.uid,
      prompt: req.prompt,
      stack: req.stack,
      domain: req.domain || "",
      url: req.url,
      files: req.files,
      updatedAt: Date.now(),
      createdAt: req.projectId ? undefined : Date.now(),
    },
    { merge: true }
  );

  return siteRef.id;
}

export async function getDeploymentsForUser(uid: string): Promise<ProjectRecord[]> {
  const db = initFirebaseAdmin();
  const snapshot = await db.collection("sites").where("uid", "==", uid).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ProjectRecord));
}
