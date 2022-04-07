import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Inject,
  Output,
  EventEmitter,
  OnDestroy,
  Optional,
} from '@angular/core';
import { InputTypeHelper } from '../../services';
import { map } from 'rxjs/operators';
import { DropzoneComponent } from '../../../../dropzone/dropzone.component';
import { createSubject } from '../../../../../rxjs/helpers';
import { FileInput } from '../../../core';
import { DropzoneConfig } from '../../../../dropzone';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ngx-smart-file-input',
  templateUrl: './file-input.component.html',
  styles: [],
})
export class FileInputComponent implements OnInit, OnDestroy {
  @Input() control!: FormControl;
  @Input() showLabelAndDescription = true;

  // Property for handling File Input types
  public dropzoneConfigs!: DropzoneConfig;
  // public dropzoneConfig!: DropzoneConfig;
  @ViewChild('dropzoneContainer')
  dropzoneContainer!: DropzoneComponent;
  // Configuration parameters of the input
  @Input() inputConfig!: FileInput;

  @Output() addedEvent = new EventEmitter<any>();
  @Output() removedEvent = new EventEmitter<any>();

  private _destroy$ = createSubject<void>();

  constructor(
    public readonly inputType: InputTypeHelper,
    @Inject('FILE_STORE_PATH') @Optional() private path: string
  ) {}

  ngOnInit(): void {
    const config = this.inputType.asFileInput(this.inputConfig);
    this.dropzoneConfigs = {
      maxFiles: config.multiple ? 50 : 1,
      maxFilesize: config.maxFileSize ? config.maxFileSize : 10,
      url:
        typeof config.uploadUrl !== 'undefined' &&
        config !== null &&
        config.uploadUrl !== ''
          ? config.uploadUrl
          : this.path ?? '',
      uploadMultiple: config.multiple ? config.multiple : false,
      acceptedFiles: config.pattern,
    };
    this.control.valueChanges.pipe(
      map((state) => {
        if (this.control.status.toLowerCase() === 'disabled') {
          this.dropzoneContainer.disabled = true;
        } else {
          this.dropzoneContainer.disabled = false;
        }
        if (typeof state !== 'undefined') {
          this.dropzoneContainer.resetDropzone();
        }
      })
    );
  }

  // Files Handlers event method
  // tslint:disable-next-line: typedef
  async onDropzoneFileAdded() {
    setTimeout(async () => {
      const files = this.dropzoneContainer.dropzone().getAcceptedFiles();
      if ((this.inputConfig as FileInput).multiple) {
        this.control.setValue(
          await Promise.all(
            (files as any[]).map(async (current) => {
              return {
                uuid: current.upload.uuid,
                dataURL: await this.readBlobAsDataURL(current),
                extension:
                  current.name.split('.')[current.name.split('.').length - 1],
              };
            })
          )
        );
      } else {
        const file = files[0];
        if (file) {
          this.control.setValue({
            uuid: files[0].upload.uuid,
            dataURL: await this.readBlobAsDataURL(files[0]),
            extension: (files[0].name as string).split('.')[
              (files[0].name as string).split('.').length - 1
            ],
          });
          this.dropzoneContainer.disabled = true;
        }
      }
      this.addedEvent.emit(this.control.value);
    }, 50);
  }

  // tslint:disable-next-line: typedef
  onDropzoneFileRemoved(event: any) {
    if ((this.inputConfig as FileInput).multiple) {
      if (
        typeof this.control.value !== 'undefined' &&
        this.control.value !== null
      ) {
        this.control.setValue(
          (this.control.value as { [prop: string]: any }[]).filter((v) => {
            return v['uuid'] !== event.upload.uuid;
          })
        );
      }
    } else {
      this.onResetControlValue();
    }
    // Enable the dropzpone if an item is removed from the dropzone and not supporting multiple upload
    if (!(this.inputConfig as FileInput).multiple) {
      this.dropzoneContainer.disabled = false;
    }
    this.removedEvent.emit();
  }

  onHTMLInputLargeFileEvent(event: File | File[]) {
    // TODO: Add error to formcontrol
  }

  async onHTMLInputAcceptFilesChange(event: File | File[]) {
    if (Array.isArray(event)) {
      this.control!.setValue(
        await Promise.all(
          event.map(async (state) => await this.createControlValue(state))
        )
      );
    } else {
      this.control!.setValue(await this.createControlValue(event));
    }
    this.addedEvent.emit(this.control.value);
  }

  onResetControlValue() {
    this.control.reset();
  }

  private makeFakeUUIDV4() {
    const rand = Math.random;
    function substr(str: string, offset: number, length: number) {
      return str.substring(offset, Math.min(str.length, offset + length));
    }
    let nbr: number;
    let randStr = '';
    do {
      randStr += substr((nbr = rand()).toString(16), 3, 6);
    } while (randStr.length < 30);
    return `${substr(randStr, 0, 8)}-${substr(randStr, 8, 4)}-${substr(
      randStr,
      12,
      3
    )}-${(((nbr * 4) | 0) + 8).toString(16) + substr(randStr, 15, 3)}-${substr(
      randStr,
      18,
      12
    )}`;
  }

  private readBlobAsDataURL(content: Blob) {
    return new Promise<string | undefined>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<any>) => {
        if (e.target) {
          return resolve(e.target.result.toString());
        }
        resolve(undefined);
      };
      reader.readAsDataURL(content);
    });
  }

  private async createControlValue(state: File) {
    return {
      uuid: this.makeFakeUUIDV4(),
      dataURL: await this.readBlobAsDataURL(state),
      extension: (state.name as string).split('.')[
        state.name.split('.').length - 1
      ],
      size: state.size,
      lastModified: state.lastModified,
    };
  }

  ngOnDestroy() {
    this._destroy$.next();
  }
}
