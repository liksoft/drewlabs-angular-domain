import { isDefined } from '../utils/types/type-utils';

/**
 * @description Type definition for application links
 */
export interface RoutesMapV2 {
    key: string;
    route?: string;
    routeIcon?: string;
    authorizations?: string[];
    children?: RoutesMapV2[];
}

/**
 * @description Type definition for an application navigation link.This type is use to easily generate topbar and navigation bar links.
 */
export interface RouteLinkV2 {
    routePath?: string;
    routeDescription: string;
    routeIcon?: string;
    authorizations?: string[];
    children?: RouteLinkV2[];
}

/**
 * @description  Type definition for a route collection item
 */
export interface RouteLinkCollectionItemV2Interface {
    key: string;
    value: RouteLinkV2;
}

/**
 * @description Global function for building navigation links based on routes map collections
 * @param map [[RoutesMapV2[]]]
 * @param translations [[any]]
 */
export const routeMapToLink = (map: RoutesMapV2[], translations: any) =>
    (!isDefined(map) || map.length === 0) ? [] : map.map((m: RoutesMapV2) => {
        let children: RouteLinkV2[] = [];
        if (m.children) {
            children = m.children.map((v: RoutesMapV2) => ({
                routePath: v.route,
                routeDescription: translations[v.key],
                routeIcon: v.routeIcon,
                authorizations: v.authorizations ? v.authorizations : []
            } as RouteLinkV2));
            return {
                key: m.key,
                value: {
                    routeDescription: translations[m.key],
                    authorizations: m.authorizations ? m.authorizations : [],
                    children,
                    routeIcon: m.routeIcon
                } as RouteLinkV2
            } as RouteLinkCollectionItemV2Interface;
        } else {
            return {
                key: m.key,
                value: {
                    routePath: m.route,
                    routeDescription: translations[m.key],
                    routeIcon: m.routeIcon,
                    authorizations: m.authorizations ? m.authorizations : []
                }
            } as RouteLinkCollectionItemV2Interface;
        }
    });

