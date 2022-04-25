import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntlTelInputComponent } from './intl-tel-input.component';
import { IntlTelInputService } from './intl-tel-input.service';
import { TranslateModule } from '@ngx-translate/core';
import { ClarityModule } from '@clr/angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Country } from './model';
import { Countries } from './countries';
import { getPhoneNumberPlaceHolder } from './helpers';
import { PhoneNumberFormat } from 'google-libphonenumber';
import { COUNTRIES } from './types';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ClarityModule,
    ScrollingModule,
  ],
  declarations: [IntlTelInputComponent],
  exports: [IntlTelInputComponent],
})
export class IntlTelInputModule {
  static forRoot(configs?: {
    countries: Country[] | (() => Country[]);
  }): ModuleWithProviders<IntlTelInputModule> {
    return {
      ngModule: IntlTelInputModule,
      providers: [
        IntlTelInputService,
        {
          provide: COUNTRIES,
          useFactory: () => {
            if (configs) {
              const { countries } = configs;
              if (typeof countries === 'function') {
                return (countries as () => Country[])();
              }
              if (countries instanceof Array) {
                return (countries as Country[]).filter(
                  (country) =>
                    typeof country === 'object' &&
                    typeof country.iso2 !== 'undefined' &&
                    typeof country.name !== 'undefined' &&
                    typeof country.dialCode !== 'undefined'
                );
              }
            }
            return Countries.allCountries.map((country) => ({
              name: country[0].toString(),
              iso2: country[1].toString(),
              dialCode: country[2].toString(),
              priority: +country[3] || 0,
              areaCode: +country[4] || undefined,
              flagClass: country[1].toString().toLocaleLowerCase(),
              placeHolder: `${getPhoneNumberPlaceHolder(
                country[1].toString().toUpperCase(),
                PhoneNumberFormat.NATIONAL
              )}`,
            }));
          },
        },
      ],
    };
  }
}
