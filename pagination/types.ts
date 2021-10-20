export type Paginable<T> = {
  items: { [index: string]: T };
  total: number;
  data: T[];
  lastPage?: number;
  nextPageURL?: string;
  lastPageURL?: string;
  page?: number;
};

export type PaginationData<T> = Partial<Paginable<T>>;

/**
 * @description Type definition for an item in the paginable source
 */
export type PaginableValue = { id: string | number };
