import { useWeatherStore } from '@/store/weatherApp';
import { Current } from '@/types';
import moment from 'moment';
import Image from 'next/image';
import React, { useMemo } from 'react'
import { Suntype } from './HourlyCard';
import { FiSunset, FiSunrise } from "react-icons/fi";

interface Props {
  hourWeather: Current | Suntype
}

const weatherIcons = 'https://openweathermap.org/img/wn/'

export const HourlyItem = ({ hourWeather }: Props) => {
  const timezone_offset = useWeatherStore(state => state.weatherLocationShow?.weather?.timezone_offset) || 0;



  const dateTimeString = useMemo(() => {
    if ((hourWeather as Current).dt) {
      return moment.utc((hourWeather as Current).dt + timezone_offset, 'X').format('h a');
    } else {
      return moment.utc((hourWeather as Suntype).time + timezone_offset, 'X').format('h:mm a');
    }
  }, [hourWeather, timezone_offset]);

  const iconHourly = useMemo(() => {
    if ((hourWeather as Suntype).type) {
      const typeSun = (hourWeather as Suntype).type;
      const icon = (
        <div className='w-14 h-14 flex justify-center items-center'>
          {typeSun === 'sunrise' ? <FiSunrise size={'1.8em'} /> : <FiSunset size={'1.8em'} />}
        </div>
      );
      return icon;
    }

    const hourWeatherT = hourWeather as Current;

    return <Image className='w-14 h-14' src={`${weatherIcons}${hourWeatherT.weather[0].icon}@2x.png`} width={100} height={100} alt='weather' />
  }, [hourWeather])

  const tempString = useMemo(() => {
    if ((hourWeather as Suntype).type) {
      const typeSun = (hourWeather as Suntype).type;
      const typeString = typeSun === 'sunrise' ? 'Sunrise' : 'Sunset'
      return typeString;
    }

    const hourWeatherT = hourWeather as Current;

    return `${Math.round(hourWeatherT.temp)}°`
  }, [hourWeather])

  return (
    <div className='flex items-center flex-col w-14'>
      <div className='text-xs text-nowrap'>{dateTimeString}</div>
      {iconHourly}
      <div className='text-sm text-nowrap'>{tempString}</div>
    </div>
  )
};
