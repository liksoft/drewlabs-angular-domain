import { inject, InjectionToken } from '@angular/core';
import { isDefined } from '../../../types/type-utils';
import { NAVIGATOR } from '../../common/tokens/navigator';

export const GEOLOCATION = new InjectionToken<Geolocation>(
    'An abstraction over window.navigator.geolocation object',
    {
        factory: () => inject(NAVIGATOR).geolocation,
    },
);

export const IS_GEOLOCATION_SUPPORTED = new InjectionToken<boolean>(
    'An abstraction token that return whether the GEOLOCATION SERVICE is Supported or not',
    {
        factory: () => isDefined(inject(GEOLOCATION)),
    },
);

export const DEFAULT_POSITION_OPTIONS = new InjectionToken<PositionOptions>(
    'Token for an additional position options',
    {factory: () => ({})},
);