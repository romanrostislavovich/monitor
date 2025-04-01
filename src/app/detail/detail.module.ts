import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailRoutingModule } from './detail-routing.module';

import { DetailComponent } from './detail.component';
import { SharedModule } from '../shared/shared.module';
import {Co2MonitorComponent} from "../pages/co2-monitor/components/co2-monitor.component";
import {LastFmComponent} from "../pages/last-fm/components/last-fm/last-fm.component";

@NgModule({
  declarations: [DetailComponent],
    imports: [CommonModule, SharedModule, DetailRoutingModule, Co2MonitorComponent, LastFmComponent]
})
export class DetailModule {}
