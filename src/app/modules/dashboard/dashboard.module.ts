import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dasboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [CommonModule, DashboardRoutingModule, SharedModule, CoreModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule {}
