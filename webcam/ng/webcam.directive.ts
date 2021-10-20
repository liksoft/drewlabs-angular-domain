import { Directive, ElementRef, Input, OnDestroy } from "@angular/core";
import { Log } from "../../utils";

@Directive({
  selector: "drewlabswebcam",
})
export class CameraDirective implements OnDestroy {
  @Input() set width(value: number) {
    Log(value);
  }
  @Input() set height(value: number) {
    Log(value);
  }

  public constructor(private element: ElementRef) {
    if (element.nativeElement instanceof HTMLVideoElement) {
      throw new Error(
        "Invalid Element reference, This directive require an HTML Video Element"
      );
    } else {
      console.log(this.element.nativeElement);
    }
  }

  ngOnDestroy(): void {
    // Provide destruction implementation to the component
  }
}
