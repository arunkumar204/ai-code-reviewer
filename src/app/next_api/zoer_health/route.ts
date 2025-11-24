import { createSuccessResponse } from '@/src/lib/create-response';
import { requestMiddleware } from "@/src/lib/api-utils";

// GET request - health check endpoint
export const GET = requestMiddleware(async () => {
  return createSuccessResponse({ status: 'ok' });
});
