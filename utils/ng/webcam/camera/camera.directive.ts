import { Directive, ElementRef, OnDestroy } from "@angular/core";
import { Log } from "../../../logger";

@Directive({
  selector: "drewlabsCamera",
})
export class CameraDirective implements OnDestroy {

  public constructor(private element: ElementRef) {
    if (element.nativeElement instanceof HTMLVideoElement) {
      throw new Error(
        "Invalid Element reference, This directive require an HTML Video Element"
      );
    } else {
      Log(this.element.nativeElement);
    }
  }

  ngOnDestroy(): void {
    // Provide destruction implementation to the component
  }
}
