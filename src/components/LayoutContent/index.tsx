'use client'

import { useWeatherStore } from '@/store/weatherApp'

import { CgMenu } from 'react-icons/cg'
import { cn } from '@/lib/utils';
import { AiOutlineClose } from 'react-icons/ai';
import Image from 'next/image';
import appIcon from '@/assets/weatherIcons/rainbow.svg';
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import styles from './styles.module.css';
import { useTheme } from 'next-themes';
import moment from 'moment';
import { IoReloadSharp } from "react-icons/io5";
import { getDayStateLocalStorageTheme } from '@/lib/localStorageTheme';
interface Props {
  sidebar: ReactElement,
  content: ReactElement
}

const waitTime = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  })
}

type dayStates = "day" | "sunrise" | "sunset" | "night";
type themes = 'dark' | 'light';

const dayStateToThemeData: { [key in dayStates]: { theme: themes, classBackground: string, backgroundSidebar: string, backgroundContent: string } } = {
  'day': { theme: 'light', classBackground: styles.dayBackground, backgroundSidebar: 'bg-background/70', backgroundContent: 'bg-background/50' },
  'night': { theme: 'dark', classBackground: styles.nightBackgound, backgroundSidebar: 'bg-background/30', backgroundContent: '' },
  'sunrise': { theme: 'light', classBackground: styles.sunrise, backgroundSidebar: 'bg-background/80', backgroundContent: 'bg-background/60' },
  'sunset': { theme: 'light', classBackground: styles.sunrise, backgroundSidebar: 'bg-background/80', backgroundContent: 'bg-background/60' }
}

export const LayoutContent = ({ sidebar, content }: Props) => {
  const openMenu = useWeatherStore(state => state.openMenu);
  const setOpenMenu = useWeatherStore(state => state.setOpenMenu);
  const weatherLocationShow = useWeatherStore(state => state.weatherLocationShow);



  const { setTheme, theme } = useTheme();

  const [dayState, setDayState] = useState<dayStates>(getDayStateLocalStorageTheme());

  const getNewDayState = async () => {
    await waitTime();
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
  }

  const setNewDayStateTheme = async () => {
    const newDayState = await getNewDayState();
    setDayState(newDayState);
    setTheme(dayStateToThemeData[newDayState].theme);
  }

  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      setNewDayStateTheme();
    }, 1000);

  }, [weatherLocationShow]);

  useEffect(() => {
    setDayState(theme === 'light' ? 'day' : 'night');
  }, []);

  const toogleMenu = () => {
    setOpenMenu(!openMenu);
  }

  return (
    <div
      className={
        cn(
          dayStateToThemeData[dayState].classBackground,
          "absolute h-full flex flex-nowrap transition-transform duration-500 ease-in-out md:w-[calc(100vw_+_400px)] lg:w-screen",
          openMenu ? "translate-x-0" : "-translate-x-1/2 md:-translate-x-[400px] lg:translate-x-0"
        )
      }
    >
      {/* Sidebar Area */}
      <div className={cn("h-full w-screen flex flex-col md:w-[400px] md:min-w-[400px] lg:w-[350px] lg:min-w-[350px]", dayStateToThemeData[dayState].backgroundSidebar)}>
        <div className="px-2 lg:px-4 flex justify-between items-center h-[64px] shrink-0">
          <div className='flex items-center gap-4'>
            <Image src={appIcon} alt='Wheather App' width={40} height={40} />
            <h1 className='text-2xl'>Wheather App</h1>
          </div>
          <Button className='md:hidden' variant='ghost' size='icon' onClick={() => { setOpenMenu(false); }}>
            <AiOutlineClose size='1.8em' />
          </Button>
        </div>
        <Separator className='h-[2px]' />
        <div className='grow overflow-hidden'>
          {sidebar}
        </div>
        <Separator />
        <div className='py-4 text-sm'>
          <footer>
            <p className='text-center'>© Copyrigth 2024 - made by  <a className='text-green-600 font-semibold ml-1 underline dark:text-green-300' href='https://www.jeanpaulflores.com' target='_blank'>Jean Paul F.</a></p>
          </footer>
        </div>
      </div>
      {/* Content Area */}
      <div className={cn("h-full w-screen flex flex-col lg:w-auto lg:overflow-hidden lg:flex-grow", dayStateToThemeData[dayState].backgroundContent)}>
        <div className="px-2 h-[64px] flex items-center shrink-0 lg:px-8">
          <Button className='lg:hidden' variant='ghost' size='icon' onClick={() => { toogleMenu(); }}>
            <CgMenu size='1.8em' />
          </Button>
        </div>
        <div className='grow overflow-hidden'>
          {content}
        </div>
      </div>
    </div>
  )
}
