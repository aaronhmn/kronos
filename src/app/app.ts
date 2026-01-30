import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { SearchBar } from './components/search-bar/search-bar';
import { WeatherInfo } from './components/weather-info/weather-info';
import { SearchMessage } from './components/search-message/search-message';
import { NotFound } from './components/not-found/not-found';
import { WeatherService } from './services/weather.service';
import { WeatherData, ForecastData } from './interfaces/weather.interface';

@Component({
  selector: 'app-root',
  imports: [
    SearchBar,
    WeatherInfo,
    SearchMessage,
    NotFound
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  private readonly weatherService = inject(WeatherService);
  private readonly renderer = inject(Renderer2);

  currentView: 'search' | 'weather' | 'notFound' = 'search';
  weatherData: WeatherData | null = null;
  forecastData: Array<{
    date: string;
    iconPath: string;
    temp: number;
  }> = [];

  ngOnInit(): void {
    this.changeBackground('assets/bg.jpg');
  }

  onSearch(city: string): void {
    this.weatherService.getWeather(city).subscribe({
      next: (data) => {
        if (data.cod !== 200) {
          this.currentView = 'notFound';
          this.changeBackground('assets/bg.jpg');
          return;
        }

        this.weatherData = data;
        const weatherId = data.weather[0].id;

        const bgImage = this.weatherService.getBackgroundImage(weatherId);
        this.changeBackground(bgImage);

        this.loadForecast(city);

        this.currentView = 'weather';
      },
      error: () => {
        this.currentView = 'notFound';
        this.changeBackground('assets/bg.jpg');
      }
    });
  }

  private changeBackground(imageUrl: string): void {
    document.body.style.setProperty('--bg-image', `url('${imageUrl}')`);
  }

  private loadForecast(city: string): void {
    this.weatherService.getForecast(city).subscribe({
      next: (data) => {
        const timeTaken = '12:00:00';
        const todayDate = new Date().toISOString().split('T')[0];

        this.forecastData = data.list
          .filter(item =>
            item.dt_txt.includes(timeTaken) &&
            !item.dt_txt.includes(todayDate)
          )
          .map(item => ({
            date: this.formatDate(item.dt_txt),
            iconPath: `assets/tiempo/${this.weatherService.getWeatherIcon(item.weather[0].id)}`,
            temp: Math.round(item.main.temp)
          }));
      }
    });
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: '2-digit'
    };
    return date.toLocaleDateString('es-ES', options);
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: '2-digit'
    };
    return currentDate.toLocaleDateString('es-ES', options);
  }

  getWindSpeed(): string {
    if (!this.weatherData) return '0';
    const speedKmh = this.weatherData.wind.speed * 3.6;
    return speedKmh.toFixed(1);
  }

  getWeatherIconPath(): string {
    if (!this.weatherData) return '';
    const weatherId = this.weatherData.weather[0].id;
    return `assets/tiempo/${this.weatherService.getWeatherIcon(weatherId)}`;
  }
}
