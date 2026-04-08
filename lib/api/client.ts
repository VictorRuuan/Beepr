import { supabase } from '../supabase';

export type ApiBody = Record<string, unknown> | undefined;

export class ApiClientError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export type ApiResponse<TData> = {
  data: TData | null;
  error: ApiClientError | null;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  return fallback;
};

export const invokeEdgeFunction = async <TData = unknown, TBody extends ApiBody = ApiBody>(
  functionName: string,
  body?: TBody,
): Promise<ApiResponse<TData>> => {
  try {
    const { data, error } = await supabase.functions.invoke<TData>(functionName, { body });

    if (error) {
      return {
        data: null,
        error: new ApiClientError(
          getErrorMessage(error, `Failed to invoke "${functionName}".`),
          error,
        ),
      };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: new ApiClientError(
        getErrorMessage(error, `Unexpected API error while invoking "${functionName}".`),
        error,
      ),
    };
  }
};

export const createEdgeFunction = <TData = unknown, TBody extends ApiBody = ApiBody>(
  functionName: string,
) => {
  return (body?: TBody) => invokeEdgeFunction<TData, TBody>(functionName, body);
};
