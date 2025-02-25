export interface QueryModel {
  page?: number;
  sort?: {
    field: string;
    order: 'ASC' | 'DESC';
  };
  filter?: { [key: string]: any };
}
