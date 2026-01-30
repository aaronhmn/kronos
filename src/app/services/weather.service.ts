import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherData, ForecastData } from '../interfaces/weather.interface';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly API_KEY = '93c8dc4eb809e8360d5b75c09e1aa14a';
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';

  getWeather(city: string): Observable<WeatherData> {
    return this.http.get<WeatherData>(
      `${this.BASE_URL}/weather?q=${city}&appid=${this.API_KEY}&units=metric&lang=es`
    );
  }

  getForecast(city: string): Observable<ForecastData> {
    return this.http.get<ForecastData>(
      `${this.BASE_URL}/forecast?q=${city}&appid=${this.API_KEY}&units=metric&lang=es`
    );
  }

  getWeatherIcon(id: number): string {
    if (id <= 232) return 'tormenta.svg';
    if (id <= 321) return 'llovizna.svg';
    if (id <= 531) return 'lluvia.svg';
    if (id <= 622) return 'nieve.svg';
    if (id <= 781) return 'atmosfera.svg';
    if (id === 800) return 'despejado.svg';
    return 'nubes.svg';
  }

  getBackgroundImage(weatherId: number): string {
    if (weatherId >= 200 && weatherId <= 232) return 'assets/bg-lluvia.jpg';
    if (weatherId >= 300 && weatherId <= 321) return 'assets/bg-lluvia.jpg';
    if (weatherId >= 500 && weatherId <= 531) return 'assets/bg-lluvia.jpg';
    if (weatherId >= 600 && weatherId <= 622) return 'assets/bg-nieve.jpg';
    if (weatherId >= 701 && weatherId <= 781) return 'assets/bg-nublado.jpg';
    if (weatherId === 800) return 'assets/bg.jpg';
    if (weatherId >= 801 && weatherId <= 804) return 'assets/bg-nublado.jpg';
    return 'assets/bg.jpg';
  }
}
