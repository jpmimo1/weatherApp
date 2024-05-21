import { WeatherLocation, useWeatherStore } from "@/store/weatherApp";
import { useEffect, useRef } from "react"

interface LocalStorageWeather {
  currentWeatherLocation: WeatherLocation,
  favoritesWeatherLocation: WeatherLocation[],
}

export const useInitWeatherStore = () => {
  const {
    setCurrentWL,
    setFavoritesWL,
    clearWeatherStore,
    currentWeatherLocation,
    favoritesWeatherLocation
  } =
    useWeatherStore(state => state);

  const initFromStore = useRef(false);


  useEffect(() => {
    const weatherLocalStorage = localStorage.getItem('weatherState');
    try {
      if (weatherLocalStorage) {
        const { currentWeatherLocation, favoritesWeatherLocation } = JSON.parse(weatherLocalStorage) as LocalStorageWeather;
        setCurrentWL(currentWeatherLocation);
        setFavoritesWL(favoritesWeatherLocation);
      } else {
        clearWeatherStore();
      }
    } catch (ex) {
      clearWeatherStore();
    } finally {
      setTimeout(() => {
        initFromStore.current = true;
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (!initFromStore.current) {
      return;
    }
    localStorage.setItem(
      'weatherState',
      JSON.stringify({ currentWeatherLocation, favoritesWeatherLocation })
    );
  }, [currentWeatherLocation, favoritesWeatherLocation]);
}
