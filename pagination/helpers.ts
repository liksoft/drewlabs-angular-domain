import { ClrDatagridStateInterface } from "@clr/angular";
import { isArray } from "../utils/types/type-utils";

export const mapPaginatorStateWith =
  (params: { [index: string]: any }[] | { [index: string]: any } = []) =>
  (state: ClrDatagridStateInterface) => {
    // 'order' => 'desc', 'by' => 'updated_at'
    const filters: { [prop: string]: any[] } = {};
    let query: { [prop: string]: any } = {};
    //#region Add sort filters to the list of query filters
    if (state?.sort) {
      query = {
        _query: JSON.stringify({
          orderBy: {
            order: state?.sort?.reverse ? "DESC" : "ASC",
            by: state?.sort?.by || "updated_at",
          },
        }),
      };
    } else {
      query = {
        _query: JSON.stringify({
          orderBy: {
            order: "DESC",
            by: "updated_at",
          },
        }),
      };
    }
    //#endregion Add sort filters to the list of query filters
    if (state.filters) {
      for (const filter of state.filters) {
        const { property, value } = filter as {
          property: string;
          value: string;
        };
        filters[property] = [value];
      }
    }
    let currenState = {
      ...filters,
      page: state?.page?.current || 1,
      per_page: state?.page?.size || 20,
      ...query,
    };
    if (isArray(params)) {
      params.map((p: object) => {
        currenState = { ...currenState, ...p };
      });
    }
    return { ...filters, ...currenState } as any;
  };
