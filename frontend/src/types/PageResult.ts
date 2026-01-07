export interface PageResult<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  items: T[];
}