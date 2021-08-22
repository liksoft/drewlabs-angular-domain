import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "masked",
})
export class MaskedContentPipe implements PipeTransform {

  /**
   * Returns the masked content
   *
   * @param value
   * @param length
   */
  transform(value: string, length: number = 5): string {
    return value ? `*******${value?.substr(-length)}` : "*******";
  }
}
