import { isDefined } from '../utils/types/type-utils';

/**
 * @description Type definition for application links
 */
export interface RoutesMap {
    key: string;
    route?: string;
    routeIcon?: string;
    authorizations?: string[];
    children?: RoutesMap[];
}

/**
 * @description Type definition for an application navigation link.This type is use to easily generate topbar and navigation bar links.
 */
export interface RouteLink {
    routePath?: string;
    routeDescription: string;
    routeIcon?: string;
    authorizations?: string[];
    children?: RouteLink[];
}

/**
 * @description  Type definition for a route collection item
 */
export interface RouteLinkCollectionItemInterface {
    key: string;
    value: RouteLink;
}

/**
 * @description Global function for building navigation links based on routes map collections
 * @param map [[RoutesMap[]]]
 * @param translations [[any]]
 */
export const routeMapToLink = (map: RoutesMap[], translations: any) =>
    (!isDefined(map) || map.length === 0) ? [] : map.map((m: RoutesMap) => {
        let children: RouteLink[] = [];
        if (m.children) {
            children = m.children.map((v: RoutesMap) => ({
                routePath: v.route,
                routeDescription: translations[v.key],
                routeIcon: v.routeIcon,
                authorizations: v.authorizations ? v.authorizations : []
            } as RouteLink));
            return {
                key: m.key,
                value: {
                    routeDescription: translations[m.key],
                    authorizations: m.authorizations ? m.authorizations : [],
                    children,
                    routeIcon: m.routeIcon
                } as RouteLink
            } as RouteLinkCollectionItemInterface;
        } else {
            return {
                key: m.key,
                value: {
                    routePath: m.route,
                    routeDescription: translations[m.key],
                    routeIcon: m.routeIcon,
                    authorizations: m.authorizations ? m.authorizations : []
                } as RouteLink
            } as RouteLinkCollectionItemInterface;
        }
    });

