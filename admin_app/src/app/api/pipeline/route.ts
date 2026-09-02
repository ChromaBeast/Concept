import { NextRequest, NextResponse } from 'next/server';
import { Client, Functions, ExecutionMethod } from 'node-appwrite';
import { APPWRITE_CONFIG, MASTER_KEY } from '@/lib/appwrite';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = 'pipeline', ...rest } = body;

    const serverClient = new Client()
      .setEndpoint(APPWRITE_CONFIG.endpoint)
      .setProject(APPWRITE_CONFIG.projectId)
      .setKey(MASTER_KEY);

    const serverFunctions = new Functions(serverClient);

    const execution = await serverFunctions.createExecution(
      'conceptEngine',
      JSON.stringify({ action, ...rest }),
      false,
      `/?action=${action}`,
      ExecutionMethod.POST
    );

    let parsedResponse = {};
    try {
      parsedResponse = JSON.parse(execution.responseBody || '{}');
    } catch {
      parsedResponse = { raw: execution.responseBody };
    }

    return NextResponse.json({
      success: execution.status === 'completed',
      status: execution.status,
      ...parsedResponse,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Function execution failed' },
      { status: 500 }
    );
  }
}
