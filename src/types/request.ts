export interface PaginationQueryDto {
  page: number;
  limit: number;
}

export interface PaginationResponseDto<T> {
  items: T[];
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}
