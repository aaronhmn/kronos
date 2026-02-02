import { Component, output, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { debounceTime, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

interface CityOption {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule, CommonModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar {
  @ViewChild('cityInputRef') cityInputRef!: ElementRef<HTMLInputElement>;

  search = output<string>();

  cityInput = '';
  suggestions: CityOption[] = [];
  showSuggestions = false;
  private readonly excludedWords = ['de', 'del', 'la', 'el', 'lo', 'los', 'las'];
  private inputSubject = new Subject<string>();
  private spainCountries = ['ES', 'Spain']; // Para priorizar España

  constructor(private http: HttpClient) {
    this.inputSubject.pipe(debounceTime(200)).subscribe(query => {
      if (query.trim().length > 1) {
        this.fetchSuggestions(query);
      } else {
        this.suggestions = [];
        this.showSuggestions = false;
      }
    });
  }

  onInputChange(): void {
    const words = this.cityInput.split(' ');

    const result = words.map((word, index) => {
      if (!word) return '';

      const lower = word.toLowerCase();

      if (index === 0) {
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      }

      if (this.excludedWords.includes(lower)) {
        return lower;
      }

      return lower.charAt(0).toUpperCase() + lower.slice(1);
    });

    this.cityInput = result.join(' ');
    this.inputSubject.next(this.cityInput);
  }

  fetchSuggestions(query: string): void {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=10&appid=${environment.openWeatherApiKey}`;

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        // Separar ciudades de España del resto
        const spainCities: CityOption[] = [];
        const otherCities: CityOption[] = [];

        data.forEach(item => {
          const city: CityOption = {
            name: item.name,
            country: item.country,
            lat: item.lat,
            lon: item.lon
          };

          if (this.spainCountries.includes(item.country)) {
            spainCities.push(city);
          } else {
            otherCities.push(city);
          }
        });

        // Priorizar ciudades de España
        this.suggestions = [...spainCities, ...otherCities].slice(0, 5);
        this.showSuggestions = this.suggestions.length > 0;
      },
      error: () => {
        this.suggestions = [];
        this.showSuggestions = false;
      }
    });
  }

  selectSuggestion(suggestion: CityOption): void {
    this.cityInput = `${suggestion.name}, ${suggestion.country}`;
    this.showSuggestions = false;
    this.suggestions = [];
  }

  onSearch(): void {
    if (this.cityInput.trim()) {
      this.search.emit(this.cityInput.trim());
      this.cityInput = '';
      this.showSuggestions = false;
      this.suggestions = [];
      this.cityInputRef.nativeElement.blur();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  closeSuggestions(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 100);
  }
}