import { ArrayUtils, MomentUtils, isDefined } from '../../../utils';
import {
  IHTMLFormControl,
  SelectInput,
  PasswordInput,
  CheckBoxInput,
  DateInput,
  TextInput,
  RadioInput,
  TextAreaInput,
  NumberInput,
  PhoneInput,
  InputTypes,
  RadioItem,
  CheckboxItem,
  ISelectItem,
  FileInput,
  HMTLInput
} from '../core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AbstractControl, FormArray } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { environment } from '../../../../../../environments/environment';
import { DropzoneComponent } from '../../dropzone/dropzone.component';
import { readFileAsDataURI } from '../../../utils/browser';

export interface FileFormControl {
  uuid: string;
  dataURL: string;
  extension?: string;
  type?: string;
}
@Component({
  selector: 'app-dynamic-inputs',
  templateUrl: './dynamic-form-control.component.html',
  styleUrls: ['./dynamic-form-control.component.css']
})
export class DynamicFormControlComponent implements OnInit, OnDestroy {
  // Formcontrol injected from the parent controller
  @Input() control: AbstractControl;
  @Input() listenForChanges: boolean;
  @Input() showLabelAndDescription = true;
  // private controlSubscription: Subscription;
  // Event emitter emitted when the value of the input changes
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() multiSelectItemRemove = new EventEmitter<any>();
  // Configuration parameters of the input
  @Input() inputConfig: IHTMLFormControl;
  @Input() listItems:
    | Observable<Array<ISelectItem | CheckboxItem | RadioItem>>
    | Array<ISelectItem | CheckboxItem | RadioItem>;
  // Enumeration of input types
  public inputTypes = InputTypes;
  // String representation of today
  public today: string;
  public formArrayGroup: FormGroup;
  public showPassword = true;

  // Property for handling File Input types
  public dropzoneConfigs: DropzoneConfigInterface;
  public dropzoneConfig: DropzoneConfigInterface;
  @ViewChild('dropzoneContainer', { static: false })
  dropzoneContainer: DropzoneComponent;

  @Output() fileAdded = new EventEmitter<any>();
  @Output() fileRemoved = new EventEmitter<any>();

  @Output() inputKeyUp = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputKeyDown = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputKeypress = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputBlur = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputFocus = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputFelect = new EventEmitter<{ formcontrolname: string, value: any }>();

  constructor(private builder: FormBuilder) { }

  ngOnInit() {
    this.today = MomentUtils.parseDate();
    if (this.inputConfig.type === InputTypes.FILE_INPUT) {
      this.dropzoneConfigs = {
        maxFiles: this.asFileInput(this.inputConfig).multiple ? 50 : 1,
        maxFilesize: this.asFileInput(this.inputConfig).maxFileSize ? this.asFileInput(this.inputConfig).maxFileSize : 10,
        url: isDefined(this.asFileInput(this.inputConfig).uploadUrl) && this.asFileInput(this.inputConfig).uploadUrl !== '' ?
          this.asFileInput(this.inputConfig).uploadUrl : environment.apiFileUploadURL,
        uploadMultiple: this.asFileInput(this.inputConfig).multiple ? this.asFileInput(this.inputConfig).multiple : false,
        acceptedFiles: this.asFileInput(this.inputConfig).pattern ? this.asFileInput(this.inputConfig).pattern : 'image/*'
      };
      this.control.valueChanges.subscribe((state) => {
        if (this.control.status.toLowerCase() === 'disabled') {
          this.dropzoneContainer.disabled = true;
        } else {
          this.dropzoneContainer.disabled = false;
        }
        if (!isDefined(state)) {
          this.dropzoneContainer.resetDropzone();
        }
      });
    }
    if (
      this.inputConfig &&
      this.inputConfig.type === InputTypes.CHECKBOX_INPUT &&
      (this.inputConfig as CheckBoxInput).items.length > 0
    ) {
      this.formArrayGroup = this.builder.group({
        formGroupItems: this.control
      });
    }
    if (this.listenForChanges) {
      this.control.valueChanges.subscribe((value) => {
        this.valueChange.emit(value);
      });
    }
  }

  /**
   * @description Return an abstract control as a [[FormArray]]
   * @param control [[AbstractControl]]
   */
  public asFormArray(control: AbstractControl): FormArray {
    return control as FormArray;
  }

