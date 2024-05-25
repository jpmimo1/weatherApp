import { useWeatherStore } from '@/store/weatherApp'
import { Current, Daily } from '@/types'
import moment from 'moment'
import Image from 'next/image'
import React, { useMemo } from 'react'

interface Props {
  weather: Daily
}
const weatherIcons = 'https://openweathermap.org/img/wn/'

export const DailyItem = ({ weather }: Props) => {
  const weatherLocationShow = useWeatherStore(state => state.weatherLocationShow);

  const { timezone_offset } = weatherLocationShow?.weather || {};

  const { dt, temp: { min, max }, weather: weatherCurrent } = weather;

  const dtCurrent = useMemo(() => {
    return moment.utc(dt + (timezone_offset || 0), 'X');
  }, [dt, timezone_offset]);

  const iconDayly = useMemo(() => {
    if (weatherCurrent.length===0) {
      return null;
    }
    
    const firstWC=weatherCurrent[0];

    return <Image className='w-10 h-10' src={`${weatherIcons}${firstWC.icon}@2x.png`} width={100} height={100} alt={firstWC.description} />
  }, [weatherCurrent])

  return (
    <div className='p-3'>
      <div className='text-sm flex items-center'>
        <div>
          {dtCurrent.format('MMMM DD, ddd')}
        </div>
        <div className='grow flex justify-end items-center gap-2'>
          {`${Math.round(max)} / ${Math.round(min)} °C`}
          <div>{iconDayly}</div>
        </div>
      </div>
    </div>
  )
}
