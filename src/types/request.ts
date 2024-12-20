export interface PaginationQueryDto {
  page: number;
  limit: number;
}

export interface PaginationResponseDto<T> {
  items: T[];
  total: number;
}
