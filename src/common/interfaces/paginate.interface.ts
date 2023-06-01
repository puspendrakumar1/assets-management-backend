export interface IPaginatedResponse<T> {
  limit: number;
  page: number;
  totalPage: number;
  totaldata: number;
  data: T[];
}
