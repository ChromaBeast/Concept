import { Client, Account, Databases, Storage } from 'appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a97fc420033ed1fefd0';

export const appwriteClient = new Client();

if (typeof window !== 'undefined') {
  appwriteClient.setEndpoint(endpoint).setProject(projectId);
}

export const account = new Account(appwriteClient);
export const databases = new Databases(appwriteClient);
export const storageClient = new Storage(appwriteClient);

export const APPWRITE_CONFIG = {
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a97fc7c0037107a5f9a',
  collections: {
    concepts: 'concepts',
    courses: 'courses',
    tags: 'tags',
    roadmapTopics: 'roadmapTopics',
    pipelineRuns: 'pipelineRuns',
  },
  buckets: {
    conceptImages: '6a97fca9001531fa17f7',
  },
};
