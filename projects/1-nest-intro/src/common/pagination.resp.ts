// ! why pagination param is a class and here it's an interface, since We just need an interface as a type,
// ! but for param, we need an instance to tranform param data
export interface PaginationResp<T> {
  data: T[];
  meta: {
    total: number;
    offset: number;
    limit: number;
  };
}
