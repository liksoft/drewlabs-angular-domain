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

export type PaginableValue = { id: string | number };

export type QueryFiltersType = { [index: string]: any }[];

export type MapToPaginationQueryInputType<T = any> = {
  page?: {
    from?: number;
    to?: number;
    size?: number;
    current?: number;
  };
  sort?: {
    by: string | { compare: (a: T, b: T) => number };
    reverse: boolean;
  };
  filters?: any[];
};

export type MapToPaginationQueryOutputType = {
  page: number;
  per_page: number | undefined;
  _query: string | object;
  [index: string]: any;
};
