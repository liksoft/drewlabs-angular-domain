import {
  Component,
  OnInit,
  Input,
  AfterContentInit,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';
import { ClrDatagridStateInterface, ClrDatagrid } from '@clr/angular';
import { isDefined, isObject } from '../../utils';

export const DEFAULT_DATAGRID_PAGINATOR_LENGTH = 10;
export interface ITableColumn {
  name: string;
  field: string;
  suffix?: string;
  isStatusField?: boolean;
  actualStatusField?: string;
  customClass?: string;
  defaultValue?: any;
  children?: any[];
}

export interface ISourceRequestParam {
  skip: number | any;
  take: number | any;
  order?: string;
  by?: string;
}

export interface ISourceRequestQueryParameters {
  perPage: number;
  page?: number;
  order?: string;
  by?: string;
}

export interface ISource<T> {
  data: T[];
  total: number;
}

export interface IDataSourceService<T> {
  getItems(params: ISourceRequestParam | ISourceRequestQueryParameters): Promise<T>;
}

const PENDING_STATE = 0;
const SUCCESS_STATE = 1;
const FAILED_STATE = 2;

@Component({
  selector: 'app-ng-data-table',
  templateUrl: './ng-data-table.component.html',
  styleUrls: ['./ng-data-table.component.css']
})
export class NgDataTableComponent<T extends ISource<T>>
  implements OnInit, AfterContentInit {
  @Input() public dataSource: any[] = [];
  @Input() public sourceService: IDataSourceService<T>;
  @Input() public dataFields: ITableColumn[];
  @Input() public columnAlignment: string;
  @Input() public showBorders: boolean;
  @Input() public sorting: boolean;
  @Input() public paging: boolean;
  @Input() public pageSize: number;
  @Input() public showPageSizeSelector = true;
  @Input() public allowedPageSizes: number[];
  @Input() public canEditItem: boolean;
  @Input() public canDeleteItem: boolean;
  @Input() public canViewItem: boolean;
  @Output() public editItemEvent = new EventEmitter();
  @Output() public deleteItemEvent = new EventEmitter();
  @Output() public viewItemEvent = new EventEmitter();

  public showGrid = false;
  public totalCount: number;
  public loading = true;
  public currentGridState: ClrDatagridStateInterface;

  @ViewChild('clrDataGrid', {static: false}) dataGrid: ClrDatagrid;

  ngOnInit() { }

  ngAfterContentInit(): void {
    this.showGrid = true;
  }

  /**
   * @description Public method to re-trigger the computation of grid data manually
   */
  public refreshData() {
    if (this.currentGridState) {
      this.refresh(this.currentGridState);
    }
  }

  /**
   * @description Handler for the ClrDataGrid refresh event
   * @param state [[ClrDatagridStateInterface]]
   */
  public refresh(state: ClrDatagridStateInterface) {
    // We convert the filters from an array to a map,
    // because that's what our backend-calling service is expecting
    this.currentGridState = state;
    this.loading = true;
    if (state.page) {
      const request: ISourceRequestQueryParameters = {
        page: state.page.current,
        perPage: state.page.size
      };
      this.sourceService.getItems(request).then((value: T) => {
        if (isDefined(value)) {
          this.dataSource = value.data;
          this.totalCount = value.total;
        }
        this.loading = false;
      });
    }
  }

  getItemValue(item: any, field: string) {
    if (field.indexOf('.') !== -1) {
      const innerFields: Array<string> = field.split('.');
      let currentObj = item;
      for (const v of innerFields) {
        if (isObject(currentObj) && currentObj[v]) {
          currentObj = currentObj[v];
        } else {
          currentObj = null;
          break;
        }
      }
      return currentObj;
    } else {
      return item[field];
    }
  }

  getContentStyleClass(item: object, index: ITableColumn): string {
    if (index.isStatusField) {
      const status = item[index.actualStatusField];
      switch (status) {
        case PENDING_STATE:
          return ` ${index.customClass ? index.customClass : ''} label label-warning `;
        case SUCCESS_STATE:
          return ` ${index.customClass ? index.customClass : ''} label label-success `;
        case FAILED_STATE:
          return ` ${index.customClass ? index.customClass : ''} label label-danger `;
        default:
          return ` ${index.customClass ? index.customClass : ''} label `;
      }
    }
    return index.customClass ? index.customClass : '';
  }
}
