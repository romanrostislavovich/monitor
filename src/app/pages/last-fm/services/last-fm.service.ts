import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, tap,} from "rxjs";

export interface LastFmStatistic {
  playCount: number;
  albumCount: number;
  artistCount: number;
}

export interface LastFmConfig {
  CHECK_INTERVAL: number;
}

interface LastFmResponse {
  user: any;
}
@Injectable({
  providedIn: 'root'
})
export class LastFmService {
  config: LastFmConfig = {
    CHECK_INTERVAL: 5000,// 5 секунд
  }

  statistic: BehaviorSubject<LastFmStatistic> = new BehaviorSubject<LastFmStatistic>({
    playCount: 0,
    albumCount: 0,
    artistCount: 0
  });

  private apiKey = '2981642d5907ab750205413c93daaf5b';

  constructor(
    private httpClient: HttpClient,
  ) { }

  getStatistic(): Observable<any> {
    return this.httpClient.get(`https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=Cvoboda-Rabctvo&api_key=${this.apiKey}&format=json`).pipe(
      tap((v: any) => {
        this.statistic.next({
          playCount: v.user.playcount,
          albumCount: v.user.album_count,
          artistCount: v.user.artist_count
        })
      })
    );
  }

  start() {
    const getLastFMStatistic = () => {
      this.getStatistic().subscribe(v => {});
    }
    setInterval(getLastFMStatistic, this.config.CHECK_INTERVAL);
  }
}
