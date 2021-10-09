import { Component, EventEmitter, Output, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { IDynamicForm } from "../../../../core/contracts";
import { ChildComponent } from "../types";

@Component({
  selector: "app-repetable-group-child",
  templateUrl: "repeatable-group-child.component.html",
  styles: [
    `
      .maring-bottom {
        margin-bottom: 16px;
      }
      .icon-variants {
        border: 1px dashed #666;
        border-radius: 0.15rem;
        cursor: pointer;
      }
    `,
  ],
})
export class RepeatableGroupChildComponent implements ChildComponent {
  // #region Component outputs
  @Output() componentDestroyer = new EventEmitter();
  // #endregion Component outputs

  // #region Component inputs
  @Input() formGroup!: FormGroup;
  @Input() form!: IDynamicForm;
  @Input() index!: number;
  @Input() label!: string;
  // tslint:disable-next-line: no-inferrable-types
  @Input() singleColumnView: boolean = false;
  @Input() performingAction = false;
  // #endregion Component inputs

  public destroy(e: Event) {
    this.componentDestroyer.emit();
    e?.preventDefault();
  }
}
