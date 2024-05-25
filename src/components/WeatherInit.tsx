'use client'

import { useGeolocation, useInitWeatherStore } from "@/hooks";
import { coordinatesLocationRequest, ipRequest, locationIpRequest, weatherRequest } from "@/requests";
import { Location, WeatherLocation, useWeatherStore } from "@/store/weatherApp";
import moment from "moment";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const WeatherInit = () => {
  const currentWeatherLocation = useWeatherStore(state => state.currentWeatherLocation);
  const weatherLocationShow = useWeatherStore(state => state.weatherLocationShow);
  const { setWeatherShow, setCurrentL, setCurrentW, setCurrentWLShow, setLoading, setOpenMenu } = useWeatherStore(state => state);
  const { geolocation, getGeolocation } = useGeolocation();

  const getWeatherFromApi = async (coord: { lat: number, lon: number }) => {
    const weatherAPI = await weatherRequest(coord);
    setWeatherShow(weatherAPI);
  }

  const getLocationFromApi = async (coord: { lat: number, lon: number }) => {
    const locationAPI = await coordinatesLocationRequest(coord);

    if (locationAPI.features.length === 0) {
      throw 'error';
    }
    const { country, city, state, lat, lon, region, place_id } = locationAPI.features[0].properties;

    const currentLocation: Location = { country, city, state, lat, lon, region, place_id };

    setCurrentL(currentLocation);
    setCurrentW();
  }

  const getLocationIpFromApi = async () => {
    const publicIp = await ipRequest();
    const location = await locationIpRequest({ ip: publicIp });

    return location;
  }


  useEffect(() => {
    getGeolocation();
  }, []);

  useInitWeatherStore();

  const handlerGetWeather = async () => {
    try {
      setLoading(true);
      let coords = { lat: 0, lon: 0 };
      if (geolocation.active) {
        coords = geolocation.coordinates;
      } else {
        const location = await getLocationIpFromApi();
        coords = { lat: location.lat, lon: location.lon }
      }

      const isSameLocation = compareLocationStoreWithGeolocation(currentWeatherLocation, coords);

      if (!isSameLocation) {
        await getLocationFromApi(coords);
      }
      setCurrentWLShow();
    } catch (e) {
      toast.error('There was an error trying to get the location');
      setLoading(false);
    }
  }

  useEffect(() => {
    if (typeof geolocation.active === 'boolean') {
      handlerGetWeather();
    }
  }, [geolocation]);


  const handleWeatherLocationShowChange = async () => {
    if (!weatherLocationShow) {
      return;
    }
    try {
      setLoading(true);
      const isQueryValid = lastQueryIsValid(weatherLocationShow);
      const { lat, lon } = weatherLocationShow.location || { lat: 0, lon: 0 };
      if (!isQueryValid) {
        await getWeatherFromApi({ lat, lon });
      }
      setOpenMenu(false);
    } catch (ex) {
      toast.error('There was an error trying to get the weather');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleWeatherLocationShowChange();
  }, [weatherLocationShow])

  return null;
}


//Return true if currentLocation is almost equal to geolocation
const compareLocationStoreWithGeolocation = (currentWL: WeatherLocation, coords: { lat: number, lon: number }) => {
  const errorRange = 1;

  const currentLocation = currentWL.location;
  const geoLocation = coords;

  if (!currentLocation) {
    return false;
  }

  return (
    Math.abs(currentLocation.lat - geoLocation.lat) < errorRange &&
    Math.abs(currentLocation.lon - geoLocation.lon) < errorRange
  )
}

const lastQueryIsValid = (currentWL: WeatherLocation) => {
  const { readingTime } = currentWL;
  if (!readingTime) {
    return false;
  }

  const time = Math.abs(moment(readingTime).diff(moment(), 'minutes'));

  return time < 10;
}
