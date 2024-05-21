'use client'

import { useWeatherStore } from '@/store/weatherApp'

import { CgMenu } from 'react-icons/cg'
import { cn } from '@/lib/utils';
import { AiOutlineClose } from 'react-icons/ai';
import Image from 'next/image';
import appIcon from '@/assets/weatherIcons/rainbow.svg';
import { ReactElement, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import styles from './styles.module.css';
import { useTheme } from 'next-themes';
import moment from 'moment';
import { ScrollArea } from '../ui/scroll-area';

interface Props {
  sidebar: ReactElement,
  content: ReactElement
}

type dayStates = "day" | "sunrise" | "sunset" | "night";
type themes = 'dark' | 'light';

const dayStateToThemeData: { [key in dayStates]: { theme: themes, classBackground: string, backgroundSidebar: string, backgroundContent: string } } = {
  'day': { theme: 'light', classBackground: styles.dayBackground, backgroundSidebar: 'bg-background/70', backgroundContent: 'bg-background/50' },
  'night': { theme: 'dark', classBackground: styles.nightBackgound, backgroundSidebar: '', backgroundContent: '' },
  'sunrise': { theme: 'light', classBackground: styles.sunrise, backgroundSidebar: 'bg-background/80', backgroundContent: 'bg-background/60' },
  'sunset': { theme: 'light', classBackground: styles.sunrise, backgroundSidebar: 'bg-background/80', backgroundContent: 'bg-background/60' }
}

export const LayoutContent = ({ sidebar, content }: Props) => {
  const openMenu = useWeatherStore(state => state.openMenu);
  const setOpenMenu = useWeatherStore(state => state.setOpenMenu);
  const weatherLocationShow = useWeatherStore(state => state.weatherLocationShow);



  const { setTheme, theme } = useTheme();

  const dayState = useMemo(() => {
    //error sunrise or sunset min
    const errorMin = 30;

    if (!weatherLocationShow?.weather) {
      setTheme('light');
      return 'day';
    }

    const currentDateTime = moment.utc(weatherLocationShow?.weather.current.dt + weatherLocationShow.weather.timezone_offset, 'X');
    const sunriseDateTime = moment.utc((weatherLocationShow?.weather.current.sunrise || 0) + weatherLocationShow.weather.timezone_offset, 'X');
    const sunsetDateTime = moment.utc((weatherLocationShow?.weather.current.sunset || 0) + weatherLocationShow.weather.timezone_offset, "X");


    const minSunrise = currentDateTime.diff(sunriseDateTime, 'minutes');
    if (Math.abs(minSunrise) <= errorMin) {
      return 'sunrise';
    }

    const minSunset = currentDateTime.diff(sunsetDateTime, 'minutes');
    if (Math.abs(minSunset) <= errorMin) {
      return 'sunset';
    }

    if (minSunrise > 0 && minSunset < 0) {
      return 'day';
    }

    return 'night';
  }, [weatherLocationShow]);

  useEffect(() => {
    setTheme(dayStateToThemeData[dayState].theme);
  }, [dayState]);


  return (
    <div
      className={
        cn(
          dayStateToThemeData[dayState].classBackground,
          "absolute h-full flex flex-nowrap transition-transform duration-500 ease-in-out ",
          openMenu ? "translate-x-0" : "-translate-x-1/2"
        )
      }
    >
      {/* Sidebar Area */}
      <div className={cn("h-full w-screen flex flex-col", dayStateToThemeData[dayState].backgroundSidebar)}>
        <div className="px-2 flex justify-between items-center h-[64px] shrink-0">
          <div className='flex items-center gap-4'>
            <Image src={appIcon} alt='Wheather App' width={40} height={40} />
            <h1 className='text-2xl'>Wheather App</h1>
          </div>
          <Button variant='ghost' size='icon' onClick={() => { setOpenMenu(false); }}>
            <AiOutlineClose size='1.8em' />
          </Button>
        </div>
        <Separator className='h-[2px]' />
        <div className='grow overflow-hidden'>
          {sidebar}
        </div>
      </div>
      {/* Content Area */}
      <div className={cn("h-full w-screen", dayStateToThemeData[dayState].backgroundContent)}>
        <div className="px-2 h-[64px] flex items-center">
          <Button variant='ghost' size='icon' onClick={() => { setOpenMenu(true); }}>
            <CgMenu size='1.8em' />
          </Button>
        </div>
        <div>
          {content}
        </div>
      </div>
    </div>
  )
}
