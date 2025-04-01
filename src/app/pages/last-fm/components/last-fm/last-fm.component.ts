import {Component, OnInit} from '@angular/core';
import {LastFmService, LastFmStatistic} from "../../services/last-fm.service";

@Component({
  selector: 'app-last-fm',
  standalone: true,
  imports: [],
  templateUrl: './last-fm.component.html',
  styleUrl: './last-fm.component.scss'
})
export class LastFmComponent implements OnInit {
  statistic!: LastFmStatistic;
  constructor(
    private lastFmService: LastFmService,
  ) {
  }

  ngOnInit() {
    this.lastFmService.start();
    this.lastFmService.statistic.subscribe(v => {
      this.statistic = v;
    })
  }
}