  /**
   * @description Returns a dynamic input configuration as a [[SelectInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asSelectInput(input: IHTMLFormControl): SelectInput {
    return input as SelectInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[DateInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asDateInput(input: IHTMLFormControl): DateInput {
    return input as DateInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[CheckBoxInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asCheckBoxInput(input: IHTMLFormControl): CheckBoxInput {
    return input as CheckBoxInput;
  }

  /**
   * @description Returns a dynamic input configuration as a [[RadioInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asRadioInput(input: IHTMLFormControl): RadioInput {
    return input as RadioInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[PasswordInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asPasswordInput(input: IHTMLFormControl): PasswordInput {
    return input as PasswordInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[TextInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asTextInput(input: IHTMLFormControl): TextInput {
    return input as TextInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[TextAreaInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asTextAreaInput(input: IHTMLFormControl): TextAreaInput {
    return input as TextAreaInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[NumberInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asNumberInput(input: IHTMLFormControl): NumberInput {
    return input as NumberInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[TextInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asEmailInput(input: IHTMLFormControl): TextInput {
    return input as TextInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[FileInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asFileInput(input: IHTMLFormControl): FileInput {
    return input as FileInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[HTMLInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asHtmlInput(input: IHTMLFormControl): HMTLInput {
    return input as HMTLInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[PhoneInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asPhoneInput(input: IHTMLFormControl): PhoneInput {
    return input as PhoneInput;
  }

  public togglePassWordInput() {
    this.showPassword = !this.showPassword;
  }

  isArray(listItems: Observable<any[]> | any[]) {
    return ArrayUtils.isArray(listItems);
  }

  asObservable(listItems: any): Promise<any> {
    return listItems as Promise<any>;
  }

  radioButtonValueChange(event: any) {
    this.control.setValue(event);
  }

  maxNumberSize() {
    return Math.pow(2, 31) - 1;
  }

  // Files Handlers event method
  async onDropzoneFileAdded(event: any | any[]) {
    setTimeout(async () => {
      const files = this.dropzoneContainer.dropzone().getAcceptedFiles();
      if ((this.inputConfig as FileInput).multiple) {
        this.control.setValue(await Promise.all(
          (files as any[]).map(async (v) => {
            return {
              uuid: v.upload.uuid,
              dataURL: await readFileAsDataURI(v),
              extension: (v.name as string).split('.')[(v.name as string).split('.').length - 1]
            } as FileFormControl;
          })
        ));
      } else {
        this.control.setValue(
          {
            uuid: files[0].upload.uuid,
            dataURL: await readFileAsDataURI(files[0]),
            extension: (files[0].name as string).split('.')[(files[0].name as string).split('.').length - 1]
          } as FileFormControl
        );
        this.dropzoneContainer.disabled = true;
      }
      this.fileAdded.emit(this.control.value);
    }, 100);
  }

  onDropzoneFileRemoved(event: any) {
    if ((this.inputConfig as FileInput).multiple) {
      if (isDefined(this.control.value)) {
        this.control.setValue((this.control.value as FileFormControl[]).filter((v) => {
          return v.uuid !== event.upload.uuid;
        }));
      }
    } else {
      this.control.setValue(null);
    }
    // Enable the dropzpone if an item is removed from the dropzone and not supporting multiple upload
    if (!(this.inputConfig as FileInput).multiple) {
      this.dropzoneContainer.disabled = false;
    }
    this.fileRemoved.emit();
  }

  uniqueID(prefix: string) {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return prefix + '_' + Math.random().toString(36).substr(2, 9);
  }

  getErrorAsNumber(value: object | number, key: string = null) {
    return typeof value === 'number' ? value : value[key];
  }

  onDateInputBlur() {
    const locale = MomentUtils.locale();
    if (isDefined(this.control.value)) {
      const value: string = this.control.value as string;
      if ((value === '') || (value.length === 0)) {
        this.control.setValue(null);
        return;
      }
      const match = (value.match( locale.match(/fr/) ? /(0*([1-9]|[12][0-9]|3[01]))\/(0*([1-9]|1[0-2]))\/\d{4}/ : /(0*([1-9]|1[0-2]))\/(0*([1-9]|[12][0-9]|3[01]))\/\d{4}/));
      if (!isDefined(match)) {
        // tslint:disable-next-line: max-line-length
        const output: { days: string, month: string, year: string } = { days: value.substr(0, 2), month: value.substr(2, 2), year: value.substr(4) };
        if (locale.match(/fr/)) {
          this.control.setValue(`${output.days}/${output.month}/${output.year}`);
        } else {
          this.control.setValue(`${output.month}/${output.days}/${output.year}`);
        }
      }
    }
  }

  onDzThumbnail() { }

  ngOnDestroy() { }
}
