import { isDefined, WindowRef } from '../../utils';
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
  OnDestroy
} from '@angular/core';
import {
  DropzoneConfigInterface,
  DropzoneDirective
} from 'ngx-dropzone-wrapper';
import { isPlatformBrowser } from '@angular/common';
import {
  DropzoneEvents,
  DropzoneEvent
} from './dropzone-interfaces';
import { DropzoneService } from './dropzone.service';
import { createSubject, createStateful } from '../../rxjs/helpers/index';
import { takeUntil } from 'rxjs/operators';
import { Log } from '../../utils/logger';

@Component({
  selector: 'app-dropzone',
  template: `
    <ng-container *ngIf="localConfigs$ | async as localConfigs">
    <div
      [class.disabled]="disabled"
      class="dz-wrapper"
      [class.dropzone]="useDropzoneClass"
      [dropzone]="localConfigs"
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
        <span>{{ "dragFileLabel" | translate }}</span>
        <span class="dz-text">
          <a href="javascript:undefined;">{{
            localConfigs?.dictDefaultMessage || (messageLabel | translate)
          }}</a>
        </span>
        <span> {{ "uploadFileLabel" | translate }}</span>
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
  styles: [
    `
      /* Drew Dropzone design */

      .dropzone.dz-wrapper {
        /* position: relative !important;
        overflow: auto !important;
        min-height: 120px !important;
        border-top: 2px dashed #338bca;
        border-left: 2px dashed #338bca;
        border-right: 2px dashed #338bca;
        color: #666 !important;
        text-align: center !important;
        background-color: #e6f2fb !important;
        margin: 0px !important;
        padding: 10px;*/

        position: relative !important;
        overflow: auto !important;
        min-height: 120px !important;
        border-top: 2px dashed #d4d9dc;
        border-left: 2px dashed #d4d9dc;
        border-right: 2px dashed #d4d9dc;
        color: #666 !important;
        text-align: center !important;
        background-color: rgba(247, 247, 247, .8) !important;
        margin: 0px !important;
        padding: 10px;
      }

      .progress-bar {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        color: #fff;
        text-align: center;
        background-color: #bdc2c8 !important;
        transition: width 0.6s ease;
        height: 8px !important;
      }

      .progress {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        height: 8px;
        overflow: hidden;
        font-size: 0.75rem;
        background-color: #e9ecef;
        border-radius: 0.25rem;
      }

      .dropzone.dz-wrapper .dz-message {
        font-weight: 300;
        font-size: 0.649rem;
      }

      .dropzone.dz-wrapper .dz-upload-btn {
        margin-top: 16px;
        margin-bottom: -4px;
      }
      }
      .dropzone.dz-wrapper .dz-message .dz-text {
        position: relative !important;
        display: inline-block;
        padding: 10px !important;
        transform: translateY(0%) !important;
        cursor: pointer;
      }
      .disabled {
        opacity: .5;
      }
      /* End Drew Dropzone design */
    `
  ]
})
export class DropzoneComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DropzoneDirective, {static: false})
  dropzoneDirective: DropzoneDirective;

  @Input() dropzoneConfig: DropzoneConfigInterface;
  @Input() messageLabel = 'browse';
  @Input() placeholder: string;
  @Input() useDropzoneClass = true;
  @Input() disabled = false;
  @Input() previewFileIcon = 'fa fa-file-alt';
  @Input() acceptedFilesTypeName = null;

  // tslint:disable-next-line: no-output-rename
  @Output('init') DZ_INIT = new EventEmitter<any>();

  // tslint:disable-next-line: no-output-rename
  // tslint:disable-next-line: no-output-native
  // tslint:disable-next-line: no-output-rename
  @Output('error') DZ_ERROR = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  // tslint:disable-next-line: no-output-native
  @Output('success') DZ_SUCCESS = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('sending') DZ_SENDING = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('canceled') DZ_CANCELED = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('complete') DZ_COMPLETE = new EventEmitter<any>();
  @Output('processing') DZ_PROCESSING = new EventEmitter<any>();

  // tslint:disable-next-line: no-output-rename
  @Output('drop') DZ_DROP = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('dragStart') DZ_DRAGSTART = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('dragEnd') DZ_DRAGEND = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('dragEnter') DZ_DRAGENTER = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('dragOver') DZ_DRAGOVER = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('dragLeave') DZ_DRAGLEAVE = new EventEmitter<any>();

  // tslint:disable-next-line: no-output-rename
  @Output('thumbnail') DZ_THUMBNAIL = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('addedFile') DZ_ADDEDFILE = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('addedFiles') DZ_ADDEDFILES = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('removedFile') DZ_REMOVEDFILE = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('uploadProgress') DZ_UPLOADPROGRESS = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('maxFilesReached') DZ_MAXFILESREACHED = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('maxFilesExceeded') DZ_MAXFILESEXCEEDED = new EventEmitter<any>();

  // tslint:disable-next-line: no-output-rename
  @Output('errorMultiple') DZ_ERRORMULTIPLE = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('successMultiple') DZ_SUCCESSMULTIPLE = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('sendingMultiple') DZ_SENDINGMULTIPLE = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('canceledMultiple') DZ_CANCELEDMULTIPLE = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('completeMultiple') DZ_COMPLETEMULTIPLE = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('processingMultiple') DZ_PROCESSINGMULTIPLE = new EventEmitter<any>();

  // tslint:disable-next-line: no-output-rename
  // tslint:disable-next-line: no-output-native
  @Output('reset') DZ_RESET = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('queueComplete') DZ_QUEUECOMPLETE = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('totalUploadProgress') DZ_TOTALUPLOADPROGRESS = new EventEmitter<any>();

  // tslint:disable-next-line: variable-name
  private _localConfigSuject$ = createStateful<DropzoneConfigInterface>(null);
  localConfigs$ = this._localConfigSuject$.asObservable();
  // tslint:disable-next-line: variable-name
  private _destroy$ = createSubject();

  constructor(
    @Inject(PLATFORM_ID) private platform: object,
    private winRef: WindowRef,
    private componentService: DropzoneService,
  ) { }

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
    this.componentService.dzDefaultConfig(
      this.dropzoneConfig,
      this.acceptedFilesTypeName
    ).then((value) => {
      this.dropzoneConfig = value;
      if (!isDefined(this.dropzoneConfig)) {
        this._localConfigSuject$.next(Object.assign({}, {
          previewTemplate: this.componentService.dzDefaultPreviewTemplate(
            this.previewFileIcon
          )
        } as DropzoneConfigInterface));
      } else if (
        isDefined(this.dropzoneConfig) &&
        !isDefined(this.dropzoneConfig.previewTemplate)
      ) {
        this._localConfigSuject$.next(Object.assign(this.dropzoneConfig, {
          previewTemplate: this.componentService.dzDefaultPreviewTemplate(
            this.dropzoneConfig.acceptedFiles &&
              this.dropzoneConfig.acceptedFiles.indexOf('image/*') !== -1
              ? 'fa fa-image'
              : this.previewFileIcon
          )
        } as DropzoneConfigInterface));
      }
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platform)) {
      return;
    }
    this.winRef.nativeWindow.setTimeout(() => {
      DropzoneEvents.forEach((event: DropzoneEvent) => {
        if (this.dropzoneDirective) {
          const output = `DZ_${event.toUpperCase()}`;
          const dropzoneDirectiveOutput = output as keyof DropzoneDirective;
          const componentOutput = output as keyof DropzoneComponent;
          this.dropzoneDirective[dropzoneDirectiveOutput] = this[
            componentOutput
          ] as any;
        }
      });
    }, 0);
    this.DZ_MAXFILESREACHED.pipe(
      takeUntil(this._destroy$)
    ).subscribe((_) => {
      // TODO : FIRES MAXFILES REACHED EVENT
    });
  }

  /**
   * @description Handle file upload successfully
   */
  // tslint:disable-next-line: typedef
  onUploadError() { }

  /**
   * @description Handle file upload with error
   */
  // tslint:disable-next-line: typedef
  onUploadSuccess() { }

  public getPlaceholder(): string {
    return 'url(' + encodeURI(this.placeholder) + ')';
  }

  // tslint:disable-next-line: typedef
  ngOnDestroy() {
    this._destroy$.next({});
  }
}
