import { Component, Input } from '@angular/core';
import { ITableColumn } from './ng-data-table.component';

@Component({
  selector: 'app-ng-table-content',
  template: `
    <clr-datagrid>
      <ng-container *ngFor="let item of colFields">
        <clr-dg-column [clrDgField]="item.field">{{ item.name }}</clr-dg-column>
      </ng-container>

      <clr-dg-row *ngFor="let item of values">
        <ng-container *ngFor="let i of colFields">
          <clr-dg-cell>{{ item[i.field] }}</clr-dg-cell>
        </ng-container>
      </clr-dg-row>

      <clr-dg-footer>
        {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }}
        {{ valuesCount }} items
        <clr-dg-pagination
          [clrDgPageSize]="pageSize"
          #pagination
          [clrDgTotalItems]="valuesCount"
        >
          <clr-dg-page-size [clrPageSizeOptions]="pageSizeOption"
            >Users per page</clr-dg-page-size
          >
        </clr-dg-pagination>
      </clr-dg-footer>
    </clr-datagrid>
  `
})
export class NgTableContentComponent {
  @Input() colFields: ITableColumn[];
  @Input() values: any[];
  @Input() pageSize: number;
  @Input() valuesCount: number;
  @Input() pageSizeOption: number[] | string[];
}
