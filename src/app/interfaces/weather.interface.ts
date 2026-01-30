export interface WeatherData {
  cod: number;
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    description: string;
  }>;
  wind: {
    speed: number;
  };
}

export interface ForecastData {
  list: Array<{
    dt_txt: string;
    weather: Array<{
      id: number;
    }>;
    main: {
      temp: number;
    };
  }>;
}
