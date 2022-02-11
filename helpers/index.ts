
export { DynamicControlParser } from './dynamic-control-parser';
export { IFileRessource, FileHelperService } from './file-helper.service';
export { TranslatorHelperService } from './translator-helper';
export { TypeUtilHelper } from './type-utils-helper';


// Removes if not being used
export interface ToExcelHeaderEventArgs {
  data: object[];
  headers: { [index: string]: string };
  datefield?: string[];
}