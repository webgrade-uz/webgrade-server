export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
