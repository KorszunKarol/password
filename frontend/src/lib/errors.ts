export class ApiError extends Error {
  constructor(
    public detail: string,
    public status: number
  ) {
    super(detail);
    this.name = 'ApiError';
  }
}