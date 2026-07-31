export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T | null;
  errorCode?: string | null;
}

/**
 * Returns a successful API payload with a consistent shape.
 *
 * @param {T} data The payload data to return.
 * @param {string} message The success message.
 * @return {ApiResponse<T>} A normalized success payload.
 */
export function success<T>(
  data: T,
  message = "Request completed successfully"
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    errorCode: null,
  };
}

/**
 * Returns a client error payload with a consistent shape.
 *
 * @param {string} message The user-facing error message.
 * @param {string} errorCode A stable error code.
 * @return {ApiResponse<null>} A normalized bad-request payload.
 */
export function badRequest(
  message: string,
  errorCode = "invalid_request"
): ApiResponse<null> {
  return {
    success: false,
    message,
    errorCode,
  };
}

/**
 * Returns a server error payload with a consistent shape.
 *
 * @param {string} message The server error message.
 * @param {string} errorCode A stable error code.
 * @return {ApiResponse<null>} A normalized internal-error payload.
 */
export function internalError(
  message = "Internal server error",
  errorCode = "internal_error"
): ApiResponse<null> {
  return {
    success: false,
    message,
    errorCode,
  };
}
