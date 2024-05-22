import { Card } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useWeatherStore } from '@/store/weatherApp'
import React, { useMemo } from 'react'
import { HourlyItem } from './HourlyItem'
import moment, { Moment } from 'moment'
import { Current } from '@/types'


export type Suntype = {
  type: 'sunset' | 'sunrise',
  time: number
}

export const HourlyCard = () => {
  const weather = useWeatherStore(state => state.weatherLocationShow?.weather);

  const { timezone_offset, hourly, current } = weather || {};

  const timezoneOffset = timezone_offset || 0;

  const hourlyToShow = hourly || [];

  const { sunrise, sunset } = current || {};

  const hourlyToShowSunriseSunset = useMemo(() => {
    return hourlyToShow.reduce<Array<Current | Suntype>>((prev, hourly) => {
      const prevT = prev as Array<Current | Suntype>;

      if (prevT.length === 0) {
        return [...prev, hourly]
      }

      const lastItem = prevT[prevT.length - 1];

      if (!(lastItem as Current).dt) {
        return [...prev, hourly];
      }

      const prevDateTime = moment.utc((lastItem as Current).dt + timezoneOffset, 'X');
      const nextDateTime = moment.utc(hourly.dt + timezoneOffset, 'X');

      const sunriseDateTime = moment.utc((sunrise || 0) + timezoneOffset, 'X');
      const sunsetDateTime = moment.utc((sunset || 0) + timezoneOffset, 'X');

      const prevTime = moment.utc(moment(prevDateTime.format('HH:mm:ss'), 'HH:mm:ss'));
      const nextTime = moment.utc(moment(nextDateTime.format('HH:mm:ss'), 'HH:mm:ss'));

      const sunriseTime = moment.utc(moment(sunriseDateTime.format('HH:mm:ss'), 'HH:mm:ss'));
      const sunsetTime = moment.utc(moment(sunsetDateTime.format('HH:mm:ss'), 'HH:mm:ss'));

      const diffSunrisePrev = sunriseTime.diff(prevTime, 'minutes');
      const diffNextSunrise = nextTime.diff(sunriseTime, 'minutes');

      if (diffSunrisePrev >= 0 && diffNextSunrise > 0) {
        return [...prev, { type: 'sunrise', time: sunrise || 0 }];
      }

      const diffSunsetPrev = sunsetTime.diff(prevTime, 'minutes');
      const diffNextSunset = nextTime.diff(sunsetTime, 'minutes');

      if (diffSunsetPrev > 0 && diffNextSunset >= 0) {
        return [...prev, { type: 'sunset', time: sunset || 0 }, hourly];
      }

      return [...prev, hourly];
    }, []);
  }, [sunrise, sunset]);

  return (
    <Card className='p-4 bg-background/25'>
      <ScrollArea>
        <div className='flex flex-nowrap gap-4'>
          {
            hourlyToShowSunriseSunset.map((hourWeather, i) => {
              return <HourlyItem hourWeather={hourWeather} key={i} />
            })
          }
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </Card>
  )
}
