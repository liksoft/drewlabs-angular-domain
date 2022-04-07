import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { first, tap } from 'rxjs/operators';
import { SelectableControlItems, SelectOptionsClient } from '../../core';
import { createIntersectionObserver } from '../helpers';
import { SELECT_CONTROL_OPTIONS_CLIENT } from '../types';

// TODO : Add an alternative if the intersection observer is not supported

@Directive({
  selector: '[prefetchOptions]',
})
export class FetchOptionsDirective implements AfterViewInit, OnDestroy {
  //#region Directive inputs
  @Input() loaded!: boolean;
  @Input() params!: string | any[] | undefined;
  //#endregion Directive inputs

  //#region Directive outputs
  @Output() loadedChange = new EventEmitter<boolean>();
  @Output() itemsChange = new EventEmitter<SelectableControlItems[]>();
  //#endregion Directive outputs

  // Directive properties
  private _observer = createIntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.executeQuery();
      }
    });
  });

  // Directive constructor
  constructor(
    private elemRef: ElementRef,
    @Inject(SELECT_CONTROL_OPTIONS_CLIENT) private client: SelectOptionsClient
  ) {}

  ngAfterViewInit() {
    this._observer.observe(this.elemRef.nativeElement);
  }

  private executeQuery() {
    if (!this.loaded && this.params) {
      // Query select options
      this.client.request(this.params).pipe(
        first(),
        tap((state) => this.itemsChange.emit(state))
      );
    }
  }

  ngOnDestroy(): void {
    // Disconnect from the observer
    this._observer.disconnect();
  }
}
