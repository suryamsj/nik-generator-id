export class NIKError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "NIKError";
    Object.setPrototypeOf(this, NIKError.prototype);
  }
}
