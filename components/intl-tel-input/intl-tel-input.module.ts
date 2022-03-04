import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntlTelInputComponent } from './intl-tel-input.component';
import { IntlTelInputService } from './intl-tel-input.service';
import { TranslateModule } from '@ngx-translate/core';
import { ClarityModule } from '@clr/angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Country } from './country.model';
import { Countries } from './countries';
import { getPhoneNumberPlaceHolder } from './helpers';
import { PhoneNumberFormat } from 'google-libphonenumber';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ClarityModule,
    ScrollingModule
  ],
  declarations: [
    IntlTelInputComponent
  ],
  exports: [
    IntlTelInputComponent
  ]
})
export class IntlTelInputModule {
  static forRoot(configs?: { countries: Country[] | (() => Country[]) }): ModuleWithProviders<IntlTelInputModule> {
    return {
      ngModule: IntlTelInputModule,
      providers: [
        IntlTelInputService,
        {
          provide: 'TELINPUT_COUNTRIES',
          useFactory: () => {
            if (configs) {
              const { countries } = configs;
              if (typeof countries === 'function') {
                return (countries as (() => Country[]))();
              }
              if (countries instanceof Array) {
                return (countries as Country[]).filter(country => country instanceof Country);
              }
            }
            return Countries.allCountries.map(c => {
              const country = new Country();
              country.name = c[0].toString();
              country.iso2 = c[1].toString();
              country.dialCode = c[2].toString();
              country.priority = +c[3] || 0;
              country.areaCode = +c[4] || null;
              country.flagClass = country.iso2.toLocaleLowerCase();
              country.placeHolder = `${getPhoneNumberPlaceHolder(
                country.iso2.toUpperCase(), PhoneNumberFormat.NATIONAL
              )}`;
              return country;
            });
          }
        }
      ]
    };
  }
}
