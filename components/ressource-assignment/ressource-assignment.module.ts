import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ClarityModule } from '@clr/angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DrewlabsRessourceAssignmentService } from './ressource-assignment.service';
import { DrewlabsRessourceAssignmentComponent } from './ressource-assignment.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ClarityModule,
    ScrollingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DrewlabsRessourceAssignmentComponent
  ],
  exports: [
    DrewlabsRessourceAssignmentComponent
  ],
  providers: [
    DrewlabsRessourceAssignmentService
  ]
})
export class RessourceAssignmentModule {
}
