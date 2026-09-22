export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "UPSTREAM_ERROR"
  | "INTERNAL_ERROR"
  | "TOO_MANY_REQUESTS";

export type ApiErrorBody = { code: ApiErrorCode; message: string; requestId: string };

export class ApiError extends Error {
  code: ApiErrorCode;
  status: number;
  constructor(code: ApiErrorCode, status: number, message: string) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function toApiErrorBody(
  err: unknown,
  requestId: string,
): { status: number; body: ApiErrorBody } {
  if (err instanceof ApiError) {
    return {
      status: err.status,
      body: { code: err.code, message: err.message, requestId },
    };
  }
  const status = typeof (err as any)?.status === "number" ? (err as any).status : 500;
  const msg =
    typeof (err as any)?.message === "string" ? (err as any).message : "Internal error";
  const code: ApiErrorCode = status >= 500 ? "INTERNAL_ERROR" : "UPSTREAM_ERROR";
  return { status, body: { code, message: msg, requestId } };
}
