import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window';

export const SESSION_STORAGE = new InjectionToken<Storage>(
    'An abstraction over window.sessionStorage object',
    {
        factory: () => inject(WINDOW).sessionStorage,
    },
);

export const LOCAL_STORAGE = new InjectionToken<Storage>(
    'An abstraction over window.localStorage object',
    {
        factory: () => inject(WINDOW).localStorage,
    },
);