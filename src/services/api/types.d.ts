declare global {
  interface GlobalResponse<T> {
    error: boolean;
    code: number;
    message: string;
    data: T;
  }

  interface PaginatedResponse<T> extends GlobalResponse<T> {
    count: number;
    currentPage: number;
    limit: number;
    offset: number;
    totalPage: number;
  }

  interface IDName {
    id: string;
    name: string;
  }

  interface AttachmentItem {
    name: string;
    url: string;
  }
}

export {};
