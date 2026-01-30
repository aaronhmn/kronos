import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar {
  search = output<string>();

  cityInput = '';
  private readonly excludedWords = ['de', 'del', 'la', 'el', 'lo', 'los', 'las'];

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
  }

  onSearch(): void {
    if (this.cityInput.trim()) {
      this.search.emit(this.cityInput.trim());
      this.cityInput = '';
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}
