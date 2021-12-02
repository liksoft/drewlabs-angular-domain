import { isDefined } from "../../utils";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
  OnDestroy,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { DropzoneEvents, DropzoneEvent } from "./dropzone-interfaces";
import { DropzoneService } from "./dropzone.service";
import { createSubject, createStateful, timeout } from "../../rxjs/helpers";
import { isEmpty } from "lodash";
import { DropzoneDirective } from "./dropzone.directive";
import { DropzoneConfig } from "./types";

@Component({
  selector: "app-dropzone",
  template: `
    <ng-container *ngIf="defaults$ | async as defaults">
      <div
        class="dropzone-wrapper"
        [class.disabled]="disabled"
        [class]="class"
        [class.dropzone]="useDropzoneClass"
        [dropzone]="defaults"
        [disabled]="disabled"
        (init)="DZ_INIT.emit($event)"
        (error)="onUploadError()"
        (success)="onUploadSuccess()"
      >
        <div
          class="dz-message"
          [class.disabled]="disabled"
          [class.dz-placeholder]="placeholder"
        >
          <div class="text-center dz-upload-btn">
            <clr-icon shape="upload-cloud"></clr-icon>
          </div>
          <span>{{ dragFileText }}</span>
          <span class="dz-text">
            <a href="javascript:undefined;">{{
              defaults?.dictDefaultMessage ?? defaultMessage
            }}</a>
          </span>
          <span> {{ uploadFileText }}</span>
          <div
            *ngIf="placeholder"
            class="dz-image"
            [style.background-image]="getPlaceholder()"
          ></div>
        </div>
        <ng-content></ng-content>
      </div>
    </ng-container>
  `,
  styleUrls: [
    "./dropzone-wrapper.component.scss",
    "./dropzone.component.scss",
    // "~dropzone/dist/min/dropzone.min.css"
  ],
})
export class DropzoneComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DropzoneDirective, { static: false })
  dropzoneDirective!: DropzoneDirective;

  @Input() defaultMessage!: string;
  @Input() dragFileText!: string;
  @Input() uploadFileText!: string;
  @Input() dropzoneConfig!: DropzoneConfig;
  @Input() messageLabel = "browse";
  @Input() placeholder!: string;
  @Input() useDropzoneClass = true;
  @Input() disabled = false;
  @Input() previewFileIcon = "fa fa-file-alt";
  @Input() acceptedFilesTypeName!: string;
  private _class!: string;
  @Input() set class(value: string) {
    value = value ? `${value.replace("clr-input", "")}` : "";
    this._class = !isEmpty(value)
      ? `${value.replace("clr-input", "")}`
      : "dz-wrapper";
  } //  inline-input

  get class() {
    return this._class;
  }

  // #region Output properties
  // tslint:disable-next-line: no-output-rename
  @Output("init") DZ_INIT = new EventEmitter<any>();

  // tslint:disable-next-line: no-output-rename
  // tslint:disable-next-line: no-output-native
  // tslint:disable-next-line: no-output-rename
  @Output("error") DZ_ERROR = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  // tslint:disable-next-line: no-output-native
  @Output("success") DZ_SUCCESS = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("sending") DZ_SENDING = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("canceled") DZ_CANCELED = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("complete") DZ_COMPLETE = new EventEmitter<any>();
  @Output("processing") DZ_PROCESSING = new EventEmitter<any>();

  // tslint:disable-next-line: no-output-rename
  @Output("drop") DZ_DROP = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("dragStart") DZ_DRAGSTART = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("dragEnd") DZ_DRAGEND = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("dragEnter") DZ_DRAGENTER = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("dragOver") DZ_DRAGOVER = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("dragLeave") DZ_DRAGLEAVE = new EventEmitter<any>();

  // tslint:disable-next-line: no-output-rename
  @Output("thumbnail") DZ_THUMBNAIL = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("addedFile") DZ_ADDEDFILE = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("addedFiles") DZ_ADDEDFILES = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("removedFile") DZ_REMOVEDFILE = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("uploadProgress") DZ_UPLOADPROGRESS = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("maxFilesReached") DZ_MAXFILESREACHED = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("maxFilesExceeded") DZ_MAXFILESEXCEEDED = new EventEmitter<any>();

  // tslint:disable-next-line: no-output-rename
  @Output("errorMultiple") DZ_ERRORMULTIPLE = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("successMultiple") DZ_SUCCESSMULTIPLE = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("sendingMultiple") DZ_SENDINGMULTIPLE = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("canceledMultiple") DZ_CANCELEDMULTIPLE = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("completeMultiple") DZ_COMPLETEMULTIPLE = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("processingMultiple") DZ_PROCESSINGMULTIPLE = new EventEmitter<any>();

  // tslint:disable-next-line: no-output-rename
  // tslint:disable-next-line: no-output-native
  @Output("reset") DZ_RESET = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("queueComplete") DZ_QUEUECOMPLETE = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output("totalUploadProgress") DZ_TOTALUPLOADPROGRESS =
    new EventEmitter<any>();

  // tslint:disable-next-line: variable-name
  private _config = createStateful<DropzoneConfig | undefined>(undefined);
  defaults$ = this._config.asObservable();
  // tslint:disable-next-line: variable-name
  private _destroy$ = createSubject();

  constructor(
    @Inject(PLATFORM_ID) private platform: object,
    private service: DropzoneService
  ) {}

  // tslint:disable-next-line: typedef
  dropzone() {
    return this.dropzoneDirective.dropzone();
  }

  // tslint:disable-next-line: typedef
  public resetDropzone() {
    this.dropzoneDirective.reset();
  }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.dropzoneConfig = this.service.dzDefaultConfig(
      this.dropzoneConfig,
      this.acceptedFilesTypeName || undefined
    );
    if (!isDefined(this.dropzoneConfig)) {
      this._config.next({
        ...{},
        previewTemplate: this.service.dzDefaultPreviewTemplate(
          this.previewFileIcon
        ),
      } as DropzoneConfig);
    } else if (
      isDefined(this.dropzoneConfig) &&
      !isDefined(this.dropzoneConfig.previewTemplate)
    ) {
      this._config.next({
        ...this.dropzoneConfig,
        previewTemplate: this.service.dzDefaultPreviewTemplate(
          this.dropzoneConfig.acceptedFiles &&
            this.dropzoneConfig.acceptedFiles.indexOf("image/*") !== -1
            ? "fa fa-image"
            : this.previewFileIcon
        ),
      } as DropzoneConfig);
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platform)) {
      return;
    }
    timeout(() => {
      DropzoneEvents.forEach((event: DropzoneEvent) => {
        if (this.dropzoneDirective) {
          const output = `DZ_${event.toUpperCase()}`;
          this.dropzoneDirective.setEmitter(
            output as keyof DropzoneDirective,
            this[output as keyof DropzoneComponent] as EventEmitter<any>
          );
        }
      });
    }, 0);
  }

  /**
   * @description Handle file upload successfully
   */
  // tslint:disable-next-line: typedef
  onUploadError() {}

  /**
   * @description Handle file upload with error
   */
  // tslint:disable-next-line: typedef
  onUploadSuccess() {}

  public getPlaceholder(): string {
    return "url(" + encodeURI(this.placeholder) + ")";
  }

  // tslint:disable-next-line: typedef
  ngOnDestroy() {
    this._destroy$.next();
  }
}
