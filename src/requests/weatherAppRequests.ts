import { weatherInsAxios } from "./baseRequest";
import { Weather } from "@/types/weather";
import { axiosResponseHandler } from './axiosResponseHandler';
import { AutocompletePlaces, LocationIp } from "@/types";
import { CoordinatesLocation } from "@/types/coordinatesLocation";
import axios from "axios";

export const ipRequest = async () => {
  const response = await axios.get<{ ip: string }>('https://api.ipify.org?format=json');

  const { ip } = axiosResponseHandler(response);

  return ip;

}

export const weatherRequest = async (body: { lat: number, lon: number }) => {
  const response = await weatherInsAxios.post<Weather>('/weather', body);

  const weather = axiosResponseHandler(response);

  return weather;
};

export const locationIpRequest = async (body: { ip: string }) => {
  const response = await weatherInsAxios.post<LocationIp>('/locationIp', body);

  const locationIp = axiosResponseHandler(response);

  return locationIp;
};

export const coordinatesLocationRequest = async (body: { lat: number, lon: number }) => {
  const response = await weatherInsAxios.post<CoordinatesLocation>('/coordinatesLocation', body);

  const coordinatesLocation = axiosResponseHandler(response);

  return coordinatesLocation;
};

export const autocompletePlacesRequest = async (body: { text: string }) => {
  const response = await weatherInsAxios.post<AutocompletePlaces>('/autocompletePlaces', body);

  const autocompletePlaces = axiosResponseHandler(response);

  return autocompletePlaces;
};
