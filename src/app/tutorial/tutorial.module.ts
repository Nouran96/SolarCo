import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material/material.module';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MainComponentModule } from '../main-component/main-component.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { TutorialService } from '../shared/services/tutorial.service';
import { AllTutorialsComponent } from './all-tutorials/all-tutorials.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { CreateTutorialComponent } from './create-tutorial/create-tutorial.component';


@NgModule({
  declarations: [
    AllTutorialsComponent,
    TutorialComponent,
    CreateTutorialComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    MainComponentModule,
    NgxPaginationModule,
  ],
  providers: [
    TutorialService
  ]
})
export class TutorialModule { }