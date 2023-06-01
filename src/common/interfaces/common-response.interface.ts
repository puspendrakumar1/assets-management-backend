/**
 * Common interface for all responses
 * @export
 * @interface CommonResponse
 * @template T
 */
export interface CommonResponse<T = any> {
  message?: string;
  data?: T;
}
