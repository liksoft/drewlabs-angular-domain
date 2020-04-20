import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { DatgridHeaderComponent } from './datgrid-header.component';
import { CommonModule } from '@angular/common';
import { RessourceAssignmentModule } from '../ressource-assignment/ressource-assignment.module';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule,
        RessourceAssignmentModule
    ],
    exports: [
        DatgridHeaderComponent
    ],
    declarations: [
        DatgridHeaderComponent,
    ]

})
export class DatagridHeaderModule { }
