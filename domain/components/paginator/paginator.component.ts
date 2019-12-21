import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {
  @Output()
  currentListChanged: EventEmitter<Array<any>> = new EventEmitter();
  @Input()
  chunkedList: Array<Array<any>> = [];
  currentPaginatorIndex = 0;
  paginatorList = [];
  constructor() {}

  ngOnInit() {}

  /**
   * @description Load the next list of items
   */
  next() {
    this.currentPaginatorIndex += 1;
    this.goto(this.currentPaginatorIndex);
  }
  /**
   * @description Load the previous list of items
   */
  prev() {
    this.currentPaginatorIndex -= 1;
    this.goto(this.currentPaginatorIndex);
  }

  goto(index: number) {
    this.currentPaginatorIndex = index;
    this.paginatorList = this.paginator(
      this.currentPaginatorIndex,
      this.chunkedList.length
    );
    const data = this.chunkedList[this.currentPaginatorIndex]
      ? this.chunkedList[this.currentPaginatorIndex]
      : [];
    this.currentListChanged.emit(data);
  }

  /**
   * @description retourne une liste de paginateur
   * @param startIndex The index of the first in the list [[number]]
   * @param startIndex The index of the last item in the list [[number]]
   */
  paginator(startIndex: number, endIndex: number, delta = 2): any[] {
    const current = startIndex;
    const left = current - delta;
    const right = current + delta + 1;
    const range = [];
    range.push(1);
    for (let i = startIndex - delta; i <= startIndex + delta; i++) {
      if (i >= left && i < right && i < endIndex && i > 1) {
        range.push(i);
      }
    }
    range.push(endIndex);

    return range;
  }
}
