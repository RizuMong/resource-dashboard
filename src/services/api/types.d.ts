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

  interface Project {
    id: string;
    name: string;
    status: string;
  }

  interface Sprint {
    id: string;
    name: string;
    end_date: number;
    start_date: number;
  }

  interface Employee {
    id: string;
    name: string;
    email: string;
    role_id: IDName;
  }

  interface Year {
    id: string;
    name: string;
    status: string;
  }

  interface AttachmentItem {
    name: string;
    url: string;
  }
}

export {};
