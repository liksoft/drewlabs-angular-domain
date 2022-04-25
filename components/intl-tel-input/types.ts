import { InjectionToken } from "@angular/core";
import { Country } from "./model";

export const COUNTRIES = new InjectionToken<Country[]>('ISO3166 countries injectable token');
