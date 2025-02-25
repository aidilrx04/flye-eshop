export interface QueryModel<T = { [key: string]: any }> {
  page?: number;
  sort?: {
    field: keyof T;
    order: 'ASC' | 'DESC';
  };
  filter?: Partial<T>;
}
