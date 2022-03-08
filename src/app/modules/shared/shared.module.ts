import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { CardTotalComponent } from './components/card-total/card-total.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CardTotalComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    MaterialModule,
    CardTotalComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DecimalPipe]
})
export class SharedModule {}
