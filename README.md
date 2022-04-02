# Docs

## Smart form component

```html
  <ngx-smart-form [form]="form" [submitable]="true" [template]="template" [addTemplate]="addTemplate" >
    <!---->
    <ng-template #template let-config="value" let-control="control">
      <app-dynamic-inputs
        (value)="onValueChange($event)"
        [class]="config.containerClass"
        [hidden]="config.hidden"
        [control]="control"
        [inputConfig]="config"
        [listItems]="config.items"
      ></app-dynamic-inputs>
    </ng-template>

    <ng-template #submitButton let-handler>
      <button class="btn btn-primary" (click)="handler($event)">
        <clr-icon shape="circle-arrow" dir="up"></clr-icon>
        SOUMETTRE
      </button>
    </ng-template>

    <ng-template #addTemplate let-handler>
      <div class="button" (click)="handler($event)">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="8px"
          height="8px"
          viewBox="0 0 24 24"
        >
          <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
        </svg>
      </div>
    </ng-template>
  </ngx-smart-form>
```
