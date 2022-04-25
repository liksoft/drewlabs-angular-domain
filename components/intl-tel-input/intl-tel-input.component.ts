import {
  Component,
  Output,
  Input,
  OnInit,
  EventEmitter,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Country } from './model';
import { IntlTelInputService } from './intl-tel-input.service';
import { FormControl, Validators, ValidatorFn } from '@angular/forms';
import { JSObject } from '../../utils';
import { takeUntil, tap, distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { PhoneNumberValidator } from './validators';

@Component({
  selector: 'app-intl-tel-input',
  templateUrl: './intl-tel-input.component.html',
  styleUrls: ['./intl-tel-input.component.css'],
  providers: [],
})
export class IntlTelInputComponent implements OnInit, OnDestroy {
  public phoneControl!: FormControl;
  @Input() control!: FormControl;
  @Output() controlChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() required = false;
  @Input() allowDropdown = true;
  @Input() initialCountry!: string;
  @Input() controlClass!: string;
  @Input() preferredCountries: Array<string> = [];
  @ViewChild('phoneControlElement', { static: true })
  phoneControlElement!: ElementRef;
  @ViewChild('clrDropdown', { static: true }) clrDropdown!: ElementRef;

  @Input() tabIndex?: number;
  @Input() label?: string;

  allCountries: Array<Country> = [];
  preferredCountriesInDropDown: Array<Country> = [];
  selectedCountry: Country = {} as Country;

  private _destroy$ = new Subject<void>();

  @Input() set disabled(value: boolean) {
    this._disableState$.next({ disabled: value || false });
  }
  private _disableState$ = new BehaviorSubject({ disabled: false });
  disableState$ = this._disableState$.pipe(
    tap((state) => {
      if (
        state.disabled &&
        this.phoneControl.status.toLowerCase() !== 'disabled'
      ) {
        this.phoneControl.disable({ onlySelf: true });
      }
      if (
        !state.disabled &&
        this.phoneControl.status.toLowerCase() === 'disabled'
      ) {
        this.phoneControl.enable({ onlySelf: true });
      }
    })
  );

  constructor(private service: IntlTelInputService) {
    this.allCountries = this.service.fetchCountries()
      ? this.service.fetchCountries()
      : [];
  }

  ngOnInit(): void {
    if (this.preferredCountries.length > 0) {
      this.preferredCountries.forEach((iso2) => {
        const preferredCountry = this.allCountries.filter((c) => {
          return c.iso2 === iso2;
        });
        // tslint:disable-next-line:no-unused-expression
        preferredCountry[0]
          ? this.preferredCountriesInDropDown.push(preferredCountry[0])
          : // tslint:disable-next-line:no-unused-expression
            null;
      });
    }
    const isControlDisabled = this.control.status.toLowerCase() === 'disabled';
    this._initializePhoneNumberControl(isControlDisabled);
    if (this.control.status.toLowerCase() === 'disabled') {
      this._disableState$.next({ disabled: true });
    }
    // Set the preferred countries
    this.phoneControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this._destroy$))
      .subscribe((state) => {
        if (JSObject.isEmpty(state)) {
          this.control.setErrors({ invalidPhoneNumber: null });
          // Set the control value to null
          this.control.setValue(null);
        }
        if (state) {
          this.setControlValue(this.selectedCountry.dialCode, state);
        }
      });
    this.control.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this._destroy$))
      .subscribe((state) => {
        if (this.control.status.toLowerCase() === 'disabled') {
          this._disableState$.next({ disabled: true });
        } else {
          this._disableState$.next({ disabled: false });
        }
        if (typeof state !== 'undefined' && state !== null) {
          this.setPhoneControlValue(state);
        } else {
          this.phoneControl.setValue(null);
        }
      });
  }

  public onCountrySelect(country: Country): void {
    this.selectedCountry = country;
    this.setControlValue(
      country.dialCode,
      this.phoneControl.value ? this.phoneControl.value : ''
    );
    this.phoneControlElement.nativeElement.focus();
  }

  public onInputKeyPress(event: any): void {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  private _initializePhoneNumberControl(isControlDisabled = false): void {
    this.phoneControl = new FormControl({
      value: null,
      disabled: isControlDisabled,
    });
    // Set the initial country to show
    if (
      typeof this.control.value !== 'undefined' &&
      this.control.value !== null
    ) {
      this.setPhoneControlValue(this.control.value.toString());
    } else if (this.initialCountry) {
      const initCountry = this.allCountries.filter((c: Country) => {
        return c.iso2 === this.initialCountry;
      });
      this.selectedCountry = initCountry[0];
    } else {
      if (this.preferredCountriesInDropDown.length > 0) {
        this.selectedCountry = this.preferredCountriesInDropDown[0];
      } else {
        this.selectedCountry = this.allCountries[0];
      }
    }
    // Setting validators on a control
    const validators: Array<ValidatorFn> = [
      PhoneNumberValidator.ValidatePhoneNumber,
    ];
    if (this.required) {
      validators.push(Validators.required);
    }
    this.control.setValidators(validators);
    this.control.updateValueAndValidity({ onlySelf: true });
  }

  private setControlValue(dialCode: string, phoneNumber: string): void {
    if (this.control.value === `${dialCode}${phoneNumber}`) {
      return;
    }
    this.control.setValue(
      `${dialCode}${phoneNumber?.replace(/[\s\t\/\+\-]/g, '')}`
    );
  }

  setPhoneControlValue(value: string): void {
    const controlState = value;
    const tmpCountryCode = this.service.getCountryCode(controlState);
    if (tmpCountryCode) {
      this.selectedCountry = this.allCountries.filter((c: Country) => {
        return c.dialCode === tmpCountryCode.toString();
      })[0];
      if (this.selectedCountry) {
        const shortPhoneNumber = String(controlState).substring(
          this.selectedCountry.dialCode.length
        );
        const phoneControlValue = this.phoneControl.value?.replace(
          /[\s\t\/\+\-]/g,
          ''
        );
        // Update the phone control value only
        // if it previous value is not equals to the new value
        if (shortPhoneNumber !== phoneControlValue) {
          this.phoneControl.setValue(shortPhoneNumber);
        }
      }
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this.allCountries = [];
  }
}
