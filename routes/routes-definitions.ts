import { isDefined } from '../utils/types/type-utils';

/**
 * @description Type definition for application links
 * @deprecated
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
 * @deprecated
 */
export interface RouteLink {
  routePath?: string;
  routeDescription: string;
  routeIcon?: string;
  routePermissions?: string[];
  children?: RouteLink[];
}

/**
 * @description  Type definition for a route collection item
 * @deprecated
 */
export interface IRouteLinkCollectionItem {
  key: string;
  value: RouteLink;
}

/**
 * @description Global function for building navigation links based on routes map collections
 * @param map [[RoutesMap[]]]
 * @param translations [[any]]
 * @deprecated
 */
export const builLinkFromRoutesMap = (map: RoutesMap[], translations: any) => {
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
          routeIcon: v.routeIcon,
          routePermissions: v.permissions ? v.permissions : []
        };
      });
      return {
        key: m.key,
        value: {
          routeDescription: translations[m.key],
          routePermissions: m.permissions ? m.permissions : [],
          children,
          routeIcon: m.routeIcon
        }
      } as IRouteLinkCollectionItem;
    } else {
      return {
        key: m.key,
        value: {
          routePath: m.route,
          routeDescription: translations[m.key],
          routeIcon: m.routeIcon,
          routePermissions: m.permissions ? m.permissions : []
        }
      } as IRouteLinkCollectionItem;
    }
  });
};

