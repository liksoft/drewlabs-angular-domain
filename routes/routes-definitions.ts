import { isDefined } from '../utils/types/type-utils';

/**
 * @description Type definition for application links
 */
export interface RoutesMap {
  key: string;
  route?: string;
  // Route icon to be shown on the view
  routeIcon?: string;
  permissions?: string[];
  children?: RoutesMap[];
}

/**
 * @description Type definition for an application navigation link.This type is use to easily generate topbar and navigation bar links.
 */
export interface RouteLink {
  routePath?: string;
  routeDescription: string;
  routeIcon?: string;
  routePermission?: string[];
  children?: RouteLink[];
}

/**
 * @description  Type definition for a route collection item
 */
export interface IRouteLinkCollectionItem {
  key: string;
  value: RouteLink;
}

/**
 * @description Global function for building navigation links based on routes map collections
 * @param map [[RoutesMap[]]]
 * @param translations [[any]]
 */
export function builLinkFromRoutesMap(map: RoutesMap[], translations: any) {
  if (!isDefined(map) || map.length === 0) {
    return [];
  }
  return map.map((m: RoutesMap) => {
    let children = [];
    if (m.children) {
      children = m.children.map((v: RoutesMap) => {
        return {
          routePath: v.route,
          routeDescription: translations[v.key],
          routeIcon: m.routeIcon,
          routePermission: v.permissions ? v.permissions : []
        };
      });
      return {
        key: m.key,
        value: {
          routeDescription: translations[m.key],
          children
        }
      } as IRouteLinkCollectionItem;
    } else {
      return {
        key: m.key,
        value: {
          routePath: m.route,
          routeDescription: translations[m.key],
          routeIcon: m.routeIcon,
          routePermission: m.permissions ? m.permissions : []
        }
      } as IRouteLinkCollectionItem;
    }
  });
}
