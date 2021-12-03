import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Inject,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { isDefined, readFileAsDataURI } from "../../../../../utils";
import { DynamicInputTypeHelper } from "../../services";
import { map } from "rxjs/operators";
import { DropzoneComponent } from "../../../../dropzone/dropzone.component";
import { createSubject } from "../../../../../rxjs/helpers";
import { FileInput } from "../../../core/types";
import { DropzoneConfig } from "../../../../dropzone";
import { FileFormControl } from "../../types";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-dynamic-file-input",
  templateUrl: "./dynamic-file-input.component.html",
  styles: [
    `
      .required-text,
      .field-has-error {
        color: rgb(241, 50, 50);
      }
      .clr-input-wrapper .clr-input:disabled {
        background: rgba(244, 244, 244, 0.3);
      }
      .clr-control-label {
        margin-bottom: 0.5rem;
      }
    `,
  ],
})
export class DynamicFileInputComponent implements OnInit, OnDestroy {
  @Input() controlDivContainerClass: string = "clr-form-control";
  @Input() control!: FormControl;
  @Input() showLabelAndDescription = true;

  // Property for handling File Input types
  public dropzoneConfigs!: DropzoneConfig;
  // public dropzoneConfig!: DropzoneConfig;
  @ViewChild("dropzoneContainer")
  dropzoneContainer!: DropzoneComponent;
  // Configuration parameters of the input
  @Input() inputConfig!: FileInput;

  @Output() addedEvent = new EventEmitter<any>();
  @Output() removedEvent = new EventEmitter<any>();

  private _destroy$ = createSubject();

  constructor(
    public readonly inputType: DynamicInputTypeHelper,
    @Inject("FILE_STORE_PATH") private path: string
  ) {}

  ngOnInit(): void {
    this.dropzoneConfigs = {
      maxFiles: this.inputConfig.multiple ? 50 : 1,
      maxFilesize: this.inputConfig.maxFileSize
        ? this.inputConfig.maxFileSize
        : 10,
      url:
        isDefined(this.inputType.asFileInput(this.inputConfig).uploadUrl) &&
        this.inputConfig.uploadUrl !== ""
          ? this.inputConfig.uploadUrl
          : this.path,
      uploadMultiple: this.inputConfig.multiple
        ? this.inputConfig.multiple
        : false,
      acceptedFiles: this.inputConfig.pattern,
    };
    this.control.valueChanges.pipe(
      map((state) => {
        if (this.control.status.toLowerCase() === "disabled") {
          this.dropzoneContainer.disabled = true;
        } else {
          this.dropzoneContainer.disabled = false;
        }
        if (!isDefined(state)) {
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
            (files as any[]).map(async (v) => {
              return {
                uuid: v.upload.uuid,
                dataURL: await readFileAsDataURI(v),
                extension: (v.name as string).split(".")[
                  (v.name as string).split(".").length - 1
                ],
              } as FileFormControl;
            })
          )
        );
      } else {
        const file = files[0];
        if (file) {
          this.control.setValue({
            uuid: files[0].upload.uuid,
            dataURL: await readFileAsDataURI(files[0]),
            extension: (files[0].name as string).split(".")[
              (files[0].name as string).split(".").length - 1
            ],
          } as FileFormControl);
          this.dropzoneContainer.disabled = true;
        }
      }
      this.addedEvent.emit(this.control.value);
    }, 50);
  }

  // tslint:disable-next-line: typedef
  onDropzoneFileRemoved(event: any) {
    if ((this.inputConfig as FileInput).multiple) {
      if (isDefined(this.control.value)) {
        this.control.setValue(
          (this.control.value as FileFormControl[]).filter((v) => {
            return v.uuid !== event.upload.uuid;
          })
        );
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

  ngOnDestroy() {
    this._destroy$.next();
  }
}
