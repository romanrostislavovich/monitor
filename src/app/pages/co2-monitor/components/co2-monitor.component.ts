import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import { Co2Service } from "../service/co2.service";
import { CO2Config } from '../interfaces/CO2ConfigIterface';
import { CO2Statistic } from '../interfaces/CO2StatisticInterface';


@Component({
  selector: 'app-co2-monitor',
  standalone: true,
  imports: [],
  templateUrl: './co2-monitor.component.html',
  styleUrl: './co2-monitor.component.scss'
})
export class Co2MonitorComponent implements OnInit {
  statistic!: CO2Statistic;
  CO2Config: CO2Config = this.co2Service.config;
  constructor(
    private router: Router,
    private co2Service: Co2Service,
  ) {
  }

  ngOnInit() {
    this.co2Service.init();
    this.co2Service.start();
    this.co2Service.statistic.subscribe((v) => {
      this.statistic = v;
    })
  }

}

















