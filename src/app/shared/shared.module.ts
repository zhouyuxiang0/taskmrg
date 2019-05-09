import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule, MatNativeDateModule, MatTabsModule } from '@angular/material/';

import { AgeInputComponent } from './age-input/age-input.component';
import { AreaListComponent } from './area-list/area-list.component';
import { ChipsListComponent } from './chips-list/chips-list.component';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DirectiveModule } from '../directive/directive.module';
import { IdentityInputComponent } from './identity-input/identity-input.component';
import { ImageListSelectComponent } from './image-list-select/image-list-select.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    ImageListSelectComponent,
    AgeInputComponent,
    ChipsListComponent,
    IdentityInputComponent,
    AreaListComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    DirectiveModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatTabsModule
  ],
  exports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    DirectiveModule,
    FormsModule,
    ReactiveFormsModule,
    AgeInputComponent,
    MatButtonToggleModule,
    MatChipsModule,
    MatTabsModule,
    ImageListSelectComponent,
    ChipsListComponent,
    IdentityInputComponent,
    AreaListComponent
  ],
  entryComponents: [
    ConfirmDialogComponent
  ]
})
export class SharedModule { }
