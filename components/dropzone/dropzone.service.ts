import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Injectable()
export class DropzoneService {

  constructor(private tranlate: TranslateService) {
  }

  public dzDefaultPreviewTemplate(fileTypeClass: string = 'fa fa-file-alt') {
    return `
    <div>
      <section class="drop-zone-file-container">
        <i class="${fileTypeClass} preview-file-icon"></i>
      </section>
      <section class="dropzone-file-info">
        <strong><span class="name margin-right8 text-bold" data-dz-name></span> <span class="size" data-dz-size></span></strong>
      </section>
      <!-- <div class="dz-success-mark"><span>✔</span></div> -->
      <!-- <div class="dz-error-mark"><span>✘</span></div> -->
      <span class="error text-danger" data-dz-errormessage></span>
    </div>
    `;
  }

  public dzDefaultConfig(config: DropzoneConfigInterface, acceptedFilesTypeName: string = 'images') {
    return new Promise((resolve, reject) => {
      this.tranlate.get([
        'dictAcceptedFilesLabel',
        'dictFallbackMessageLabel',
        'dictFileTooBigLabel',
        'dictInvalidFileTypeLabel',
        'dictCancelUploadLabel',
        'dictResponseErrorLabel',
        'dictCancelUploadConfirmationLabel',
        'dictRemoveFileConfirmationLabel',
        'dictRemoveFileLabel',
        'dictMaxFilesExceededLabel',
      ], { maxFilesize: '{{maxFilesize}}', filesize: '{{filesize}}', fileformat: acceptedFilesTypeName }).toPromise().then(translations => {
        resolve(Object.assign(config, {
          // tslint:disable-next-line:ban-types
          accept: (file: File, done: Function) => {
            if (
              config.acceptedFiles &&
              !config.acceptedFiles.includes(file.type)
            ) {
              done(`${translations.dictAcceptedFilesLabel} ${acceptedFilesTypeName}`);
            } else {
              done();
            }
          },
          dictFallbackMessage: translations.dictFallbackMessageLabel,
          dictFileTooBig: translations.dictFileTooBigLabel,
          dictInvalidFileType: `${translations.dictInvalidFileTypeLabel} ${acceptedFilesTypeName}`,
          dictResponseError: translations.dictResponseErrorLabel,
          dictCancelUpload: translations.dictCancelUploadLabel,
          dictCancelUploadConfirmation: translations.dictCancelUploadConfirmationLabel,
          dictRemoveFile: translations.dictRemoveFileLabel,
          dictRemoveFileConfirmation: translations.dictRemoveFileConfirmationLabel,
          dictMaxFilesExceeded: translations.dictMaxFilesExceededLabel,
        } as DropzoneConfigInterface));
      });
    });
  }
}
