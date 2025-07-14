// shared/types.ts

export type FileMap = Record<string, string>;

export interface DeployRequest {
  files: FileMap;
  domain?: string;
  uid?: string;
  prompt: string;
  stack: string;
  projectId?: string;
}

export interface ProjectRecord {
  id: string;
  uid: string;
  prompt: string;
  stack: string;
  domain?: string;
  url: string;
  createdAt: number;
}

export interface VersionRecord {
  id: string;
  timestamp: number;
  files: FileMap;
  url: string;
}
