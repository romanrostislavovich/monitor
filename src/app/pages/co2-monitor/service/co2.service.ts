import { Injectable } from '@angular/core';

import chalk from 'chalk';

import {ElectronService} from "../../../core/services";
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {CO2Item} from "../interfaces/CO2ItemIterface";
import {CO2Config} from "../interfaces/CO2ConfigIterface";
import {CO2Statistic} from "../interfaces/CO2StatisticInterface";

// Углеродоемкость по умолчанию (г CO₂/кВт·ч)
const CARBON_INTENSITY = {
  'Германия': 400,
  'Франция': 50,
  'США': 430,
  'Китай': 600,
  'Россия': 340,
};



@Injectable({
  providedIn: 'root'
})
export class Co2Service {
// Глобальные переменные для накопления данных
  totalCO2 = 0;
  startTime = new Date();
  beURL: string = 'http://localhost:3000/co2/';

  config: CO2Config = {
    CHECK_INTERVAL: 5000,// 5 секунд
    COUNTRY: 'Беларусь', // Можно заменить на автоматическое определение
    LOG_FILE: 'co2_log.csv',
  }

  statistic: BehaviorSubject<CO2Statistic> = new BehaviorSubject<CO2Statistic>({
    currentPower: '0',
    totalEmissions: '0',
    emissions: '0',
    intensity: 0,
    globalEmissions: 0,
  });

  constructor(
    private http: HttpClient,
    private electronService: ElectronService,
  ) {

  }

  init() {
    this.http.get<CO2Item[]>(this.beURL).subscribe((result) => {
      const global = result.reduce((acum, current) => {
        return acum += +current.emissions;
      }, 0)
      const current = this.statistic.value;
      this.statistic.next({
        ...current,
        globalEmissions: global
      })
    })
  }


  // Функция для получения текущей нагрузки
  async getPowerUsage() {
    try {
      const [cpu, gpu] = await Promise.all([
        this.electronService.si.currentLoad(),
        this.electronService.si.graphics(),
        this.electronService.si.battery(),
      ]);


      // Примерная оценка потребления (Вт)
      const cpuPower = cpu.currentLoad * 0.5; // 0.5 Вт на 1% нагрузки (усредненно)
      const gpuPower = gpu.controllers[0]?.utilizationGpu ? gpu.controllers[0].utilizationGpu * 2 : 0;
      const basePower = 5; // Базовая мощность (экран, ОЗУ и пр.)

      return cpuPower + gpuPower + basePower;
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      return 30; // Возвращаем среднее значение при ошибке
    }
  }

  // Функция для получения углеродоемкости через API
/*  private async getCarbonIntensity(country): number {
    try {
      const response = await axios.get(`https://api.electricitymap.org/v3/carbon-intensity/latest?zone=${country}`, {
        headers: { 'auth-token': 'YOUR_API_KEY' }, // Замените на реальный ключ
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.data.carbonIntensity || 0;
    } catch {
      return 500 || CARBON_INTENSITY[country];
    }
  }*/

  // Расчет выбросов CO₂



  start() {
    // Запускаем мониторинг
    const calculateCO2 = async() => {
      const power = await this.getPowerUsage();
      //  const intensity = this.getCarbonIntensity(CONFIG.COUNTRY);
      const hours = this.config.CHECK_INTERVAL / 3600000; // Переводим интервал в часы
      const intensity = 500;
      const co2 = (power / 1000) * hours * intensity;

      this.totalCO2 += co2;

      const co2Item: CO2Item = {
        power: power.toFixed(2),
        intensity,
        emissions: co2.toFixed(2),
        date: Date.now()
      };

      const current = this.statistic.value;
      this.http.post(this.beURL, {
        ...co2Item
      }).subscribe(() => {
        this.statistic.next({
          totalEmissions: this.totalCO2.toFixed(2),
          emissions: co2Item.emissions,
          intensity: co2Item.intensity,
          currentPower: co2Item.power,
          globalEmissions: +(current.globalEmissions + +co2Item.emissions).toFixed(2)
        });
      })

    }
    console.log(chalk.green.bold('Запуск мониторинга...'));

    setInterval(calculateCO2, this.config.CHECK_INTERVAL);
  }
}
