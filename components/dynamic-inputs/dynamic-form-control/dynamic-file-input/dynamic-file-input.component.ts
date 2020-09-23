import { Component, OnInit, Input, ViewChild, Inject, Output, EventEmitter } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { isDefined } from '../../../../utils/types/type-utils';
import { DropzoneComponent } from '../../../dropzone/dropzone.component';
import { readFileAsDataURI } from '../../../../utils/browser/browser';
import { DynamicInputTypeHelper } from '../input-type.service';
import { IHTMLFormControl } from '../../core/contracts/dynamic-input';
import { FileInput } from '../../core';
import { FileFormControl } from '../dynamic-form-control.component';
import { Log } from '../../../../utils/logger';

@Component({
  selector: 'app-dynamic-file-input',
  templateUrl: './dynamic-file-input.component.html',
  styles: [
    `
    .required-text,
    .field-has-error {
      color: rgb(241, 50, 50);
    }

    .clr-input-wrapper .clr-input:disabled {
      background: rgba(244, 244, 244, .3);
    }
    `
  ]
})
export class DynamicFileInputComponent implements OnInit {

  @Input() control: AbstractControl;
  @Input() showLabelAndDescription = true;

  // Property for handling File Input types
  public dropzoneConfigs: DropzoneConfigInterface;
  public dropzoneConfig: DropzoneConfigInterface;
  @ViewChild('dropzoneContainer', { static: false })
  dropzoneContainer: DropzoneComponent;
  // Configuration parameters of the input
  @Input() inputConfig: IHTMLFormControl;

  @Output() addedEvent = new EventEmitter<any>();
  @Output() removedEvent = new EventEmitter<any>();

  constructor(
    public readonly inputTypeHelper: DynamicInputTypeHelper,
    @Inject('FILE_STORE_PATH') private path: string
  ) { }

  ngOnInit(): void {
    this.dropzoneConfigs = {
      maxFiles: this.inputTypeHelper.asFileInput(this.inputConfig).multiple ? 50 : 1,
      maxFilesize: this.inputTypeHelper.asFileInput(
        this.inputConfig).maxFileSize ? this.inputTypeHelper.asFileInput(this.inputConfig).maxFileSize : 10,
      url: isDefined(this.inputTypeHelper.asFileInput(
        this.inputConfig).uploadUrl) && this.inputTypeHelper.asFileInput(this.inputConfig).uploadUrl !== '' ?
        this.inputTypeHelper.asFileInput(this.inputConfig).uploadUrl : this.path,
      uploadMultiple: this.inputTypeHelper.asFileInput(
        this.inputConfig).multiple ? this.inputTypeHelper.asFileInput(this.inputConfig).multiple : false,
      acceptedFiles: this.inputTypeHelper.asFileInput(
        this.inputConfig).pattern ? this.inputTypeHelper.asFileInput(this.inputConfig).pattern : 'image/*'
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

  // Files Handlers event method
  // tslint:disable-next-line: typedef
  async onDropzoneFileAdded() {
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
      this.addedEvent.emit(this.control.value);
    }, 50);
  }

  // tslint:disable-next-line: typedef
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
    this.removedEvent.emit();
  }
}
