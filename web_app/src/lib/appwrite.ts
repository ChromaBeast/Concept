import { Client, Account, Databases, Storage } from 'appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'concept-app';

export const appwriteClient = new Client();

if (typeof window !== 'undefined') {
  appwriteClient.setEndpoint(endpoint).setProject(projectId);
}

export const account = new Account(appwriteClient);
export const databases = new Databases(appwriteClient);
export const storageClient = new Storage(appwriteClient);

export const APPWRITE_CONFIG = {
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'concept-db',
  collections: {
    concepts: 'concepts',
    courses: 'courses',
    tags: 'tags',
    roadmapTopics: 'roadmapTopics',
    pipelineRuns: 'pipelineRuns',
  },
  buckets: {
    conceptImages: 'concept-images',
  },
};
