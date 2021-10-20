import { ClrDatagridStateInterface } from "@clr/angular";
import { uniqBy } from "lodash";
import { Paginable } from ".";
import { isArray } from "../utils/types/type-utils";
import { PaginableValue } from "./types";

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

export const mapPaginableTo =
  <T extends PaginableValue>(payload: Partial<Paginable<T>>) =>
  (values: Paginable<T>) => {
    // tslint:disable-next-line: variable-name
    let _values = { ...values };
    // tslint:disable-next-line: variable-name
    const _items = _values.items || {};
    if (payload && payload.data) {
      (payload.data as T[]).forEach((value) => {
        const key = value.id.toString();
        if (_items[key]) {
          _items[key] = value;
        }
        _items[key] = value;
      });
      _values = {
        ..._values,
        data: uniqBy(payload.data ?? _values.data, "id"),
        total: payload.total || _values.total,
        items: _items,
        page: payload.page || _values.page,
        lastPage: payload.lastPage || _values.lastPage,
        nextPageURL:
          typeof payload.nextPageURL === "object"
            ? payload.nextPageURL
            : payload.nextPageURL || _values.nextPageURL,
        lastPageURL: payload.lastPageURL || _values.lastPageURL,
      } as Paginable<T>;
    }
    return _values;
  };

export const addPaginableValue =
  <T extends PaginableValue>(payload: T[] | T) =>
  (values: Paginable<T>) => {
    // tslint:disable-next-line: variable-name
    let _values = values ? { ...values } : ({} as Paginable<T>);
    // tslint:disable-next-line: variable-name
    const _items = _values.items ?? {};
    if (payload) {
      const _payload = !isArray(payload) ? [payload as T] : (payload as T[]);
      _values = {
        ..._values,
        data: uniqBy(
          _values.data ? [..._payload, ..._values.data] : [..._payload],
          "id"
        ),
        total: _values.total ? _values.total + 1 : 1,
        items: _payload.reduce((carry, current) => {
          if (current.id) {
            let _item: { [index: string]: any } = {};
            const _carry = carry ?? {};
            const key = current.id.toString();
            _item[key] = current;
            return { ..._carry, ..._item };
          }
          return { ...carry };
        }, _items),
      };
    }
    return _values;
  };

export const updatePaginableValue =
  <T extends PaginableValue>(payload: T) =>
  (values: Paginable<T>) => {
    // tslint:disable-next-line: variable-name
    let _values = values ? { ...values } : ({} as Paginable<T>);
    // tslint:disable-next-line: variable-name
    const _items = _values.items ?? {};
    if (payload) {
      const _payload = payload;
      _items[_payload.id.toString()] = _payload;
      _values = {
        ..._values,
        data: uniqBy(
          [
            ...[_payload],
            ..._values.data?.filter((value) => value.id !== _payload.id),
          ],
          "id"
        ),
        items: _items,
      };
    }
    return _values;
  };

export const deletePaginableValue =
  <T extends PaginableValue>(payload: T) =>
  (values: Paginable<T>) => {
    // tslint:disable-next-line: variable-name
    let _values = values ? { ...values } : ({} as Paginable<T>);
    // tslint:disable-next-line: variable-name
    const _items = _values.items ?? {};
    if (payload) {
      delete _items[payload.id.toString()];
      _values = {
        ..._values,
        data: uniqBy(
          [..._values.data?.filter((value) => value.id !== payload.id)],
          "id"
        ),
        items: _items,
      };
    }
    return _values;
  };
