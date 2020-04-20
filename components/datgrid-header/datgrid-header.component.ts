import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'drewlas-datgrid-header',
  templateUrl: './datgrid-header.component.html',
  styles: [
  ],
})
export class DatgridHeaderComponent implements OnInit {

  // Component outputs properties
  @Output() createEvent = new EventEmitter<object>();
  @Output() refreshEvent = new EventEmitter<object>();
  @Output() exportToExcelEvent = new EventEmitter<object>();
  @Output() assigned = new EventEmitter<object>();

  // Component input properties
  @Input() createButtonDisabled = false;
  @Input() refreshButtonDisabled = false;
  @Input() assignmentButtonDisabled = false;
  @Input() showExportDropdown = false;
  @Input() showAssignmentButton = false;
  @Input() permissions: string|string[];
  @Input() selectedIds: number[];
  @Input() assignableEntity: string|number;
  @Input() buttonClass = 'btn btn-sm btn-secondary';

  constructor() { }

  ngOnInit(): void { }

}
