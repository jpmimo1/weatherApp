'use client'

import { Card } from '@/components/ui/card';
import { useWeatherStore } from '@/store/weatherApp';
import React, { Fragment } from 'react'
import { DailyItem } from './DailyItem';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export const DailyCard = () => {
  const weatherLocationShow = useWeatherStore(state => state.weatherLocationShow);

  const hourlyShow = weatherLocationShow?.weather?.daily || [];

  if (!weatherLocationShow) {
    return <SkeletonCard />
  }

  return (
    <Card className='p-4 bg-background/25'>
      {
        hourlyShow.map((weather, i) => {
          return (
            <Fragment key={weather.dt}>
              <DailyItem weather={weather} />
              {i < hourlyShow.length - 1 ?
                <Separator /> : null
              }
            </Fragment >
          )
        })
      }
    </Card>
  )
};


const SkeletonCard = () => {
  return (<Skeleton className='h-[552.46px] w-full' />)
}
