import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

export class BreadCrumbUIState {
  constructor(public label: string, public link: string) {}
}

@Injectable()
export class BreadCrumbStore {
  private appBreadCrumbs: BehaviorSubject<
    Array<BreadCrumbUIState>
  > = new BehaviorSubject([]);

  updateBreadCrumbs(list: Array<BreadCrumbUIState>) {
    this.appBreadCrumbs.next(list);
  }

  get breadCrumbs() {
    return this.appBreadCrumbs.asObservable();
  }
}
