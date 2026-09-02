import defaultContent from "@/data/project-status.json";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { firestore } from "./firebase";

export type ProjectContent = typeof defaultContent;
export type ProjectBlock = ProjectContent["blocks"][number];

export const projectDefaults: ProjectContent = defaultContent;

const PROJECT_DATA_COLLECTION = "projectData";
const CONTENT_DOCUMENT = "website";
const ACCESS_DOCUMENT = "panel-access";
const DEFAULT_ACCESS_CODE = "elysadmin";
const DEFAULT_ACCESS_CODE_HASH = "1f01eeaf275dc3ebe336ba85d69d28ee3b62a828e146642fdf6c4908b19bbfbb";

function mergeProjectContent(stored?: Partial<ProjectContent>): ProjectContent {
  if (!stored) return projectDefaults;

  return {
    ...projectDefaults,
    ...stored,
    general: { ...projectDefaults.general, ...stored.general },
    hero: { ...projectDefaults.hero, ...stored.hero },
    location: {
      ...projectDefaults.location,
      ...stored.location,
      metrics: projectDefaults.location.metrics,
    },
    contacts: stored.contacts?.length ? stored.contacts : projectDefaults.contacts,
    blocks: stored.blocks?.length ? stored.blocks : projectDefaults.blocks,
  };
}

async function hashAccessCode(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function subscribeProjectContent(
  onContent: (content: ProjectContent) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(firestore, PROJECT_DATA_COLLECTION, CONTENT_DOCUMENT),
    (snapshot) => onContent(mergeProjectContent(snapshot.exists() ? snapshot.data() as Partial<ProjectContent> : undefined)),
    (error) => onError?.(error),
  );
}

export async function saveProjectContent(content: ProjectContent) {
  await setDoc(doc(firestore, PROJECT_DATA_COLLECTION, CONTENT_DOCUMENT), {
    ...content,
    updatedAt: serverTimestamp(),
  });
}

export async function verifyPanelAccess(accessCode: string) {
  const accessRef = doc(firestore, PROJECT_DATA_COLLECTION, ACCESS_DOCUMENT);
  const enteredHash = await hashAccessCode(accessCode);
  const snapshot = await getDoc(accessRef);

  if (!snapshot.exists()) {
    if (accessCode !== DEFAULT_ACCESS_CODE) return false;
    await setDoc(accessRef, { codeHash: DEFAULT_ACCESS_CODE_HASH });
    return true;
  }

  return snapshot.data().codeHash === enteredHash;
}
