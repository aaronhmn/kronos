import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ForecastItem {
  date: string;
  iconPath: string;
  temp: number;
}

@Component({
  selector: 'app-weather-info',
  imports: [CommonModule],
  templateUrl: './weather-info.html',
  styleUrl: './weather-info.css'
})
export class WeatherInfo {
  country = input.required<string>();
  currentDate = input.required<string>();
  weatherIconPath = input.required<string>();
  temperature = input.required<number>();
  condition = input.required<string>();
  humidity = input.required<number>();
  windSpeed = input.required<string>();
  forecastData = input<ForecastItem[]>([]);

  roundedTemp = computed(() => Math.round(this.temperature()));
}
