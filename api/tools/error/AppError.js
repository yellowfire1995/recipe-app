export class AppError extends Error {
  constructor(errorCode, message, status) {
    super(message);
    this.errorCode = errorCode;
    this.status = status;
  }
}
