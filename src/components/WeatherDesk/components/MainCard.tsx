'use client'

import Image from 'next/image';
import { useWeatherStore } from '@/store/weatherApp';
import clearSkyD from '@/assets/weatherIcons/clear-sky-d.svg';
import clearSkyN from '@/assets/weatherIcons/clear-sky-n.svg';
import fewCloudsD from '@/assets/weatherIcons/few-clouds-d.svg';
import fewCloudsN from '@/assets/weatherIcons/few-clouds-n.svg';
import scatteredClouds from '@/assets/weatherIcons/scattered-clouds.svg';
import brokenCloudsD from '@/assets/weatherIcons/broken-clouds-d.svg';
import brokenCloudsN from '@/assets/weatherIcons/broken-clouds-n.svg';
import showerRain from '@/assets/weatherIcons/shower-rain.svg';
import rainD from '@/assets/weatherIcons/rain-d.svg';
import rainN from '@/assets/weatherIcons/rain-n.svg';
import thunderstorm from '@/assets/weatherIcons/thunderstorm.svg';
import snowD from '@/assets/weatherIcons/snow-d.svg';
import snowN from '@/assets/weatherIcons/snow-n.svg';
import mist from '@/assets/weatherIcons/mist.svg';
import { useMemo } from 'react';
import { placeToTexts } from '@/lib/placeToTexts';
import { FaLocationDot } from 'react-icons/fa6';
import { Skeleton } from '@/components/ui/skeleton';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import { IoReloadSharp } from 'react-icons/io5';


const codeIconToImage = {
  '01d': clearSkyD,
  '01n': clearSkyN,
  '02d': fewCloudsD,
  '02n': fewCloudsN,
  '03d': scatteredClouds,
  '03n': scatteredClouds,
  '04d': brokenCloudsD,
  '04n': brokenCloudsN,
  '09d': showerRain,
  '09n': showerRain,
  '10d': rainD,
  '10n': rainN,
  '11d': thunderstorm,
  '11n': thunderstorm,
  '13d': snowD,
  '13n': snowN,
  '50d': mist,
  '50n': mist
};

export const MainCard = () => {
  const loading = useWeatherStore(state => state.loading);
  const weatherLocationShow = useWeatherStore(state => state.weatherLocationShow);

  const { weather, location } = weatherLocationShow || {};

  const { country, city, region, state } = location || {};

  const { current } = weather || {};

  const { temp, feels_like, weather: cWeather } = current || {};

  const { description, icon } = (cWeather || [{ description: '', icon: '' }])[0];

  const { tempShow, feelsLikeShow, descriptionShow, iconShow } = useMemo(() => {
    const tempShow = Math.round(temp || 0);
    const feelsLikeShow = Math.round(feels_like || 0);
    const descriptionShow = description.charAt(0).toUpperCase() + description.slice(1);

    const iconShow = codeIconToImage[icon as keyof typeof codeIconToImage || '04d']

    return { tempShow, feelsLikeShow, descriptionShow, iconShow }
  }, [temp, feels_like, description, icon]);

  const { line1 } = placeToTexts({ country: country || '', city, region, state });


  if (!weatherLocationShow) {
    return <SkeletonCard />
  }

  return (
    <div className=' py-6 '>
      <div className='flex items-center justify-center gap-4  flex-col-reverse sm:flex-row sm:gap-8'>
        <div className='flex flex-col items-center sm:items-start z-10'>
          <div className='text-7xl xl:text-8xl text-nowrap mb-2'>{`${tempShow}° C`}</div>
          <div className='text-nowrap mb-1 sm:ml-3'>{descriptionShow}</div>
          <div className='flex gap-4 items-baseline text-nowrap mb-1 sm:ml-3'>{line1}
            {loading ? <AiOutlineLoading3Quarters size='1em' className='animate-spin' /> : <FaLocationDot />}
          </div>
          <div className='text-nowrap sm:ml-3'>{`Feels like ${feelsLikeShow} ° C`}</div>
        </div>
        <div className='flex items-center justify-center relative w-[180px] '>
          <Image className='sm:absolute right-0 min-w-[150px] w-[130px] lg:min-w-[180px] z-10' src={iconShow} alt={description} width={180} />
        </div>
      </div>
    </div>
  )
}


const SkeletonCard = () => {
  return (<Skeleton className='h-[374px] w-full sm:h-[208px] lg:h-[232px]' />)
}
