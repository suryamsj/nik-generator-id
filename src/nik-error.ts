/**
 * Custom error class for NIK related errors
 * Allows users to catch specific errors from this package
 */
export class NIKError extends Error {
  /**
   * Creates a new NIKError instance
   * @param {string} message - The error message
   * @param {string} code - Optional error code for more specific identification
   */
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "NIKError";

    // Ensures the prototype chain is set correctly
    Object.setPrototypeOf(this, NIKError.prototype);
  }
}
