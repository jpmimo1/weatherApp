'use client'

import { useCallback, useState } from 'react'

export interface Geolocation {
  active?: boolean,
  coordinates: {
    lat: number,
    lon: number
  }
}

const getCurrentPositionPromise = () => {
  return new Promise<GeolocationCoordinates>((resolve, rejects) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(position.coords);
      }, (error) => {
        rejects(error.message);
      })

    } else {
      rejects('Browser not compatible with geolocation');
    }
  });
}

const initialGeolocation = { active: undefined, coordinates: { lat: 0, lon: 0 } };

export const useGeolocation = () => {
  const [geolocation, setGeolocation] = useState<Geolocation>(initialGeolocation);

  const getGeolocation = useCallback(
    async () => {
      try {
        const coords = await getCurrentPositionPromise();
        setGeolocation({ active: true, coordinates: { lat: coords.latitude, lon: coords.longitude } });
      } catch (ex) {
        setGeolocation({ ...initialGeolocation, active: false });
        console.log(ex);
      }
    }, []);

  return { geolocation, getGeolocation }
}
