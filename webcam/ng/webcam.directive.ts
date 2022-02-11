import { Directive, ElementRef, Input, OnDestroy } from "@angular/core";

@Directive({
  selector: "drewlabswebcam",
})
export class CameraDirective implements OnDestroy {
  @Input() set width(value: number) {}
  @Input() set height(value: number) {}

  public constructor(private element: ElementRef) {
    if (element.nativeElement instanceof HTMLVideoElement) {
      throw new Error(
        "Invalid Element reference, This directive require an HTML Video Element"
      );
    }
  }

  ngOnDestroy(): void {
    // Provide destruction implementation to the component
  }
}
