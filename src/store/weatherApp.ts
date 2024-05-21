import { Weather } from '@/types/weather';
import { produce } from 'immer';
import moment, { Moment } from 'moment';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type Location = {
  lat: number,
  lon: number,
  country: string,
  state?: string,
  city?: string,
  region?: string,
  place_id: string
}

export type WeatherLocation = {
  location?: Location,
  weather?: Weather,
  readingTime?: number
}

type State = {
  currentWeatherLocation: WeatherLocation,
  favoritesWeatherLocation: WeatherLocation[],
  weatherLocationShow?: WeatherLocation,
  loading: boolean,
  openMenu: boolean
}

type Action = {
  setWeatherLocationToShow: (wl: WeatherLocation) => void,
  setCurrentWL: (wl: WeatherLocation) => void,
  setCurrentW: (w?: Weather) => void,
  setCurrentL: (l: Location) => void,
  setFavoritesWL: (wls: WeatherLocation[]) => void,
  addFavoriteWL: (newWl: WeatherLocation) => void,
  removeFavoriteWL: (index: number) => void,
  clearWeatherStore: () => void,
  setCurrentWLShow: () => void,
  setWeatherShow: (w: Weather) => void,
  setFavoriteWLShow: (index: number) => void,
  setLoading: (newLoading: boolean) => void,
  setOpenMenu: (newOpenMenu: boolean) => void,

}

export const useWeatherStore = create<State & Action>()(devtools((set) => ({
  currentWeatherLocation: {},
  favoritesWeatherLocation: [],
  loading: false,
  openMenu: false,
  setWeatherLocationToShow: (wl) => set(() => ({ weatherLocationShow: wl })),
  setCurrentWL: (wl) => set(produce((state: State) => { state.currentWeatherLocation = wl })),
  setCurrentW: (w) => set(produce((state: State) => {
    console.log(w);
    if (!w) {
      state.currentWeatherLocation.weather = undefined, state.currentWeatherLocation.readingTime = undefined
    } else {
      state.currentWeatherLocation.weather = w, state.currentWeatherLocation.readingTime = moment().valueOf()
    }
  })),
  setCurrentL: (l) => set(produce((state: State) => { state.currentWeatherLocation.location = l })),
  setFavoritesWL: (wls) => set(produce((state: State) => { state.favoritesWeatherLocation = wls })),
  addFavoriteWL: (newWl) => set(produce((state: State) => {
    const existL = state.favoritesWeatherLocation.findIndex(({ location }) => {
      return location?.place_id === newWl.location?.place_id;
    })
    if (existL === -1) {
      state.favoritesWeatherLocation.push(newWl)
    }
  })),
  removeFavoriteWL: (index) => set(produce((state: State) => { state.favoritesWeatherLocation = state.favoritesWeatherLocation.filter((_, i) => i !== index) })),
  clearWeatherStore: () => set({ currentWeatherLocation: {}, favoritesWeatherLocation: [], weatherLocationShow: undefined }),
  setCurrentWLShow: () => set(produce((state: State) => { state.weatherLocationShow = state.currentWeatherLocation })),
  setWeatherShow: (w) => set(produce((state: State) => {
    if (!state.weatherLocationShow) {
      return;
    }
    state.weatherLocationShow.weather = w;
    const readingTime = moment().valueOf();
    state.weatherLocationShow.readingTime = readingTime;

    if (state.currentWeatherLocation.location?.place_id === state.weatherLocationShow.location?.place_id) {
      state.currentWeatherLocation.weather = w;
      state.currentWeatherLocation.readingTime = readingTime;
    }

    const iFavorite = state.favoritesWeatherLocation.findIndex(({ location }) => {
      return location?.place_id === state.weatherLocationShow?.location?.place_id;
    })

    if (iFavorite !== -1) {
      state.favoritesWeatherLocation[iFavorite].weather = w;
      state.favoritesWeatherLocation[iFavorite].readingTime = readingTime;
    }
  })),
  setFavoriteWLShow: (index) => set(produce((state: State) => { state.weatherLocationShow = state.favoritesWeatherLocation[index] })),
  setLoading: (loading) => set({ loading }),
  setOpenMenu: (openMenu) => set({ openMenu }),
})));
