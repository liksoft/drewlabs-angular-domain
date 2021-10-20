// This file contains methods for working with entity object with
// a unique field / property named [[id]]

import { reduce } from "lodash";
import { isArray, isDefined } from "../../utils/types";
import { PaginationDataState } from "../types";

export const updatePaginationData = <T extends { id: string | number }>(
  values: PaginationDataState<T>,
  payload: any
) => {
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
      data: payload.data || _values.data,
      total: payload.total || _values.total,
      items: _items,
      page: payload.page || _values.page,
      lastPage: payload.lastPage || _values.lastPage,
      nextPageURL:
        typeof payload.nextPageURL === "object"
          ? payload.nextPageURL
          : payload.nextPageURL || _values.nextPageURL,
      lastPageURL: payload.lastPageURL || _values.lastPageURL,
    };
  }
  return _values;
};

export function addToCollection<T extends { id: string | number }>(
  values: PaginationDataState<T>,
  payload: T[] | T
) {
  // tslint:disable-next-line: variable-name
  let _values = { ...values };
  // tslint:disable-next-line: variable-name
  const _items = _values.items || {};
  if (payload) {
    const _payload = !isArray(payload) ? [payload as T] : (payload as T[]);
    _values = {
      ..._values,
      data: [..._payload, ..._values.data],
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
}

export const insertOrUpdateValuesUsingID = <T extends { id: string | number }>(
  items: { [index: string]: T },
  payload: T[] | T
) => {
  // tslint:disable-next-line: variable-name
  const _items = items || {};
  if (payload) {
    payload = (isArray(payload) ? (payload as T[]) : [payload as T]) as T[];
    return reduce(
      payload,
      (acc, current) => {
        if (!isDefined(current.id)) {
          return { ...acc };
        }
        let newItem: { [index: string]: any } = {};
        if (acc) {
          const key = current.id.toString();
          newItem[key] = current;
        }
        return { ...acc, ...newItem };
      },
      _items
    );
  }
  return _items;
};

export const listItemToIdMaps = <T extends { id: string | number }>(
  list: T[]
) => {
  // tslint:disable-next-line: variable-name
  const _cache: { [index: string]: any } = {};
  list.forEach((item) => {
    if (isDefined(item.id)) {
      _cache[item.id.toString()] = item;
    }
  });
  return _cache;
};

export const addItemToCache = <T extends { id: string | number }>(
  cache: { [index: string]: T },
  match: T
) => {
  // tslint:disable-next-line: variable-name
  const _cache = { ...cache };
  if (!isDefined(match) || !isDefined(match.id)) {
    return _cache;
  }
  _cache[match.id.toString()] = match;
  return _cache;
};

export const removeItemFromCache = <T extends { id: string | number }>(
  cache: { [index: string]: T },
  match: T
) => {
  // tslint:disable-next-line: variable-name
  const _cache = { ...cache };
  if (!isDefined(match) || !isDefined(match.id)) {
    return _cache;
  }
  delete _cache[match.id.toString()];
  return _cache;
};

export const removeFromCacheUsingID = <T extends { id: string | number }>(
  cache: { [index: string]: T },
  id: string | number
) => {
  // tslint:disable-next-line: variable-name
  const _cache = { ...cache };
  delete _cache[id.toString()];
  return _cache;
};

export const updateListUsingID = <T extends { id: string | number }>(
  list: T[],
  value: T
) => {
  const listCopy = [...list];
  listCopy.splice(
    listCopy.findIndex((c) => c.id === value.id),
    1,
    value
  );
  return listCopy;
};

export const deleteFromListUsingID = <T extends { id: string | number }>(
  list: T[],
  value: T
) => {
  const listCopy = [...list];
  listCopy.splice(
    listCopy.findIndex((c) => c.id === value.id),
    1
  );
  return listCopy;
};
