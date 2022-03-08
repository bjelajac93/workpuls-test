import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { MaterialModule } from '../material/material.module';
import { BulkEditComponent } from './components/bulk-edit/bulk-edit.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [HeaderComponent, BulkEditComponent],
  imports: [CommonModule, MaterialModule, SharedModule],
  exports: [HeaderComponent]
})
export class CoreModule {}
