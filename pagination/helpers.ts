import { ClrDatagridStateInterface } from '@clr/angular';
import { isArray } from '../utils/types/type-utils';

export const mapPaginatorStateWith = (params: { [index: string]: any }[] | { [index: string]: any } = []) =>
  (state: ClrDatagridStateInterface) => {
    const filters: { [prop: string]: any[] } = {};
    if (state.filters) {
      for (const filter of state.filters) {
        const { property, value } = filter as { property: string, value: string };
        filters[property] = [value];
      }
    }
    let currenState = { ...filters, ...{ page: state?.page?.current, per_page: state?.page?.size } };
    if (isArray(params)) {
      params.map((p: object) => {
        currenState = { ...currenState, ...p };
      });
    }
    return { ...filters, ...currenState } as any;
  };
