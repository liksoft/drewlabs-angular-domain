import { Inject, Injectable, Optional } from "@angular/core";
import { isDefined } from "../../utils";
import { DropzoneConfig, DropzoneDict, DROPZONE_DICT } from "./types";

@Injectable()
export class DropzoneService {
  constructor(
    @Inject(DROPZONE_DICT) @Optional() private dictionary?: DropzoneDict
  ) {}

  // tslint:disable-next-line: typedef
  public dzDefaultPreviewTemplate(clazz: string = "fa fa-file-alt") {
    return `
    <div>
      <section class="drop-zone-file-container">
        <i class="${clazz} preview-file-icon"></i>
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

  // tslint:disable-next-line: typedef
  public dzDefaultConfig = (
    config: DropzoneConfig,
    acceptedFilesTypeName: string = "images"
  ) =>
    ({
      ...config,
      // tslint:disable-next-line:ban-types
      accept: (file: File, done: Function) => {
        let matches = false;
        if (!isDefined(config.acceptedFiles) || config.acceptedFiles === "*") {
          matches = true;
        } else if (
          isDefined(config.acceptedFiles) &&
          config.acceptedFiles?.indexOf(",") !== -1
        ) {
          let types = config?.acceptedFiles?.split(",");
          types = types?.filter((v) => file.type.match(v));
          matches = types?.length !== 0 ? true : false;
        } else {
          matches = config.acceptedFiles
            ? file.type.match(config.acceptedFiles)?.length !== 0
            : true;
        }
        if (!matches) {
          done(
            `${
              this.dictionary?.dictAcceptedFiles || ""
            } ${acceptedFilesTypeName}`
          );
        } else {
          done();
        }
      },
      ...(this.dictionary || {}),
    } as DropzoneConfig);
}
