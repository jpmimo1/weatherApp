'use client'

import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { FaCheck, FaCloudSun, FaLocationDot } from 'react-icons/fa6'
import { MdAddCircle, MdOutlineFavorite } from 'react-icons/md'
import { useWeatherStore } from '@/store/weatherApp'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Separator } from './ui/separator'
import { Skeleton } from './ui/skeleton'
import { Button } from './ui/button'
import { SearchPlaces } from './SearchPlaces/SearchPlaces'
import { placeToTexts } from '@/lib/placeToTexts'
import { Toggle } from './ui/toggle'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { ScrollArea } from './ui/scroll-area'


export const Sidebar = () => {
  const [addNewFavoriteActive, setAddNewFavoriteActive] = useState(false);
  const loading = useWeatherStore(state => state.loading);
  const weatherLocationShow = useWeatherStore(state => state.weatherLocationShow);
  const currentWeatherLocation = useWeatherStore(state => state.currentWeatherLocation);
  const favoritesWeatherLocation = useWeatherStore(state => state.favoritesWeatherLocation);
  const setWeatherLocationToShow = useWeatherStore(state => state.setWeatherLocationToShow);

  const { country, state, city, region } = currentWeatherLocation.location || {};

  const timerCloseFavorites = useRef<NodeJS.Timeout>();

  const { line1, line2 } = placeToTexts({ country: country || '', state, city, region });

  const selectCurrent = useMemo(() => {
    return weatherLocationShow?.location?.place_id === currentWeatherLocation.location?.place_id;
  }, [weatherLocationShow, currentWeatherLocation]);

  return (
    <ScrollArea className='h-full max-h-full'>
      <div className='py-6 px-4'>
        {
          loading && !currentWeatherLocation.location ?
            (<SkeletonItem />) : (
              <Toggle
                pressed={selectCurrent}
                onPressedChange={() => { setWeatherLocationToShow(currentWeatherLocation); }}
                className='h-auto w-full gap-4 items-center py-3 font-medium justify-start px-4'
              >
                <FaLocationDot size='1.3em' />
                <div className=''>
                  <div className='text-left'>{line1}</div>
                  <div className='text-left text-sm text-slate-600'>{line2}</div>
                </div>
                <div className='flex-grow flex justify-end'>
                  {selectCurrent || !weatherLocationShow?.weather ? (
                    loading ?
                      <AiOutlineLoading3Quarters size='1.3em' className='mr-2 animate-spin' /> :
                      <FaCheck className='text-green-600' size='1.4em' />)
                    : null
                  }
                </div>
              </Toggle>
            )
        }
        <Accordion type="single" collapsible className="w-full" onValueChange={(value) => {
          if (timerCloseFavorites.current) {
            clearTimeout(timerCloseFavorites.current);
          }

          timerCloseFavorites.current = setTimeout(() => {
            if (value != 'favorites') {
              setAddNewFavoriteActive(false);
            }
          }, 500)

        }}>
          <AccordionItem value="favorites">
            <AccordionTrigger>
              <div className='flex gap-4 items-center py-3 px-4'>
                <MdOutlineFavorite size='1.3em' />
                <span>
                  My Favorites
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className='px-3'>
                <div className='max-h-[374px] overflow-hidden flex'>

                  <ScrollArea className='w-full'>
                    {
                      favoritesWeatherLocation.map((favoriteWL, _) => {
                        const { location } = favoriteWL;
                        const { country, city, region, state, place_id } = location || {};

                        const { line1, line2 } = placeToTexts({ country: country || '', city, region, state });

                        const selectFavorite = location?.place_id === weatherLocationShow?.location?.place_id;

                        return (
                          <Fragment key={place_id}>
                            <Toggle
                              onPressedChange={() => { setWeatherLocationToShow(favoriteWL); }}
                              pressed={selectFavorite}
                              className='h-auto w-full py-2 px-3 flex justify-start'
                            >
                              <div className='flex flex-col items-start'>
                                <div>{line1}</div>
                                <div className='text-xs text-slate-600'>{line2}</div>
                              </div>
                              <div className='flex-grow flex justify-end'>
                                {selectFavorite ? (
                                  loading ?
                                    <AiOutlineLoading3Quarters size='1.3em' className='mr-2 animate-spin' /> :
                                    <FaCheck className='text-green-600' size='1.4em' />)
                                  : null
                                }
                              </div>
                            </Toggle>
                            <Separator />
                          </Fragment>
                        );
                      })
                    }
                  </ScrollArea>
                </div>
                <div className='flex gap-4 items-center py-3'>
                  {addNewFavoriteActive ?
                    <SearchPlaces setAddNewFavoriteActive={setAddNewFavoriteActive} /> :
                    (<Button variant='outline' className='w-full' onClick={() => { setAddNewFavoriteActive(true) }}>
                      <MdAddCircle size='1.3em' className='mr-3' />
                      <span>
                        Add New
                      </span>
                    </Button>)}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </ScrollArea>
  )
}

const SkeletonItem = () => {
  return (
    <div>
      <Skeleton className='w-full h-[64px] rounded-xl' />
    </div>
  );
}
