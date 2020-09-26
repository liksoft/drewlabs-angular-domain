// This file contains methods for working with entity object with
// a unique field / property named [[id]]

import { isArray } from '../../utils/types';
import { PaginationDataState } from '../types';

export const updatePaginationData = <T extends { id: string | number }>(
  values: PaginationDataState<{ [index: string]: T }>, payload: any) => {
  // tslint:disable-next-line: variable-name
  let _values = { ...values };
  // tslint:disable-next-line: variable-name
  const _items = _values.items || {};
  if (payload) {
    if (payload.data) {
      (payload.data as { [index: string]: any }[]).forEach((value) => {
        const key = value.id.toString();
        if (_items[key]) {
          _items[key] = value;
        }
        _items[key] = value;
      });
    }
    _values = {
      ..._values,
      latests: payload.data || _values.latests,
      total: payload.total || _values.total,
      items: _items,
      currentPage: payload.page || _values.currentPage,
      lastPage: payload.lastPage || _values.lastPage,
      nextPageURL: typeof payload.nextPageURL === 'object' ? payload.nextPageURL : payload.nextPageURL || _values.nextPageURL,
      lastPageURL: payload.lastPageURL || _values.lastPageURL
    };
  }
  return _values;
};

export const insertOrUpdateValuesUsingID = <T extends { id: string | number }>(
  items: { [index: string]: T }, payload: T[]) => {
  // tslint:disable-next-line: variable-name
  const _items = items || {};
  if (payload && isArray(payload)) {
    (payload as T[]).forEach((value) => {
      const key = value.id.toString();
      if (_items[key]) {
        _items[key] = value;
      }
      _items[key] = value;
    });
  }
  return _items;
};

export const listItemToIdMaps = <T extends { id: string | number }>(list: T[]) => {
  // tslint:disable-next-line: variable-name
  const _cache = {};
  list.forEach(item => {
    _cache[item.id.toString()] = item;
  });
  return _cache;
};

export const addItemToCache = <T extends { id: string | number }>(cache: { [index: string]: T }, newItem: T) => {
  // tslint:disable-next-line: variable-name
  const _cache = { ...cache };
  _cache[newItem.id.toString()] = newItem;
  return _cache;
};

export const removeItemFromCache = <T extends { id: string | number }>(cache: { [index: string]: T }, match: T) => {
  // tslint:disable-next-line: variable-name
  const _cache = { ...cache };
  delete _cache[match.id.toString()];
  return _cache;
};
