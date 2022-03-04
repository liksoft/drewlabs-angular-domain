import { ISourceRequestQueryParameters } from '../ng-data-table.component';

/**
 * @description Type definition for entities used for querying backend enpoint. Query parameters are passed to the filter property
 */
export interface RessourcesEndpointQuery {
  filters: { [prop: string]: any[] };
  params: ISourceRequestQueryParameters;
  inlineQuery?: string;
  status?: number;
}

/**
 * @description Type defnition that extends base [[RessourcesEndpointQuery]] definitions by
 * adding additional properties for querying ressources that can be assigned to users for any handle operation
 */
export interface AssignableRessourcesEndpointQuery extends RessourcesEndpointQuery {
  status: number;
  assigned?: boolean;
}
