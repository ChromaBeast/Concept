import { Client, Databases, Functions, Storage, Account } from 'appwrite';

export const APPWRITE_CONFIG = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a97fc420033ed1fefd0',
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a97fc7c0037107a5f9a',
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || '6a97fca9001531fa17f7',
  collections: {
    concepts: 'concepts',
    courses: 'courses',
    tags: 'tags',
    roadmapTopics: 'roadmapTopics',
    pipelineRuns: 'pipelineRuns',
    userProfiles: 'userProfiles',
  },
};

export const MASTER_KEY =
  'YOUR_APPWRITE_API_KEY';

export const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

export const databases = new Databases(client);
export const functions = new Functions(client);
export const storage = new Storage(client);
export const account = new Account(client);
